import { Module } from '@nestjs/common';

import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { ProductReviewsRepositoryModule } from '../product-reviews/repositories/product-reviews.repository.module';

import { ProductFieldResolver, ProductResolver } from './products.resolver';
import { ProductsService } from './products.service';
import { ProductsRepositoryModule } from './repositories/product.repository.module';

@Module({
  imports: [ProductsRepositoryModule, ProductReviewsRepositoryModule],
  providers: [
    ProductsService,
    ProductResolver,
    ProductFieldResolver,
    ConfigService,
    ConfigModule,
  ],
  exports: [ProductsService, ConfigService],
})
export class ProductsModule {}
