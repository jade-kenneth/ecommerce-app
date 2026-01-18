import { Inject } from '@nestjs/common';

import { Types } from 'mongoose';
import { Filter } from '../../../libs/repository';
import { Tokens } from '../../../types/tokens';
import { Session, SessionRepository } from './repositories/session.repository';

export class SessionService {
  constructor(
    @Inject(Tokens.SessionRepository)
    private sessionRepository: SessionRepository
  ) {}

  async createSession(session: Session) {
    await this.sessionRepository.create(session);
  }

  async deleteSession(filter: Types.ObjectId | Filter<Session>) {
    return this.sessionRepository.delete(filter);
  }

  async findSession(filter: Types.ObjectId | Filter<Session>) {
    return this.sessionRepository.find(filter);
  }

  async updateSession(
    filter: Types.ObjectId | Filter<Session>,
    data: Partial<Omit<Session, '_id'>>
  ) {
    return this.sessionRepository.update(filter, data);
  }
}
