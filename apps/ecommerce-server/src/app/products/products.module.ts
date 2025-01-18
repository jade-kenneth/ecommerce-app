import { Module } from '@nestjs/common';

import { ProductResolver } from './products.resolver';
import { ProductsService } from './products.service';
import { ProductsRepositoryModule } from './repositories/product.repository.module';

@Module({
  imports: [ProductsRepositoryModule],
  providers: [ProductsService, ProductResolver],
  exports: [ProductsService],
})
export class ProductsModule {}
