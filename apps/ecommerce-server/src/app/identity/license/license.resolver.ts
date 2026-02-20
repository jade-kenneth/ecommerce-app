import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { LicenseInput } from 'src/app/__generated/graphql-types';
import { ObjectType } from '~/types/common';
import { LicenseService } from './license.service';

@Resolver('Licenses')
export class LicenseResolver {
  constructor(private readonly licenseService: LicenseService) {}

  @Mutation('createLicense')
  async createLicense(@Args('input') input: LicenseInput) {
    await this.licenseService.createLicense({
      ...input,
      _id: new Types.ObjectId(),
      nodeType: ObjectType.License,
    });
  }
}
