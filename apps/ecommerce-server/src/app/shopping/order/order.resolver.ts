import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

import assert from 'assert';

import { Types } from 'mongoose';
import { AccountType } from '../../../types/common';
import { UpdateOrderStatusInput } from '../../__generated/graphql-types';
import { Claims } from '../../identity/types';
import { OrderService } from '../order/order.service';

@Resolver('Order')
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Query('myOrders')
  async myOrders(@Context('claims') claims: Claims) {
    assert(claims?.role === AccountType.Member, 'unauthorized');
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

  @Mutation('updateOrderStatus')
  async updateOrderStatus(
    @Context('claims') claims: Claims,
    @Args('input')
    input: UpdateOrderStatusInput,
  ) {
    // TODO should be admin only, build admin panel later
    assert(claims.role === AccountType.Member, 'unauthorized');

    await this.orderService.updateOrderStatus({
      orderId: new Types.ObjectId(input.orderId),
      productId: input.productId ? new Types.ObjectId(input.productId) : null,
      status: input.status,
      rating: input.rating,
      message: input.message,
    });

    return true;
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
