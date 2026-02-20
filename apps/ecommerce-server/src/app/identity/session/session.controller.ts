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

import bcrypt from 'bcrypt';
import { DateTime } from 'luxon';
import { Types } from 'mongoose';
import * as R from 'ramda';
import randomBytes from 'randombytes';
import { RefreshJwtGuard } from '../../auth/guards/refresh-jwt.guard';
import { AccountService } from '../account/account.service';
import { JwtService } from '../jwt/jwt.service';
import { Session } from './repositories/session.repository';
import { SessionService } from './session.service';

export type ValidateSessionResult = {
  ok: boolean;
  status: 200 | 403;
};

@Controller()
export class SessionController {
  constructor(
    private readonly session: SessionService,
    private readonly jwt: JwtService,
    private readonly account: AccountService,
  ) {}
  @Post('sessions')
  async createSession(@Request() request: AuthRequest) {
    const timestamp = new Date();

    // Time to live in seconds, max 7 days
    const ttl = Math.min(
      Math.floor(ms(<string>(request.query.ttl ?? '10m')) * 0.001),
      604800,
    );

    const { user } = request.body;
    const accountId = new Types.ObjectId(user._id);

    const session: Session = {
      _id: new Types.ObjectId(),
      account: accountId,
      jti: randomBytes(12),
      dateTimeCreated: timestamp,
      dateTimeLastRefreshed: timestamp,
    };

    const claims = {
      sub: accountId.toString(),
      jti: session.jti.toString('hex'),
      role: user.role,
      iap: DateTime.fromJSDate(timestamp)
        .minus({
          second: 30,
        })
        .toISO(),
    };

    try {
      await this.session.deleteSession({
        account: accountId,
      });

      await this.session.createSession(session);

      const accessToken = this.jwt.sign(
        {
          ...claims,
          type: TokenType.Access,
        },
        {
          ttl,
        },
      );

      const refreshToken = this.jwt.sign(
        {
          ...claims,
          type: TokenType.Refresh,
        },
        {
          ttl: '24h',
        },
      );
      return {
        session: {
          id: session._id.toString(),
          dateTimeCreated: session.dateTimeCreated.toISOString(),
        },
        accessToken,
        refreshToken,
        role: user.role,
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
      604800,
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
          jti: Buffer.from(claims.jti, 'hex'),
          dateTimeLastRefreshed: new Date(),
        },
      );

      const accessToken = this.jwt.sign(
        {
          ...claims,
          type: TokenType.Access,
        },
        {
          ttl,
        },
      );

      const refreshToken = this.jwt.sign(
        {
          ...claims,
          type: TokenType.Refresh,
        },
        {
          ttl: '24h',
        },
      );

      return {
        session: {
          _id: new Types.ObjectId(),

          dateTimeCreated: timestamp.toISOString(),
          dateTimeLastRefreshed: timestamp.toISOString(),
        },
        accessToken,
        refreshToken,
      };
    } catch {
      throw new InternalServerErrorException();
    }
  }

  @Post('session/validate')
  async validateSession(
    @Request() request: AuthRequest,
  ): Promise<ValidateSessionResult> {
    try {
      if (!request.claims || !request.session) {
        throw new UnauthorizedException({
          code: 'INVALID_TOKEN',
        });
      }

      if (request.claims.type !== TokenType.Access) {
        throw new UnauthorizedException({
          code: 'INVALID_TOKEN_TYPE',
        });
      }

      if (
        !request.claims.sub ||
        !request.claims.jti ||
        !Types.ObjectId.isValid(request.claims.sub) ||
        !/^[a-f0-9]+$/i.test(request.claims.jti)
      ) {
        throw new UnauthorizedException({
          code: 'INVALID_TOKEN',
        });
      }

      const activeSession = await this.session.findSession({
        account: new Types.ObjectId(request.claims.sub),
        jti: Buffer.from(request.claims.jti, 'hex'),
      });

      if (!activeSession) {
        return {
          ok: false,
          status: 403,
        };
      }

      return {
        ok: true,
        status: 200,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new InternalServerErrorException();
    }
  }

  @Post('session/logout')
  @UseGuards(RefreshJwtGuard)
  async logout(@Request() request: AuthRequest) {
    try {
      await this.session.deleteSession({ _id: request.session._id });
      return { success: true };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @Post('session/authenticate')
  async authenticate(@Request() request: AuthRequest) {
    const timestamp = new Date();
    const ttl = Math.min(
      Math.floor(ms(<string>(request.query.ttl ?? '10m')) * 0.001),
      604800,
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

    if (!account || !bcrypt.compareSync(password, account.password)) {
      throw new UnauthorizedException({
        error: {
          type: 'INVALID_CREDENTIALS',
          message: 'Invalid credentials provided.',
        },
      });
    }

    try {
      await this.session.deleteSession({
        account: account._id,
      });
    } catch {
      throw new InternalServerErrorException(
        'Unable to reset previous sessions.',
      );
    }

    const session: Session = {
      _id: new Types.ObjectId(),
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
      },
    );
    const refreshToken = this.jwt.sign(
      {
        ...claims,
        type: TokenType.Refresh,
      },
      {
        ttl: '24h',
      },
    );
    return {
      accessToken,
      refreshToken,
      role: account.role,
    };
  }
}
