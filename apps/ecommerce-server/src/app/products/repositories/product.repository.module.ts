import { Module } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Tokens } from 'apps/ecommerce-server/src/types/tokens';
import { ProductRepositoryFactory } from './products.repository';

@Module({
  providers: [
    {
      provide: Tokens.ProductRepositoryToken,
      useFactory: ProductRepositoryFactory,
      inject: [getConnectionToken()],
    },
  ],
  exports: [Tokens.ProductRepositoryToken],
})
export class ProductsRepositoryModule {}
