import { Global, Inject, Injectable, Optional } from '@nestjs/common';

import yaml from 'yamljs';
import { Tokens } from '../../types/tokens';
import { safeParseFloat } from '../../util/safe-parse-float';
import { ConfigModuleOptions } from './types';

export class MissingConfigError extends Error {
  constructor(key: string) {
    super(`missing config: key=${key}`);
  }
}

@Global()
@Injectable()
export class ConfigService {
  constructor(
    @Optional()
    @Inject(Tokens.ConfigOptions)
    private options: ConfigModuleOptions
  ) {}
  private get(key: string): string {
    const value = this.options?.data?.[key] || process.env[key];

    if (value === undefined) {
      throw new MissingConfigError(key);
    }

    return value;
  }

  public getString(
    key: string,
    opts?: {
      optional?: true;
    }
  ): string {
    try {
      return this.get(key);
    } catch (err) {
      if (opts?.optional && err instanceof MissingConfigError) {
        return;
      }

      throw err;
    }
  }

  public getNumber(
    key: string,
    opts?: {
      optional?: true;
    }
  ): number {
    try {
      return safeParseFloat(this.get(key), 0);
    } catch (err) {
      if (opts?.optional && err instanceof MissingConfigError) {
        return;
      }

      throw err;
    }
  }

  public getBoolean(key: string): boolean {
    try {
      const value = this.get(key);

      return Boolean(value);
    } catch (err) {
      if (err instanceof MissingConfigError) {
        return false;
      }

      throw err;
    }
  }

  public getObject(
    key: string,
    opts?: {
      optional?: true;
    }
  ): object {
    try {
      return yaml.parse(this.get(key));
    } catch (err) {
      if (opts?.optional && err instanceof MissingConfigError) {
        return;
      }

      throw err;
    }
  }
}
