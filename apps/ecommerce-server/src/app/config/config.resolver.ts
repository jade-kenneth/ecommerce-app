import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreateConfigInput,
  UpdateConfigInput,
} from '../__generated/graphql-types';
import { ConfigService } from './config.service';

@Resolver()
export class ConfigResolver {
  constructor(private readonly configService: ConfigService) {}

  @Mutation('createConfig')
  async createConfig(@Args('input') input: CreateConfigInput) {
    return this.configService.createConfig(input);
  }

  @Mutation('updateConfig')
  async updateConfig(@Args('input') input: UpdateConfigInput) {
    return this.configService.updateConfig(input);
  }

  @Query('config')
  async getConfig() {
    return this.configService.getConfig();
  }
}
