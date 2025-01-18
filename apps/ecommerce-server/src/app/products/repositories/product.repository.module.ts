import { Module } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { ProductRepositoryFactory } from './products.repository';

export const ProductRepositoryToken = Symbol('ProductRepository');
@Module({
  providers: [
    {
      provide: ProductRepositoryToken,
      useFactory: ProductRepositoryFactory,
      inject: [getConnectionToken()],
    },
  ],
  exports: [ProductRepositoryToken],
})
export class ProductsRepositoryModule {}
