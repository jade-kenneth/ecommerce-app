import {
  Controller,
  ForbiddenException,
  InternalServerErrorException,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import ms from 'ms';
import { AuthRequest, TokenType } from '../types';

import { ObjectId } from 'apps/ecommerce-server/src/libs/object-id';

import { ObjectType } from 'apps/ecommerce-server/src/libs/object-shared';
import bcrypt from 'bcrypt';
import { DateTime } from 'luxon';
import * as R from 'ramda';
import randomBytes from 'randombytes';
import { RefreshJwtGuard } from '../../auth/guards/refresh-jwt.guard';
import { AccountService } from '../account/account.service';
import { JwtService } from '../jwt/jwt.service';
import { Session } from './repositories/session.repository';
import { SessionService } from './session.service';

@Controller()
export class SessionController {
  constructor(
    private readonly session: SessionService,
    private readonly jwt: JwtService,
    private readonly account: AccountService
  ) {}
  @Post('sessions')
  async createSession(@Request() request: AuthRequest) {
    const timestamp = new Date();

    // Time to live in seconds, max 7 days
    const ttl = Math.min(
      Math.floor(ms(<string>(request.query.ttl ?? '10m')) * 0.001),
      604800
    );

    const { user } = request.body;

    const session: Session = {
      _id: ObjectId.generate(ObjectType.Session),
      account: user._id,
      jti: randomBytes(12),
      dateTimeCreated: timestamp,
      dateTimeLastRefreshed: timestamp,
    };

    const claims = {
      sub: user._id.toString(),
      jti: session.jti.toString('hex'),
      role: user.role,
      iap: DateTime.fromJSDate(timestamp)
        .minus({
          second: 30,
        })
        .toISO(),
    };

    try {
      await this.session.createSession(session);

      const accessToken = this.jwt.sign(
        {
          ...claims,
          type: TokenType.Access,
        },
        {
          ttl,
        }
      );

      const refreshToken = this.jwt.sign(
        {
          ...claims,
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

  @Post('session/refresh')
  @UseGuards(RefreshJwtGuard) // this validates if refresh token is valid and sends request.claims
  async refreshSession(@Request() request: AuthRequest) {
    // Time to live in seconds, max 7 days
    const ttl = Math.min(
      Math.floor(ms(<string>(request.query.ttl ?? '10m')) * 0.001),
      604800
    );

    const timestamp = new Date();

    const claims = {
      ...R.pick(['sub', 'jti', 'role'], request.claims),

      iap: DateTime.fromJSDate(timestamp)
        .minus({
          second: 30,
        })
        .toISO(),
    };

    try {
      await this.session.updateSession(
        {
          _id: request.session._id,
        },
        {
          dateTimeLastRefreshed: new Date(),
        }
      );

      const accessToken = this.jwt.sign(
        {
          ...claims,
          type: TokenType.Access,
        },
        {
          ttl,
        }
      );

      const refreshToken = this.jwt.sign(
        {
          ...claims,
          type: TokenType.Refresh,
        },
        {
          ttl: '24h',
        }
      );

      return {
        session: {
          id: ObjectId.generate(ObjectType.Session).toString(),

          dateTimeCreated: timestamp.toISOString(),
          dateTimeLastRefreshed: timestamp.toISOString(),
        },
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.log('Error refreshing session:', error);
      throw new InternalServerErrorException();
    }
  }

  @Post('session/authenticate')
  async authenticate(@Request() request: AuthRequest) {
    const timestamp = new Date();
    const ttl = Math.min(
      Math.floor(ms(<string>(request.query.ttl ?? '10m')) * 0.001),
      604800
    );

    const password = <string>request.body['password'];

    const account = await this.account.findAccount({
      emailAddress: request.body['emailAddress'],
    });
    /** USE THIS IF
     *
     */
    // console.log(
    //   Buffer.from(password, 'base64').toString('utf8'),
    //   'decoded password'
    // );

    try {
      await this.session.deleteSession({
        account: account._id,
      });
    } catch (error) {
      console.log('Error updating session during authenticate:', error);
    }

    if (!account || !bcrypt.compareSync(password, account.password)) {
      throw new UnauthorizedException({
        error: {
          type: 'INVALID_CREDENTIALS',
          message: 'Invalid credentials provided.',
        },
      });
    }

    const session: Session = {
      _id: ObjectId.generate(ObjectType.Session),
      account: account._id,
      jti: randomBytes(12),
      dateTimeCreated: timestamp,
      dateTimeLastRefreshed: timestamp,
    };

    const claims = {
      sub: account._id.toString(),
      jti: session.jti.toString('hex'),
      role: account.role,
      iap: DateTime.fromJSDate(timestamp)
        .minus({
          second: 30,
        })
        .toISO(),
    };

    await this.session.createSession(session);

    const accessToken = this.jwt.sign(
      {
        ...claims,
        type: TokenType.Access,
      },
      {
        ttl: '5m',
      }
    );
    const refreshToken = this.jwt.sign(
      {
        ...claims,
        type: TokenType.Refresh,
      },
      {
        ttl: '24h',
      }
    );
    return {
      accessToken,
      refreshToken,
    };
  }
}
