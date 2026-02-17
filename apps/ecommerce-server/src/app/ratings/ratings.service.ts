import { Inject } from '@nestjs/common';
import { Types } from 'mongoose';
import { Tokens } from '../../types/tokens';
import { Rating, RatingRepository } from './repositories/rating.repository';

type CreateRatingInput = Omit<Rating, '_id' | 'createdAt'>;

export class RatingsService {
  constructor(
    @Inject(Tokens.RatingRepository)
    private readonly ratingRepository: RatingRepository,
  ) {}

  async createRating(input: CreateRatingInput): Promise<Rating> {
    const rating: Rating = {
      _id: new Types.ObjectId(),
      ...input,
      createdAt: new Date(),
    };

    await this.ratingRepository.create(rating);

    return rating;
  }
}
