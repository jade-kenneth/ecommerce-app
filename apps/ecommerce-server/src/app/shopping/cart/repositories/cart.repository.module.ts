import { Module } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';

import { Tokens } from '~/types/tokens';
import { CartRepositoryFactory } from './cart.repository';

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
export class CartRepositoryModule {}
