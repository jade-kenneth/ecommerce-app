import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateProductInput } from '../__generated/graphql-types';
import { ProductsService } from './products.service';

@Resolver('Products')
export class ProductResolver {
  constructor(private readonly productService: ProductsService) {}

  @Query('products')
  public async products() {
    return this.productService.listOfProducts();
  }

  @Mutation('createProduct')
  public async createProduct(@Args('input') input: CreateProductInput) {
    return this.productService.createProduct(input);
  }
}
