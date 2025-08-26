import { Module } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';

import { Tokens } from 'apps/ecommerce-server/src/types/tokens';
import { ConfigRepositoryFactory } from './config.repository';

@Module({
  providers: [
    {
      provide: Tokens.ConfigToken,
      useFactory: ConfigRepositoryFactory,
      inject: [getConnectionToken()],
    },
  ],
  exports: [Tokens.ConfigToken],
})
export class ConfigRepositoryModule {}
