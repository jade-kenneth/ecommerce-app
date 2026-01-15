import { Module } from '@nestjs/common';

import { ProductsService } from '../products/products.service';
import { ProductsRepositoryModule } from '../products/repositories/product.repository.module';
import { CartResolver } from './carts.resolver';
import { CartsService } from './carts.service';
import { CartsRepositoryModule } from './repositories/carts.repository.module';

@Module({
  imports: [CartsRepositoryModule, ProductsRepositoryModule],
  providers: [CartsService, CartResolver, ProductsService],
  exports: [CartsService],
})
export class CartsModule {}
