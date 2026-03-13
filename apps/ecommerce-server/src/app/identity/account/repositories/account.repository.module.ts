import { Module } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';

import { Tokens } from '../../../../types/tokens';

import { AccountRepositoryFactory } from './account.repository';

@Module({
  providers: [
    {
      provide: Tokens.AccountRepository,
      useFactory: AccountRepositoryFactory,
      inject: [getConnectionToken()],
    },
  ],
  exports: [Tokens.AccountRepository],
})
export class AccountRepositoryModule {}
