import { Inject, Injectable } from '@nestjs/common';
import {
  AddToCartInput,
  CartStatus,
  CheckoutInput,
  OrderStatus,
  PaymentMethod,
  PaymentMethodType,
  ShippingOption,
  ShippingType,
} from '../__generated/graphql-types';

import { Types } from 'mongoose';
import { AsyncEventDispatcher } from '~/async-event-module/async-event-dispatcher';
import { Filter } from '../../libs/repository';
import { ObjectType } from '../../types/common';
import { Tokens } from '../../types/tokens';
import { ProductsService } from '../products/products.service';
import { AccountService } from '../user-session/account/account.service';
import { Cart, CartRepository } from './repositories/carts.repository';
import { Order, OrdersRepository } from './repositories/orders.repository';

const SHIPPING_OPTIONS: ShippingOption[] = [
  {
    _id: new Types.ObjectId('000000000000000000000010'),
    type: ShippingType.STANDARD,
    label: 'Standard',
    description: '3-5 business days',
    fee: '50',
    estimatedDays: '3-5',
  },
  {
    _id: new Types.ObjectId('000000000000000000000011'),
    type: ShippingType.EXPRESS,
    label: 'Express',
    description: '1-2 business days',
    fee: '100',
    estimatedDays: '1-2',
  },
  {
    _id: new Types.ObjectId('000000000000000000000012'),
    type: ShippingType.SAME_DAY,
    label: 'Same day',
    description: 'Same day delivery',
    fee: '150',
    estimatedDays: '0-1',
  },
];

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    _id: new Types.ObjectId('000000000000000000000020'),
    type: PaymentMethodType.GCASH,
    label: 'GCash',
    description: 'Pay with GCash',
    isActive: true,
  },
  {
    _id: new Types.ObjectId('000000000000000000000021'),
    type: PaymentMethodType.CARD,
    label: 'Card',
    description: 'Debit or credit card',
    isActive: true,
  },
  {
    _id: new Types.ObjectId('000000000000000000000022'),
    type: PaymentMethodType.BANK_TRANSFER,
    label: 'Bank transfer',
    description: 'Manual bank transfer',
    isActive: true,
  },
  {
    _id: new Types.ObjectId('000000000000000000000023'),
    type: PaymentMethodType.CASH_ON_DELIVERY,
    label: 'Cash on delivery',
    description: 'Pay when the order arrives',
    isActive: true,
  },
];

@Injectable()
export class CartsService {
  constructor(
    @Inject(Tokens.CartsToken)
    private readonly carts: CartRepository,
    @Inject(Tokens.OrdersToken)
    private readonly orders: OrdersRepository,
    private readonly products: ProductsService,
    private readonly accounts: AccountService,
    private readonly events: AsyncEventDispatcher,
  ) {}

  private findShippingOption(id: Types.ObjectId) {
    return SHIPPING_OPTIONS.find((option) => option._id.equals(id));
  }

  private findPaymentMethod(id: Types.ObjectId) {
    return PAYMENT_METHODS.find((method) => method._id.equals(id));
  }

