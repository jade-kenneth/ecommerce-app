import { Module } from '@nestjs/common';
import { ConfigResolver } from './config.resolver';
import { ConfigService } from './config.service';
import { ConfigRepositoryModule } from './repositories/config.repository.module';

@Module({
  imports: [ConfigRepositoryModule],
  providers: [ConfigResolver, ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
