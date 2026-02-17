import { Module } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Tokens } from '../../types/tokens';
import { RatingRepositoryFactory } from './repositories/rating.repository';
import { RatingsController } from './ratings.controller';
import { RatingsService } from './ratings.service';

@Module({
  providers: [
    {
      provide: Tokens.RatingRepository,
      useFactory: RatingRepositoryFactory,
      inject: [getConnectionToken()],
    },
    RatingsService,
  ],
  controllers: [RatingsController],
  exports: [Tokens.RatingRepository, RatingsService],
})
export class RatingsModule {}
