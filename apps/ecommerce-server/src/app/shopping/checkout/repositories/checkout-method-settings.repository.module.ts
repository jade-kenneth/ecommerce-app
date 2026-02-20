import { Module } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';

import { Tokens } from '~/types/tokens';
import { CheckoutMethodSettingsRepositoryFactory } from './checkout-method-settings.repository';

@Module({
  providers: [
    {
      provide: Tokens.CheckoutMethodSettingsToken,
      useFactory: CheckoutMethodSettingsRepositoryFactory,
      inject: [getConnectionToken()],
    },
  ],
  exports: [Tokens.CheckoutMethodSettingsToken],
})
export class CheckoutMethodSettingsRepositoryModule {}
