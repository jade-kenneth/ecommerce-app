import { Module } from '@nestjs/common';

import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';

import { ProductResolver } from './products.resolver';
import { ProductsService } from './products.service';
import { ProductsRepositoryModule } from './repositories/product.repository.module';

@Module({
  imports: [ProductsRepositoryModule],
  providers: [ProductsService, ProductResolver, ConfigService, ConfigModule],
  exports: [ProductsService, ConfigService],
})
export class ProductsModule {}
