import { Module } from '@nestjs/common';
import { ProductReviewsResolver } from './product-reviews.resolver';
import { ProductReviewsService } from './product-reviews.service';
import { ProductReviewsRepositoryModule } from './repositories/product-reviews.repository.module';

@Module({
  imports: [ProductReviewsRepositoryModule],
  providers: [ProductReviewsService, ProductReviewsResolver],
  exports: [ProductReviewsService],
})
export class ProductReviewsModule {}
