import {
  BadRequestException,
  Body,
  Controller,
  HttpException,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { isAfter } from 'date-fns';
import { LicenseService } from './license.service';
import { License } from './repositories/license.repository';

@Controller()
export class LicenseController {
  constructor(private readonly license: LicenseService) {}

  @Post('validate/license')
  async validateLicense(@Body() request: { code: string }): Promise<License> {
    try {
      const data = await this.license.findLicense({ code: request.code });

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
