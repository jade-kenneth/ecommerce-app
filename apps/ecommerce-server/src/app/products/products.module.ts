import { Module } from '@nestjs/common';
import { ProductResolver } from './products.resolver';
import { ProductsService } from './products.service';

@Module({
  providers: [ProductsService, ProductResolver],
})
export class ProductsModule {}
