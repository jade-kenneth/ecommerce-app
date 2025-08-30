import { Inject, Injectable } from '@nestjs/common';
import { Tokens } from '../../types/tokens';
import {
  CreateConfigInput,
  UpdateConfigInput,
} from '../__generated/graphql-types';
import { Config, ConfigRepository } from './repositories/config.repository';

@Injectable()
export class ConfigService {
  constructor(@Inject(Tokens.ConfigToken) private config: ConfigRepository) {}

  public async getConfig(): Promise<Config> {
    const config = await this.config.list({}).collect();

    return config[0];
  }

  public async createConfig(params: CreateConfigInput) {
    await this.config.create(params);
  }

  public async updateConfig(params: UpdateConfigInput) {
    const { _id, ...updateData } = params;

    await this.config
      .update(_id, {
        ...updateData,
      })
      .catch(async (err) => {
        console.error(err, 'error updating config');
        return;
      });
  }

  public async getHighPointsThreshold() {
    const { highPointsThreshold } = await this.getConfig();
    return highPointsThreshold;
  }
}
