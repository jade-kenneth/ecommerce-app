import { Module } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Tokens } from '../../../types/tokens';
import { SessionRepositoryFactory } from './repositories/session.repository';
import { SessionService } from './session.service';

@Module({
  providers: [
    {
      provide: Tokens.SessionRepository,
      useFactory: SessionRepositoryFactory,
      inject: [getConnectionToken()],
    },
    SessionService,
  ],
  exports: [Tokens.SessionRepository, SessionService],
})
export class SessionModule {}
