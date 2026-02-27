import { Module } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';

import { Tokens } from '~/types/tokens';
import { ProductReviewsRepositoryFactory } from './product-reviews.repository';

@Module({
  providers: [
    {
      provide: Tokens.ProductReviewsRepositoryToken,
      useFactory: ProductReviewsRepositoryFactory,
      inject: [getConnectionToken()],
    },
  ],
  exports: [Tokens.ProductReviewsRepositoryToken],
})
export class ProductReviewsRepositoryModule {}
