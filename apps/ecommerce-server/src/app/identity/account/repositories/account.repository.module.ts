import { Module } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Tokens } from '../../../../types/tokens';
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
