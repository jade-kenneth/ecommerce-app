import {
  Body,
  Controller,
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
      const data = await this.license.findLicense({
        code: request.code,
      });

      if (!isAfter(new Date(data.expirationDate), new Date())) {
        throw new InternalServerErrorException('License is expired');
      }
      return data;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
