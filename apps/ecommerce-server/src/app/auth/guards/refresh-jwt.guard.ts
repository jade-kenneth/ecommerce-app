import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { TokenExpiredError } from 'jsonwebtoken';
import { JwtService } from '../../user-session/jwt/jwt.service';
import { SessionService } from '../../user-session/session/session.service';
import { Claims } from '../../user-session/types';

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

      const session = await this.session.findSession({
        jti: Buffer.from(claims.jti, 'hex'),
      });

      if (!session)
        throw new ForbiddenException({
          code: 'INVALID_TOKEN',
        });

      request.session = session;
      request.claims = claims;

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;

      if (error instanceof TokenExpiredError) {
        throw new ForbiddenException({
          code: 'REFRESH_TOKEN_EXPIRED',
        });
      }

      throw new InternalServerErrorException(error);
    }
  }
}
