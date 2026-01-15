import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

import assert from 'assert';
import { ObjectId } from '../../libs/object-id';
import { Filter } from '../../libs/repository';
import { AddToCartInput } from '../__generated/graphql-types';
import { Claims } from '../user-session/types';
import { CartsService } from './carts.service';
import { Cart } from './repositories/carts.repository';

@Resolver('Carts')
export class CartResolver {
  constructor(private readonly cartService: CartsService) {}

  @Query('carts')
  async carts(
    @Context('claims') claims: Claims,
    @Args('first') first: number,
    @Args('after') after: string,
    @Args('filter') filter?: Filter<Cart>
  ) {
    /** This query requires authentication that comes from middleware
     *
     * If claims.role is missing, it means the token is invalid
     */
    assert(claims?.session, 'unauthorized');

    return this.cartService.getCarts({
      filter: { ownerId: ObjectId.from(claims.sub) },
      after,
      first,
    });
  }

  @Mutation('addToCart')
  async addToCart(
    @Context('claims') claims: Claims,
    @Args('input') input: AddToCartInput
  ) {
    return this.cartService.addToCart({
      params: { ...input, _id: claims.sub },
    });
  }

  // @Mutation('create')
  // async updateProduct(@Args('input') input: UpdateProductInput) {
  //   return this.productService.updateProduct(input);
  // }

  // @Mutation('deleteProduct')
  // async deleteProduct(@Args('input') input: DeleteProductInput) {
  //   return this.productService.deleteProduct(input);
  // }
}
