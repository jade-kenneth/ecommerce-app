import { Inject } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import type { Filter } from '../../libs/repository';
import type { Product } from '../../types/product';
import { Tokens } from '../../types/tokens';
import type {
  CreateProductInput,
  DeleteProductInput,
  ProductByIdsInput,
  UpdateProductInput,
} from '../__generated/graphql-types';
import { ProductReviewsRepository } from '../product-reviews/repositories/product-reviews.repository';

import { ProductsService } from './products.service';

@Resolver('Products')
export class ProductResolver {
  constructor(
    @Inject(ProductsService) private readonly productService: ProductsService,
  ) {}

  @Query('products')
  async products(
    @Args('first') first: number,
    @Args('after') after: string,
    @Args('filter') filter?: Filter<Product>,
  ) {
    /** This query requires authentication that comes from middleware
     *
     * If claims.role is missing, it means the token is invalid
     */

    return this.productService.getProducts({ filter, after, first });
  }

  @Query('highPointProducts')
  async highPointProducts(
    @Args('first') first: number,
    @Args('after') after: string,
    @Args('filter') filter?: Filter<Product>,
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

  @Query('productByIds')
  async getProductByIds(@Args('input') input: ProductByIdsInput) {
    return this.productService.findProduct;
  }

  @Query('searchProductByName')
  async searchProductByName(
    @Args('search') search: string,
    @Args('first') first: number,
    @Args('filter') filter?: Filter<Product>,
  ) {
    return this.productService.searchProductByName({ search, first, filter });
  }
}

@Resolver('Product')
export class ProductFieldResolver {
  constructor(
    @Inject(Tokens.ProductReviewsRepositoryToken)
    private readonly productReviews: ProductReviewsRepository,
  ) {}

  @ResolveField('avgRating')
  async avgRating(@Parent() product: Product): Promise<number> {
    const reviews = await this.productReviews
      .list({ productId: product._id })
      .collect();

    if (reviews.length === 0) {
      return 0;
    }

    const totalRating = reviews.reduce(
      (sum, review) => sum + Number(review.rating ?? 0),
      0,
    );

    return Number((totalRating / reviews.length).toFixed(2));
  }
}
