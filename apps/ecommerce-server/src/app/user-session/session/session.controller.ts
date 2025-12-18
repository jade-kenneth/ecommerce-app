import { ObjectType } from '@ecommerce-app/object-shared';
import { ObjectId } from '@ecommerce/object-id';
import {
  ForbiddenException,
  InternalServerErrorException,
  Post,
  Request,
} from '@nestjs/common';
import ms from 'ms';
import { AuthRequest, TokenType } from '../types';
import { JwtService } from './jwt.service';
import { Session, SessionStatus } from './repositories/session.repository';
import { SessionService } from './session.service';

export class SessionController {
  constructor(
    private readonly session: SessionService,
    private readonly jwt: JwtService
  ) {}
  @Post('sessions')
  async createSession(@Request() request: AuthRequest) {
    const timestamp = new Date();

    // Time to live in seconds, max 7 days
    const ttl = Math.min(
      Math.floor(ms(<string>(request.query.ttl ?? '10m')) * 0.001),
      604800
    );
    const { user, ipAddress, location } = request;
    const session: Session = {
      _id: ObjectId.generate(ObjectType.Session),
      account: user._id,
      // jti: randomBytes(12),
      dateTimeCreated: timestamp,
      dateTimeLastRefreshed: timestamp,
      fingerprint: <string>request.headers['fingerprint'] ?? null,
      status: request.forVerification
        ? SessionStatus.PENDING
        : SessionStatus.READY,
    };

    try {
      await this.session.createSession(session);

      const accessToken = this.jwt.sign(
        {
          // ...claims,
          type: TokenType.Access,
        },
        {
          ttl,
        }
      );

      const refreshToken = this.jwt.sign(
        {
          // ...claims,
          type: TokenType.Refresh,
        },
        {
          ttl: '24h',
        }
      );
      return {
        session: {
          id: session._id.toString(),
          dateTimeCreated: session.dateTimeCreated.toISOString(),
        },
        accessToken,
        refreshToken,
      };
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }

      throw new InternalServerErrorException(error);
    }
  }
}
