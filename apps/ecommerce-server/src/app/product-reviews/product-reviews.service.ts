import { Inject, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { Tokens } from '../../types/tokens';
import { CreateProductReviewInput } from '../__generated/graphql-types';
import {
  ProductReview,
  ProductReviewsRepository,
} from './repositories/product-reviews.repository';

@Injectable()
export class ProductReviewsService {
  constructor(
    @Inject(Tokens.ProductReviewsRepositoryToken)
    private readonly productReviews: ProductReviewsRepository,
  ) {}

  public async productReviewsByProductId(
    productId: Types.ObjectId,
  ): Promise<ProductReview[]> {
    return this.productReviews.list({ productId }).collect();
  }

  public async createProductReview(params: {
    accountId: string;
    input: CreateProductReviewInput;
  }): Promise<ProductReview> {
    const now = new Date();
    const rating = Number(params.input.rating);

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    const review: ProductReview = {
      _id: new Types.ObjectId(),
      productId: new Types.ObjectId(params.input.productId),
      accountId: new Types.ObjectId(params.accountId),
      orderId: params.input.orderId
        ? new Types.ObjectId(params.input.orderId)
        : undefined,
      rating,
      message: params.input.message?.trim() || '',
      createdAt: now,
      updatedAt: now,
    };

    await this.productReviews.create(review);
    return review;
  }
}
