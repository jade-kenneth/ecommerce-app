/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Types } from 'mongoose';

import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { JwtService } from '../identity/jwt/jwt.service';
import { SessionService } from '../identity/session/session.service';

const JWT_REGEX =
  /Bearer\s*([A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$)/i;

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwt: JwtService,
    private readonly session: SessionService,
  ) {}

  async use(req: any, _res: any, next: any) {
    if (!req.headers.authorization) {
      return next();
    }

    if (['products'].includes(req.body.operationName)) {
      return next();
    }
    const [, token] = req.headers.authorization.match(JWT_REGEX) || [];

    if (!token) {
      return next();
    }

    let claims;

    try {
      claims = await this.jwt.verify(token);
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new HttpException(
          {
            code: 'ACCESS_TOKEN_EXPIRED',
          },
          HttpStatus.FORBIDDEN,
        );
      }

      if (err instanceof JsonWebTokenError) {
        throw new HttpException(
          {
            code: 'FORBIDDEN',
          },
          HttpStatus.FORBIDDEN,
        );
      }

      throw err;
    }

    const accountId = claims?.sub;
    const jti = claims?.jti;

    if (
      !accountId ||
      !jti ||
      !Types.ObjectId.isValid(accountId) ||
      !/^[a-f0-9]+$/i.test(jti)
    ) {
      throw new HttpException(
        {
          code: 'FORBIDDEN',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const activeSession = await this.session.findSession({
      account: new Types.ObjectId(accountId),
      jti: Buffer.from(jti, 'hex'),
    });

    if (!activeSession) {
      throw new HttpException(
        {
          code: 'SESSION_REPLACED',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    req.session = activeSession;
    req.claims = claims;

    return next();
  }
}
