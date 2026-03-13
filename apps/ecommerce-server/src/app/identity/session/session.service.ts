import { Inject } from '@nestjs/common';
import { Types } from 'mongoose';

import type { Filter } from '../../../libs/repository';
import { Tokens } from '../../../types/tokens';

import type { Session, SessionRepository } from './repositories/session.repository';

export class SessionService {
  constructor(
    @Inject(Tokens.SessionRepository)
    private sessionRepository: SessionRepository,
  ) {}

  async createSession(session: Session) {
    await this.sessionRepository.create(session);
  }

  async deleteSession(filter: Types.ObjectId | Filter<Session>) {
    await this.sessionRepository.delete(filter);

    const sessions = await this.sessionRepository.list(filter as Filter<Session>).collect();

    await Promise.all(sessions.map((session) => this.sessionRepository.delete(session._id)));
  }

  async findSession(filter: Types.ObjectId | Filter<Session>) {
    return this.sessionRepository.find(filter);
  }

  async updateSession(
    filter: Types.ObjectId | Filter<Session>,
    data: Partial<Omit<Session, '_id'>>,
  ) {
    await this.sessionRepository.update(filter, data);

    const sessions = await this.sessionRepository.list(filter as Filter<Session>).collect();

    await Promise.all(sessions.map((session) => this.sessionRepository.update(session._id, data)));
  }
}
