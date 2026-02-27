import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import assert from 'assert';
import { Types } from 'mongoose';
import { AccountType } from '../../types/common';
import { CreateProductReviewInput } from '../__generated/graphql-types';
import { Claims } from '../identity/types';
import { ProductReviewsService } from './product-reviews.service';

@Resolver('ProductReview')
export class ProductReviewsResolver {
  constructor(private readonly productReviewsService: ProductReviewsService) {}

  @Query('productReviews')
  async productReviews(@Args('productId') productId: Types.ObjectId) {
    return this.productReviewsService.productReviewsByProductId(productId);
  }

  @Mutation('createProductReview')
  async createProductReview(
    @Context('claims') claims: Claims,
    @Args('input') input: CreateProductReviewInput,
  ) {
    assert(claims.role === AccountType.Member, 'unauthorized');

    return this.productReviewsService.createProductReview({
      accountId: claims.sub,
      input,
    });
  }
}
