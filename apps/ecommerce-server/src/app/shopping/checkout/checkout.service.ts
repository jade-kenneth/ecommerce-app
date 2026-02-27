import { Inject, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { AsyncEventDispatcher } from '~/async-event-module/async-event-dispatcher';
import { Tokens } from '../../../types/tokens';
import { safeParseFloat } from '../../../util/safe-parse-float';
import {
  CheckoutInput,
  OrderStatus,
  PaymentMethodType,
  ShippingType,
} from '../../__generated/graphql-types';
import { ProductsService } from '../../products/products.service';
import { AccountService } from '../../identity/account/account.service';
import { Cart, CartRepository } from '../cart/repositories/cart.repository';
import { Order, OrdersRepository } from '../order/repositories/orders.repository';
import { CheckoutMethodSettingsService } from './checkout-method-settings.service';

@Injectable()
export class CheckoutService {
  constructor(
    @Inject(Tokens.CartsToken)
    private readonly carts: CartRepository,
    @Inject(Tokens.OrdersToken)
    private readonly orders: OrdersRepository,
    private readonly checkoutMethodSettingsService: CheckoutMethodSettingsService,
    private readonly products: ProductsService,
    private readonly accounts: AccountService,
    private readonly events: AsyncEventDispatcher,
  ) {}

  public async shippingOptions(params?: { includeInactive?: boolean }) {
    return this.checkoutMethodSettingsService.shippingOptions(params);
  }

  public async paymentMethods(params?: { includeInactive?: boolean }) {
    return this.checkoutMethodSettingsService.paymentMethods(params);
  }

  public async updateShippingMethodStatus(params: {
    type: ShippingType;
    isActive: boolean;
  }) {
    return this.checkoutMethodSettingsService.updateShippingMethodStatus(
      params,
    );
  }

  public async updatePaymentMethodStatus(params: {
    type: PaymentMethodType;
    isActive: boolean;
  }) {
    return this.checkoutMethodSettingsService.updatePaymentMethodStatus(params);
  }

  private async calculateOrderSummary(
    cart: Cart,
    shippingFeeOverride?: string,
  ): Promise<
    Omit<Cart, 'items'> & {
      items: {
        productId: Types.ObjectId;
        quantity: number;
        unitPrice: string;
        totalPrice: string;
        name: string;
        image?: string;
      }[];
    }
  > {
    const toAmount = (value: unknown) => safeParseFloat(value, 0);

    const resolvedShippingFee = shippingFeeOverride ?? cart.shippingFee ?? '0';
    const shippingFeeAmount = toAmount(resolvedShippingFee);

    const pricedItems = await Promise.all(
      cart.items.map(async (item) => {
        const product = await this.products.findProduct(item.productId);

        if (!product) {
          throw new Error('Product not found');
        }

        const unitPrice =
          toAmount(product.price) * (1 - toAmount(product.discount) / 100);
        const quantity = toAmount(item.quantity);
        const totalPrice = unitPrice * quantity;

        return {
          ...item,
          quantity: item.quantity,
          productId: product._id,
          name: product.name,
          image: product.thumbnail,
          unitPrice: unitPrice.toFixed(2),
          totalPrice: totalPrice.toFixed(2),
        };
      }),
    );

    const subtotalAmount = pricedItems.reduce(
      (sum, item) => sum + toAmount(item.totalPrice),
      0,
    );
    const taxAmount = subtotalAmount * 0.12;

    cart.subtotal = subtotalAmount.toFixed(2);
    cart.tax = taxAmount.toFixed(2);
    cart.shippingFee = resolvedShippingFee;
    cart.total = (subtotalAmount + taxAmount + shippingFeeAmount).toFixed(2);

    return { ...cart, items: pricedItems };
  }

  public async checkout(params: {
    accountId: string;
    input: CheckoutInput;
  }): Promise<Order> {
    const now = new Date();
    const accountId = new Types.ObjectId(params.accountId);
    const cart = await this.carts.find(accountId);

    if (!cart || !cart.items?.length) {
      throw new Error('Cart is empty');
    }

    const shippingOptionId = new Types.ObjectId(params.input.shippingOptionId);
    const paymentMethodId = new Types.ObjectId(params.input.paymentMethodId);

    const shippingOption =
      await this.checkoutMethodSettingsService.findShippingOption(
        shippingOptionId,
      );
    if (!shippingOption || !shippingOption.isActive) {
      throw new Error('Invalid shipping option');
    }

    const paymentMethod = await this.checkoutMethodSettingsService.findPaymentMethod(
      paymentMethodId,
    );
    if (!paymentMethod || !paymentMethod.isActive) {
      throw new Error('Invalid payment method');
    }

    const calculatedSummary = await this.calculateOrderSummary(
      cart,
      shippingOption.fee,
    );

    const order: Order = {
      gaClientId: params.input.clientId,
      _id: new Types.ObjectId(),
      accountId,
      items: calculatedSummary.items.map((item) => ({
        ...item,
        rating: 0,
        message: '',
      })),
      shippingOption,
      paymentMethod,
      subtotal: calculatedSummary.subtotal,
      tax: calculatedSummary.tax,
      shippingFee: calculatedSummary.shippingFee,
      total: calculatedSummary.total,
      status: OrderStatus.PENDING,
      createdAt: now,
      updatedAt: now,
    };

    await this.orders.create(order);

    const account = await this.accounts.findAccount(accountId);

    try {
      const eventItems = await Promise.all(
        calculatedSummary.items.map(async (item) => {
          const quantity = safeParseFloat(item.quantity ?? 0, 0);
          const total =
            item.totalPrice ??
            (safeParseFloat(item.unitPrice ?? 0, 0) * quantity)
              .toFixed(2)
              .toString();

          return {
            name: item?.name,
            image: item?.image,
            quantity,
            total,
          };
        }),
      );

      await this.events.dispatch('OrderCreated', {
        orderId: order._id.toString(),
        accountId: accountId.toString(),
        emailAddress: account?.emailAddress,
        total: order.total,
        itemCount: order.items.length,
        items: eventItems,
      });
    } catch (error) {
      console.error('OrderCreated event dispatch failed:', error);
    }

    try {
      await this.carts.delete(accountId);
    } catch (error) {
      console.error('Cart cleanup failed:', error);
    }

    return order;
  }
}
