import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Product } from '../../types/product';

import assert from 'assert';
import { Filter } from '../../libs/repository';
import { AccountType } from '../../types/common';
import {
  CreateProductInput,
  DeleteProductInput,
  UpdateProductInput,
} from '../__generated/graphql-types';
import { Claims } from '../user-session/types';
import { ProductsService } from './products.service';

@Resolver('Products')
export class ProductResolver {
  constructor(private readonly productService: ProductsService) {}

  @Query('products')
  async products(
    @Context('claims') claims: Claims,
    @Args('first') first: number,
    @Args('after') after: string,
    @Args('filter') filter?: Filter<Product>
  ) {
    /** This query requires authentication that comes from middleware
     *
     * If claims.role is missing, it means the token is invalid
     */

    assert(claims?.role === AccountType.Member, 'Unauthorized');

    return this.productService.getProducts({ filter, after, first });
  }

  @Query('highPointProducts')
  async highPointProducts(
    @Args('first') first: number,
    @Args('after') after: string,
    @Args('filter') filter?: Filter<Product>
  ) {
    return this.productService.getHighPointsProducts({ filter, after, first });
  }

  @Mutation('createProduct')
  async createProduct(@Args('input') input: CreateProductInput) {
    return this.productService.createProduct(input);
  }

  @Mutation('updateProduct')
  async updateProduct(@Args('input') input: UpdateProductInput) {
    return this.productService.updateProduct(input);
  }

  @Mutation('deleteProduct')
  async deleteProduct(@Args('input') input: DeleteProductInput) {
    return this.productService.deleteProduct(input);
  }
}
