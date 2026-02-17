import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { Rating } from './repositories/rating.repository';
import { RatingsService } from './ratings.service';

type CreateRatingBody = {
  ratings: number;
  improvement: string[];
  customImprovement: string;
  userId: string;
  userEmail: string;
  notify: boolean;
};

@Controller()
export class RatingsController {
  constructor(private readonly ratings: RatingsService) {}

  @Post('rating')
  async createRating(@Body() body: CreateRatingBody): Promise<Rating> {
    if (!this.isValidCreateRatingBody(body)) {
      throw new BadRequestException('Invalid rating payload');
    }

    const cleanBody: CreateRatingBody = {
      ratings: body.ratings,
      improvement: body.improvement
        .map((item) => item.trim())
        .filter((item) => item.length > 0),
      customImprovement: body.customImprovement.trim(),
      userId: body.userId.trim(),
      userEmail: body.userEmail.trim().toLowerCase(),
      notify: body.notify,
    };

    try {
      return await this.ratings.createRating(cleanBody);
    } catch (error) {
      console.error('Unexpected error creating rating:', error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  private isValidCreateRatingBody(body: unknown): body is CreateRatingBody {
    if (!body || typeof body !== 'object') {
      return false;
    }

    const payload = body as Partial<CreateRatingBody>;

    if (!Number.isFinite(payload.ratings)) {
      return false;
    }

    if (
      !Array.isArray(payload.improvement) ||
      payload.improvement.some((item) => typeof item !== 'string')
    ) {
      return false;
    }

    if (!this.isStringWithMaxLength(payload.customImprovement, 120)) {
      return false;
    }

    if (!this.isNonEmptyString(payload.userId)) {
      return false;
    }

    if (
      !this.isNonEmptyString(payload.userEmail) ||
      !this.isEmail(payload.userEmail)
    ) {
      return false;
    }

    if (typeof payload.notify !== 'boolean') {
      return false;
    }

    return true;
  }

  private isNonEmptyString(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0;
  }

  private isStringWithMaxLength(value: unknown, maxLength: number): boolean {
    return typeof value === 'string' && value.trim().length <= maxLength;
  }

  private isEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }
}
