import { Module } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Tokens } from '../../../types/tokens';
import { LicenseResolver } from './license.resolver';
import { LicenseService } from './license.service';
import { LicenseRepositoryFactory } from './repositories/license.repository';

@Module({
  providers: [
    {
      provide: Tokens.LicenseRepository,
      useFactory: LicenseRepositoryFactory,
      inject: [getConnectionToken()],
    },
    LicenseService,
    LicenseResolver,
  ],
  exports: [Tokens.LicenseRepository, LicenseService],
})
export class LicenseModule {}
