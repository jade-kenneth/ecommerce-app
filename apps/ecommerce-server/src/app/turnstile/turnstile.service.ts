import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import type { Request } from 'express';

import { ConfigService } from '../config/config.service';

const TURNSTILE_SITEVERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export const TURNSTILE_TOKEN_HEADER = 'x-turnstile-token';
const TURNSTILE_FALLBACK_HEADER = 'cf-turnstile-response';

type TurnstileRequest = Pick<Request, 'body' | 'headers' | 'ip' | 'socket'>;

type TurnstileVerificationOptions = {
  action: string;
};

type TurnstileSiteverifyResponse = {
  success: boolean;
  action?: string;
  cdata?: string;
  challenge_ts?: string;
  hostname?: string;
  'error-codes': string[];
};

@Injectable()
export class TurnstileService {
  constructor(private readonly config: ConfigService) {}

  async assertVerified(
    request: TurnstileRequest,
    options: TurnstileVerificationOptions,
  ) {
    const secretKey = this.getSecretKey();

    const token = this.getToken(request);

    if (!token) {
      throw new BadRequestException({
        error: {
          type: 'TURNSTILE_TOKEN_REQUIRED',
          message: 'Turnstile verification is required.',
        },
      });
    }

    const verification = await this.verifyToken(
      secretKey,
      token,
      this.getRemoteIp(request),
    );

    if (!verification.success) {
      console.log('Turnstile verification failed:', token);
      throw new ForbiddenException({
        error: {
          type: 'TURNSTILE_VERIFICATION_FAILED',
          message: 'Turnstile verification failed.',
          codes: verification['error-codes'],
        },
      });
    }

    if (verification.action !== options.action) {
      console.log('Turnstile action mismatch:', token);
      throw new ForbiddenException({
        error: {
          type: 'TURNSTILE_ACTION_MISMATCH',
          message: 'Turnstile verification failed.',
          expectedAction: options.action,
          actualAction: verification.action ?? null,
        },
      });
    }
  }

  private getSecretKey() {
    const secretKey = this.config.getString('CLOUDFLARE_TURNSTILE_SECRET_KEY', {
      optional: true,
    });

    if (!secretKey?.trim()) {
      throw new ServiceUnavailableException({
        error: {
          type: 'TURNSTILE_NOT_CONFIGURED',
          message: 'Turnstile is not configured.',
        },
      });
    }

    return secretKey.trim();
  }

  private getToken(request: TurnstileRequest) {
    const candidates = [
      request.headers[TURNSTILE_TOKEN_HEADER],
      request.headers[TURNSTILE_FALLBACK_HEADER],
      this.getBodyValue(request.body, 'turnstileToken'),
      this.getBodyValue(request.body, 'cfTurnstileResponse'),
      this.getBodyValue(request.body, 'cf-turnstile-response'),
      this.getNestedBodyValue(request.body, ['variables', 'turnstileToken']),
      this.getNestedBodyValue(request.body, [
        'variables',
        'cfTurnstileResponse',
      ]),
      this.getNestedBodyValue(request.body, [
        'variables',
        'cf-turnstile-response',
      ]),
      this.getNestedBodyValue(request.body, [
        'variables',
        'input',
        'turnstileToken',
      ]),
      this.getNestedBodyValue(request.body, [
        'variables',
        'input',
        'cfTurnstileResponse',
      ]),
      this.getNestedBodyValue(request.body, [
        'variables',
        'input',
        'cf-turnstile-response',
      ]),
    ];

    for (const candidate of candidates) {
      const value = this.toTrimmedString(candidate);
      if (value) {
        return value;
      }
    }

    return null;
  }

  private getBodyValue(body: unknown, key: string) {
    if (!this.isRecord(body)) {
      return undefined;
    }

    return body[key];
  }

  private getNestedBodyValue(body: unknown, path: string[]) {
    let current: unknown = body;

    for (const segment of path) {
      if (!this.isRecord(current)) {
        return undefined;
      }

      current = current[segment];
    }

    return current;
  }

  private toTrimmedString(value: unknown) {
    if (typeof value === 'string') {
      const normalized = value.trim();
      return normalized.length > 0 ? normalized : null;
    }

    if (Array.isArray(value)) {
      for (const entry of value) {
        const normalized = this.toTrimmedString(entry);
        if (normalized) {
          return normalized;
        }
      }
    }

    return null;
  }

  private getRemoteIp(request: TurnstileRequest) {
    const forwardedFor = this.toTrimmedString(
      request.headers['x-forwarded-for'],
    );
    if (forwardedFor) {
      return forwardedFor.split(',')[0]?.trim() || undefined;
    }

    return request.ip || request.socket?.remoteAddress || undefined;
  }

  private async verifyToken(
    secretKey: string,
    token: string,
    remoteIp?: string,
  ) {
    const body = new URLSearchParams({
      secret: secretKey,
      response: token,
    });

    if (remoteIp) {
      body.set('remoteip', remoteIp);
    }

    let response: Response;

    try {
      response = await fetch(TURNSTILE_SITEVERIFY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
      });
    } catch {
      throw new InternalServerErrorException({
        error: {
          type: 'TURNSTILE_UNAVAILABLE',
          message: 'Unable to verify Turnstile.',
        },
      });
    }

    if (!response.ok) {
      throw new InternalServerErrorException({
        error: {
          type: 'TURNSTILE_UNAVAILABLE',
          message: 'Unable to verify Turnstile.',
        },
      });
    }

    const payload: unknown = await response.json();

    return this.parseSiteverifyResponse(payload);
  }

  private parseSiteverifyResponse(
    payload: unknown,
  ): TurnstileSiteverifyResponse {
    if (!this.isRecord(payload) || typeof payload.success !== 'boolean') {
      throw new InternalServerErrorException({
        error: {
          type: 'TURNSTILE_INVALID_RESPONSE',
          message: 'Invalid Turnstile verification response.',
        },
      });
    }

    const errorCodes = Array.isArray(payload['error-codes'])
      ? payload['error-codes'].filter(
          (code): code is string => typeof code === 'string',
        )
      : [];

    return {
      success: payload.success,
      action: typeof payload.action === 'string' ? payload.action : undefined,
      cdata: typeof payload.cdata === 'string' ? payload.cdata : undefined,
      challenge_ts:
        typeof payload.challenge_ts === 'string'
          ? payload.challenge_ts
          : undefined,
      hostname:
        typeof payload.hostname === 'string' ? payload.hostname : undefined,
      'error-codes': errorCodes,
    };
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }
}
