import { Module } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Tokens } from 'apps/ecommerce-server/src/types/tokens';
import { AccountService } from '../account.service';
import { AccountRepositoryFactory } from './account.repository';

@Module({
  providers: [
    {
      provide: Tokens.AccountRepository,
      useFactory: AccountRepositoryFactory,
      inject: [getConnectionToken()],
    },
    AccountService,
  ],
  exports: [Tokens.AccountRepository],
})
export class AccountRepositoryModule {}
