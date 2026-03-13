import { Inject } from '@nestjs/common';
import { Types } from 'mongoose';

import type { Filter } from '../../../libs/repository';
import { Tokens } from '../../../types/tokens';

import type {
  Session,
  SessionRepository,
} from './repositories/session.repository';

export class SessionService {
  constructor(
    @Inject(Tokens.SessionRepository)
    private sessionRepository: SessionRepository,
  ) {}

  async createSession(session: Session) {
    await this.sessionRepository.create(session);
  }
  private extractSessionId(
    filter: Types.ObjectId | Filter<Session>,
  ): Types.ObjectId | null {
    if (filter instanceof Types.ObjectId) {
      return filter;
    }

    if (!filter || typeof filter !== 'object') {
      return null;
    }

    const id = (filter as Filter<Session>)._id;

    if (id instanceof Types.ObjectId) {
      return id;
    }

    if (typeof id === 'string' && Types.ObjectId.isValid(id)) {
      return new Types.ObjectId(id);
    }

    return null;
  }
  async deleteSession(filter: Types.ObjectId | Filter<Session>) {
    const sessionId = this.extractSessionId(filter);
    if (sessionId) {
      await this.sessionRepository.delete(sessionId);
      return;
    }

    const sessions = await this.sessionRepository
      .list(filter as Filter<Session>)
      .collect();

    await Promise.all(
      sessions.map((session) => this.sessionRepository.delete(session._id)),
    );
  }

  async findSession(filter: Types.ObjectId | Filter<Session>) {
    return this.sessionRepository.find(filter);
  }

  async updateSession(
    filter: Types.ObjectId | Filter<Session>,
    data: Partial<Omit<Session, '_id'>>,
  ) {
    await this.sessionRepository.update(filter, data);

    const sessions = await this.sessionRepository
      .list(filter as Filter<Session>)
      .collect();

    await Promise.all(
      sessions.map((session) =>
        this.sessionRepository.update(session._id, data),
      ),
    );
  }
}
