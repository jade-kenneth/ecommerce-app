import { Module } from '@nestjs/common';
import { TurnstileModule } from '../../turnstile/turnstile.module';

import { AccountResolver } from './account.resolver';
import { AccountService } from './account.service';
import { AccountRepositoryModule } from './repositories/account.repository.module';

@Module({
  imports: [AccountRepositoryModule, TurnstileModule],
  providers: [AccountService, AccountResolver],
  exports: [AccountService],
})
export class AccountModule {}
