import { Module } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';

import { Tokens } from '~/types/tokens';
import { OrdersRepositoryFactory } from './orders.repository';

@Module({
  providers: [
    {
      provide: Tokens.OrdersToken,
      useFactory: OrdersRepositoryFactory,
      inject: [getConnectionToken()],
    },
  ],
  exports: [Tokens.OrdersToken],
})
export class OrdersRepositoryModule {}
