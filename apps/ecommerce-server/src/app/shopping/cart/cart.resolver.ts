import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

import assert from 'assert';

import { Types } from 'mongoose';
import { AccountType } from '../../../types/common';
import {
  CheckoutInput,
  OrderStatus,
  PaymentMethodType,
  RemoveFromCartInput,
  ShippingType,
  UpdateCartItemInput,
} from '../../__generated/graphql-types';
import { Claims } from '../../identity/types';
import { CheckoutService } from '../checkout/checkout.service';
import { OrderService } from '../order/order.service';
import { CartService } from './cart.service';

@Resolver('Cart')
export class CartResolver {
  constructor(
    private readonly cartService: CartService,
    private readonly checkoutService: CheckoutService,
    private readonly orderService: OrderService,
  ) {}

  @Query('cart')
  async carts(@Context('claims') claims: Claims) {
    /** This query requires authentication that comes from middleware
     *
     * If claims.role is missing, it means the token is invalid
     */
    assert(claims.role === AccountType.Member, 'unauthorized');

    return this.cartService.findCart(new Types.ObjectId(claims.sub));
  }

  @Mutation('updateCartItem')
  async updateCartItem(
    @Context('claims') claims: Claims,
    @Args('input') input: UpdateCartItemInput,
  ) {
    return this.cartService.updateCartItem({
      params: { ...input, _id: claims.sub },
    });
  }

  @Mutation('removeFromCart')
  async removeFromCart(
    @Context('claims') claims: Claims,
    @Args('input') input: RemoveFromCartInput,
  ) {
    return this.cartService.removeFromCart({
      _id: claims.sub,
      productId: input.productId,
    });
  }

  @Query('shippingOptions')
  async shippingOptions(
    @Context('claims') claims: Claims,
    @Args('includeInactive') includeInactive?: boolean,
  ) {
    //TODO should be admin only, build admin panel later
    assert(claims?.role === AccountType.Member, 'unauthorized');

    return this.checkoutService.shippingOptions({
      includeInactive: Boolean(includeInactive),
    });
  }

  @Query('paymentMethods')
  async paymentMethods(
    @Context('claims') claims: Claims,
    @Args('includeInactive') includeInactive?: boolean,
  ) {
    //TODO should be admin only, build admin panel later
    assert(claims?.role === AccountType.Member, 'unauthorized');

    return this.checkoutService.paymentMethods({
      includeInactive: Boolean(includeInactive),
    });
  }

  @Query('myOrders')
  async myOrders(@Context('claims') claims: Claims) {
    assert(claims.role === AccountType.Member, 'unauthorized');

    return this.orderService.myOrders(new Types.ObjectId(claims.sub));
  }

  @Query('order')
  async order(@Context('claims') claims: Claims, @Args('id') id: string) {
    assert(claims.role === AccountType.Member, 'unauthorized');

    return this.orderService.findOrder(
      new Types.ObjectId(claims.sub),
      new Types.ObjectId(id),
    );
  }

  @Mutation('checkout')
  async checkout(
    @Context('claims') claims: Claims,
    @Args('input') input: CheckoutInput,
  ) {
    assert(claims.role === AccountType.Member, 'unauthorized');

    return this.checkoutService.checkout({ accountId: claims.sub, input });
  }

  @Mutation('updateOrderStatus')
  async updateOrderStatus(
    @Context('claims') claims: Claims,
    @Args('input')
    input: {
      orderId: string;
      status: OrderStatus;
    },
  ) {
    // TODO should be admin only, build admin panel later
    assert(claims.role === AccountType.Member, 'unauthorized');

    await this.orderService.updateOrderStatus({
      orderId: new Types.ObjectId(input.orderId),
      status: input.status,
    });
  }

  @Mutation('updateShippingMethodStatus')
  async updateShippingMethodStatus(
    @Context('claims') claims: Claims,
    @Args('input')
    input: {
      type: ShippingType;
      isActive: boolean;
    },
  ) {
    // TODO should be admin only, build admin panel later
    assert(claims.role === AccountType.Member, 'unauthorized');

    return this.checkoutService.updateShippingMethodStatus(input);
  }

  @Mutation('updatePaymentMethodStatus')
  async updatePaymentMethodStatus(
    @Context('claims') claims: Claims,
    @Args('input')
    input: {
      type: PaymentMethodType;
      isActive: boolean;
    },
  ) {
    // TODO should be admin only, build admin panel later
    assert(claims.role === AccountType.Member, 'unauthorized');

    return this.checkoutService.updatePaymentMethodStatus(input);
  }

  // ** build later **

  // @Mutation('create')
  // async updateProduct(@Args('input') input: UpdateProductInput) {
  //   return this.productService.updateProduct(input);
  // }

  // @Mutation('deleteProduct')
  // async deleteProduct(@Args('input') input: DeleteProductInput) {
  //   return this.productService.deleteProduct(input);
  // }
}
