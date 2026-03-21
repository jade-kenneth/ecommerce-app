import {
  BadRequestException,
  Body,
  Controller,
  HttpException,
  InternalServerErrorException,
  Post,
  Request,
} from '@nestjs/common';
import { addMinutes, isAfter } from 'date-fns';
import { isNil } from 'es-toolkit/compat';
import { LicenseVariant } from 'src/app/__generated/graphql-types';
import { TurnstileService } from '../../turnstile/turnstile.service';
import { AuthRequest } from '../types';
import { LicenseService } from './license.service';
import { License } from './repositories/license.repository';
@Controller()
export class LicenseController {
  constructor(
    private readonly license: LicenseService,
    private readonly turnstile: TurnstileService,
  ) {}

  @Post('validate/license')
  async validateLicense(
    @Body() request: { code: string },
    @Request() authRequest: AuthRequest,
  ): Promise<License> {
    try {
      await this.turnstile.assertVerified(authRequest, {
        action: 'license',
      });

      const data = await this.license.findLicense({ code: request.code });

      if (!data) {
        throw new BadRequestException('Invalid license code');
      }
      if (isNil(data.expirationDate)) {
        let expirationDate: string;
        if (data.variant === LicenseVariant.ONE_MINUTE_TRIAL) {
          expirationDate = addMinutes(new Date(), 1).toISOString();
        } else if (data.variant === LicenseVariant.FIVE_MINUTE_TRIAL) {
          expirationDate = addMinutes(new Date(), 5).toISOString();
        } else if (data.variant === LicenseVariant.TEN_MINUTE_TRIAL) {
          expirationDate = addMinutes(new Date(), 10).toISOString();
        } else if (data.variant === LicenseVariant.ONE_HOUR_TRIAL) {
          expirationDate = addMinutes(new Date(), 60).toISOString();
        }

        await this.license.updateLicense(data._id, {
          expirationDate,
        });
        return {
          ...data,
          expirationDate,
        };
      }
      const isExpired = !isAfter(data?.expirationDate, new Date());

      if (isExpired) {
        throw new BadRequestException('License is expired');
      }

      return data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error('Unexpected error validating license:', error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
