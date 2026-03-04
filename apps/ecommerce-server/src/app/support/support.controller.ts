import {
  BadRequestException,
  Body,
  Controller,
  HttpException,
  InternalServerErrorException,
  Post,
  Request,
} from '@nestjs/common';
import { AuthRequest } from '../identity/types';
import { SupportService } from './support.service';

type CreateSupportAnswerBody = {
  prompt: string;
  model?: string;
  instructions?: string;
};

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post('answer')
  async createAnswer(
    @Body() body: CreateSupportAnswerBody,
    @Request() request: AuthRequest,
  ): Promise<{ outputText: string }> {
    const prompt = body?.prompt?.trim();

    if (!prompt) {
      throw new BadRequestException('prompt is required');
    }

    try {
      const outputText = await this.supportService.createSupportAnswer(prompt, {
        model: body.model,
        instructions: body.instructions,
        claims: request.claims,
      });

      return { outputText };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        error instanceof Error
          ? error.message
          : 'Failed to create support answer',
      );
    }
  }
}
