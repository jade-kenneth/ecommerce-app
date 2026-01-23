import { Inject, Injectable } from '@nestjs/common';

import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { Tokens } from '~/types/tokens';

export type JwtServiceOptions = {
  secret: string;
  oldSecret?: string;
};

@Injectable()
export class JwtService {
  constructor(
    @Inject(Tokens.JwtServiceOptions)
    private readonly options: JwtServiceOptions
  ) {}

  sign(
    claims: Record<string, unknown>,
    params?: {
      ttl?: number | string;
      sub?: string;
      secret?: string;
    }
  ): string {
    const options: jwt.SignOptions = {
      expiresIn: params?.ttl ?? 300,
    };

    if (params?.sub) {
      options.subject = params.sub;
    }

    return jwt.sign(claims, params?.secret ?? this.options.secret, options);
  }

  verify<T = Record<string, unknown>>(token: string): T {
    let claims: T;

    try {
      claims = <T>jwt.verify(token, this.options.secret);
    } catch (err) {
      if (err instanceof JsonWebTokenError && this.options.oldSecret) {
        claims = <T>jwt.verify(token, this.options.oldSecret);
      } else {
        throw err;
      }
    }

    return claims;
  }
}
