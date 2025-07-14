import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Product } from '../../types/product';

import { Filter } from '../../libs/repository';
import {
  CreateProductInput,
  DeleteProductInput,
  UpdateProductInput,
} from '../__generated/graphql-types';
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

  @Mutation('updateProduct')
  async updateProduct(@Args('input') input: UpdateProductInput) {
    return this.productService.updateProduct(input);
  }

  @Mutation('deleteProduct')
  async deleteProduct(@Args('input') input: DeleteProductInput) {
    return this.productService.deleteProduct(input);
  }
}