  private async calculateOrderSummary(
    cart: Cart,
    shippingFeeOverride?: string,
  ): Promise<Cart> {
    const toAmount = (value: unknown) => {
      const amount = Number(value);
      return Number.isFinite(amount) ? amount : 0;
    };

    const resolvedShippingFee = shippingFeeOverride ?? cart.shippingFee ?? '0';
    const shippingFeeAmount = toAmount(resolvedShippingFee);

    if (!cart.items?.length) {
      cart.items = [];
      cart.subtotal = '0.00';
      cart.tax = '0.00';
      cart.shippingFee = '0';
      cart.total = '0.00';
      return cart;
    }

    const pricedItems = await Promise.all(
      cart.items.map(async (item) => {
        const product = await this.products.findProduct(
          new Types.ObjectId(item.productId),
        );

        if (!product) throw new Error('Product not found');

        const unitPrice = toAmount(product.price);
        const quantity = toAmount(item.quantity);
        const totalPrice = unitPrice * quantity;

        return {
          ...item,
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
    cart.items = pricedItems;

    return cart;
  }

  public async getCart(params: {
    first?: number;
    after?: string;
    filter: Filter<Cart>;
  }): Promise<Cart[]> {
    const { filter = {}, after, first } = params;

    const data = await this.carts.list(filter).collect();

    return data;
  }
  public async addToCart({
    params,
  }: {
    params: AddToCartInput & { _id: string };
  }) {
    const timestamp = new Date();
    const product = await this.products.findProduct(
      new Types.ObjectId(params.productId),
    );
    const cart = await this.carts.find(new Types.ObjectId(params._id));

    if (!product) throw new Error('Product not found');
    if (!cart) {
      const newCart: Cart = {
        _id: new Types.ObjectId(params._id),
        createdAt: timestamp,
        items: [
          {
            productId: params.productId,
            quantity: params.quantity,
          },
        ],
        status: CartStatus.ACTIVE,
        updatedAt: timestamp,
        nodeType: ObjectType.Cart,
      };

      await this.carts.create(newCart);
    }

    const item = cart.items.find((cartItem) =>
      cartItem.productId.equals(params.productId),
    );

    if (item) {
      item.quantity += params.quantity;
    } else {
      cart.items = [
        ...cart.items,
        {
          productId: params.productId,
          quantity: params.quantity,
        },
      ];
    }

    await this.carts.update(new Types.ObjectId(params._id), {
      items: cart.items,
      updatedAt: timestamp,
    });

    // await this.carts.create({ ...params }).catch(async (err) => {
    //   console.log(err, 'error');
    //   return;
    // });

    return true;
  }

  public shippingOptions(): ShippingOption[] {
    return SHIPPING_OPTIONS;
  }

  public paymentMethods(): PaymentMethod[] {
    return PAYMENT_METHODS;
  }

  public async myOrders(accountId: Types.ObjectId): Promise<Order[]> {
    return this.orders.list({ accountId }).collect();
  }

  public async findOrder(
    accountId: Types.ObjectId,
    orderId: Types.ObjectId,
  ): Promise<Order | null> {
    return this.orders.find({ _id: orderId, accountId });
  }

  public async removeFromCart(
    productId: Types.ObjectId,
    params: { _id: string; quantity: number },
  ) {
    const timestamp = new Date();

    const cart = await this.carts.find(new Types.ObjectId(params._id));

    if (!cart) throw new Error('Cart not found');

    const itemIndex = cart.items.findIndex((cartItem) =>
      cartItem.productId.equals(productId),
    );

    if (itemIndex === -1) {
      throw new Error('Product not in cart');
    }

    const item = cart.items[itemIndex];

    if (item.quantity <= params.quantity) {
      cart.items.splice(itemIndex, 1);
    } else {
      item.quantity -= params.quantity;
    }

    await this.carts.update(new Types.ObjectId(params._id), {
      items: cart.items,
      updatedAt: timestamp,
    });

    return true;
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

    const shippingOption = this.findShippingOption(shippingOptionId);
    if (!shippingOption) throw new Error('Invalid shipping option');

    const paymentMethod = this.findPaymentMethod(paymentMethodId);
    if (!paymentMethod || !paymentMethod.isActive) {
      throw new Error('Invalid payment method');
    }

    const calculatedPrice = await this.calculateOrderSummary(
      cart,
      shippingOption.fee,
    );

    const order: Order = {
      _id: new Types.ObjectId(),
      accountId,
      items: calculatedPrice.items,
      shippingOption,
      paymentMethod,
      subtotal: calculatedPrice.subtotal,
      tax: calculatedPrice.tax,
      shippingFee: calculatedPrice.shippingFee,
      total: calculatedPrice.total,
      status: OrderStatus.PENDING,
      createdAt: now,
      updatedAt: now,
    };

    await this.orders.create(order);

    await this.carts.delete(accountId);

    const account = await this.accounts.findAccount(accountId);

    try {
      await this.events.dispatch('OrderCreated', {
        orderId: order._id.toString(),
        accountId: accountId.toString(),
        emailAddress: account?.emailAddress,
        total: order.total,
        itemCount: order.items.length,
      });
    } catch (error) {
      console.error('OrderCreated event dispatch failed:', error);
    }

    return order;
  }

  public async findCart(id: Types.ObjectId) {
    return this.carts.find(id);
  }

  // public async updateProduct(params: UpdateProductInput) {
  //   const { _id, ...updateData } = params;

  //   await this.products
  //     .update(_id, {
  //       ...updateData,
  //     })
  //     .catch(async (err) => {
  //       console.log(err, 'error');
  //       return;
  //     });
  // }
  // public async deleteProduct(params: DeleteProductInput) {
  //   try {
  //     await this.carts.delete(params._id);
  //   } catch (error) {
  //     console.error('Error deleting product:', error);
  //   }
  // }

  // public async getHighPointsProducts(params: {
  //   first?: number;
  //   after?: string;
  //   filter: Filter<Product>;
  // }): Promise<Connection<Product>> {
  //   const { filter = {}, after, first } = params;
  //   const highPoint = this.configService.getString('HIGHPOINT_THRESHOLD') ?? 1;
  //   const data = await this.products
  //     .list({
  //       ...filter,
  //       points: {
  //         greaterThanOrEqual: new Decimal(highPoint),
  //       },
  //     })
  //     .connection({ after, first, order: 'desc' });

  //   return data;
  // }
}
export async function recalcCart(cart: Cart) {
  const VAT_RATE = 0.12; //TODO configure this as config
  // 1️⃣ Subtotal (sum of all item totals)
  cart.subtotal = cart?.items
    .reduce(
      (sum, item) =>
        Number(sum) + Number(item.unitPrice) * Number(item.quantity),
      0,
    )
    .toString();

  // 2️⃣ VAT (12%)
  cart.tax = Number((Number(cart.subtotal) * VAT_RATE).toFixed(2)).toString();

  // 3️⃣ Total
  cart.total = Number(
    (
      Number(cart.subtotal) +
      Number(cart.tax) +
      Number(cart.shippingFee)
    ).toFixed(2),
  ).toString();
}
