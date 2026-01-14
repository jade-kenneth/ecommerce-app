/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';

import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { JwtService } from '../user-session/jwt/jwt.service';

const JWT_REGEX =
  /Bearer\s*([A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$)/i;

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwt: JwtService) {}

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
      if (err instanceof JsonWebTokenError) {
        throw new HttpException(
          {
            code: 'FORBIDDEN',
          },
          HttpStatus.FORBIDDEN
        );
      }

      if (err instanceof TokenExpiredError) {
        throw new HttpException(
          {
            code: 'ACCESS_TOKEN_EXPIRED',
          },
          HttpStatus.FORBIDDEN
        );
      }

      throw err;
    }

    req.claims = claims;

    return next();
  }
}
