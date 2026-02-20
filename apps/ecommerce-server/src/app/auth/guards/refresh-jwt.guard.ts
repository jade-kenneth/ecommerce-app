import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenExpiredError } from 'jsonwebtoken';
import { Types } from 'mongoose';
import { JwtService } from '../../identity/jwt/jwt.service';
import { SessionService } from '../../identity/session/session.service';
import { Claims } from '../../identity/types';

const JWT_REGEX =
  /Bearer\s*([A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$)/i;

@Injectable()
export class RefreshJwtGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly session: SessionService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const match = (request.headers.authorization || '').match(JWT_REGEX);

    if (!match) throw new ForbiddenException();

    const [, token] = match;

    try {
      const claims = this.jwt.verify<Claims>(token);

      if (
        !claims.sub ||
        !claims.jti ||
        !Types.ObjectId.isValid(claims.sub) ||
        !/^[a-f0-9]+$/i.test(claims.jti)
      ) {
        throw new ForbiddenException({
          code: 'INVALID_TOKEN',
        });
      }

      const session = await this.session.findSession({
        account: new Types.ObjectId(claims.sub),
        jti: Buffer.from(claims.jti, 'hex'),
      });

      if (!session) {
        throw new UnauthorizedException({
          code: 'SESSION_REPLACED',
        });
      }

      request.session = session;
      request.claims = claims;

      return true;
    } catch (error) {
      if (
        error instanceof ForbiddenException ||
        error instanceof UnauthorizedException
      )
        throw error;

      if (error instanceof TokenExpiredError) {
        throw new ForbiddenException({
          code: 'REFRESH_TOKEN_EXPIRED',
        });
      }

      throw new InternalServerErrorException(error);
    }
  }
}
