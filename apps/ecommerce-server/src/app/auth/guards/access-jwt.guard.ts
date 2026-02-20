import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { AccountService } from '../../identity/account/account.service';
import { JwtService } from '../../identity/jwt/jwt.service';
import { Claims } from '../../identity/types';

const JWT_REGEX =
  /Bearer\s*([A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$)/i;

@Injectable()
export class AccessJwtGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,

    private readonly account: AccountService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const match = (request.headers.authorization || '').match(JWT_REGEX);

    if (!match) throw new ForbiddenException();

    const [, token] = match;

    try {
      const claims = this.jwt.verify<Claims>(token);

      request.claims = claims;

      return true;
    } catch (error) {
      const { ipAddress, location } = request;

      if (error instanceof ForbiddenException) throw error;

      if (error.name === 'TokenExpiredError') {
        throw new ForbiddenException({
          code: 'ACCESS_TOKEN_EXPIRED',
        });
      }

      throw new InternalServerErrorException(error);
    }
  }
}
