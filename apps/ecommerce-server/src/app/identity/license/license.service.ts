import { Inject } from '@nestjs/common';

import { Types } from 'mongoose';
import { Filter } from '../../../libs/repository';
import { Tokens } from '../../../types/tokens';
import { License, LicenseRepository } from './repositories/license.repository';

export class LicenseService {
  constructor(
    @Inject(Tokens.LicenseRepository)
    private licenseRepository: LicenseRepository
  ) {}

  async createLicense(license: License) {
    return await this.licenseRepository.create(license);
  }

  async deleteLicense(filter: Types.ObjectId | Filter<License>) {
    return this.licenseRepository.delete(filter);
  }

  async findLicense(filter: Types.ObjectId | Filter<License>) {
    return await this.licenseRepository.find(filter);
  }

  async updateLicense(
    filter: Types.ObjectId | Filter<License>,
    data: Partial<Omit<License, '_id'>>
  ) {
    return this.licenseRepository.update(filter, data);
  }
}
