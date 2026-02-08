import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

import assert from 'assert';

import { Types } from 'mongoose';
import { Filter } from '../../libs/repository';
import { AccountType } from '../../types/common';
import {
  CheckoutInput,
  OrderStatus,
  RemoveFromCartInput,
  UpdateCartItemInput,
} from '../__generated/graphql-types';
import { ProductsService } from '../products/products.service';
import { Claims } from '../user-session/types';
import { CartsService } from './carts.service';
import { Cart } from './repositories/carts.repository';

@Resolver('Cart')
export class CartResolver {
  constructor(
    private readonly cartService: CartsService,
    private readonly products: ProductsService,
  ) {}

  @Query('cart')
  async carts(
    @Context('claims') claims: Claims,
    @Args('first') first: number,
    @Args('after') after: string,
    @Args('filter') filter?: Filter<Cart>,
  ) {
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
  async shippingOptions() {
    return this.cartService.shippingOptions();
  }

  @Query('paymentMethods')
  async paymentMethods() {
    return this.cartService.paymentMethods();
  }

  @Query('myOrders')
  async myOrders(@Context('claims') claims: Claims) {
    assert(claims.role === AccountType.Member, 'unauthorized');

    return this.cartService.myOrders(new Types.ObjectId(claims.sub));
  }

  @Query('order')
  async order(@Context('claims') claims: Claims, @Args('id') id: string) {
    assert(claims.role === AccountType.Member, 'unauthorized');

    return this.cartService.findOrder(
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

    return this.cartService.checkout({ accountId: claims.sub, input });
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

    await this.cartService.updateOrderStatus({
      orderId: new Types.ObjectId(input.orderId),
      status: input.status,
    });
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
