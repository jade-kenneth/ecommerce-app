import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Product } from '../../types/product';

import { Filter } from '../../libs/repository';
import { CreateProductInput } from '../__generated/graphql-types';
import { ProductsService } from './products.service';

@Resolver('Products')
export class ProductResolver {
  constructor(private readonly productService: ProductsService) {}

  @Query('products')
  async products(
    @Args('first') first: number,
    @Args('after') after: string,
    @Args('filter') filter?: Filter<Product>
  ) {
    return this.productService.getProducts({ filter, after, first });
  }

  @Mutation('createProduct')
  async createProduct(@Args('input') input: CreateProductInput) {
    return this.productService.createProduct(input);
  }
}
