import { Module } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Tokens } from 'apps/ecommerce-server/src/types/tokens';
import { CartRepositoryFactory } from './carts.repository';

@Module({
  providers: [
    {
      provide: Tokens.CartsToken,
      useFactory: CartRepositoryFactory,
      inject: [getConnectionToken()],
    },
  ],
  exports: [Tokens.CartsToken],
})
export class CartsRepositoryModule {}
