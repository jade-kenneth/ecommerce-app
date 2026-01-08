import { DynamicModule, Module } from '@nestjs/common';
import { Tokens } from '../../types/tokens';
import { ConfigService } from './config.service';
import { ConfigModuleOptions } from './types';

@Module({})
export class ConfigModule {
  static forRoot(options?: ConfigModuleOptions): DynamicModule {
    return {
      global: true,
      module: ConfigModule,
      providers: [
        {
          provide: Tokens.ConfigOptions,
          useValue: options,
        },
        ConfigService,
      ],
      exports: [ConfigService],
    };
  }
}
