import { Inject } from '@nestjs/common';
import { ObjectId } from 'apps/ecommerce-server/src/libs/object-id';
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

  async deleteSession(filter: ObjectId | Filter<Session>) {
    return this.sessionRepository.delete(filter);
  }

  async findSession(filter: ObjectId | Filter<Session>) {
    return this.sessionRepository.find(filter);
  }

  async updateSession(
    filter: ObjectId | Filter<Session>,
    data: Partial<Omit<Session, 'id'>>
  ) {
    return this.sessionRepository.update(filter, data);
  }
}
