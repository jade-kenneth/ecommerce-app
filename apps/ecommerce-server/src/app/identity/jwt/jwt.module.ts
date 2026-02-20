import { DynamicModule, Module, ModuleMetadata } from '@nestjs/common';

import { Tokens } from '~/types/tokens';
import { JwtService, JwtServiceOptions } from './jwt.service';

export type JwtModuleOptions = JwtServiceOptions;
export type JwtModuleAsyncOptions = Pick<ModuleMetadata, 'imports'> & {
  useFactory: (
    ...args: unknown[]
  ) => Promise<JwtModuleOptions> | JwtModuleOptions;
  inject?: unknown[];
};
@Module({})
export class JwtModule {
  public static forRootAsync(options: JwtModuleAsyncOptions): DynamicModule {
    return {
      global: true,
      module: JwtModule,
      providers: [
        {
          provide: Tokens.JwtServiceOptions,
          useFactory: options.useFactory,
          inject: <never>(options.inject ?? []),
        },
        JwtService,
      ],
      exports: [JwtService],
    };
  }
}
