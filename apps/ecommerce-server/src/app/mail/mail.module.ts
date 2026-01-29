import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';

@Module({
  providers: [MailService], // temp remove EmailHandler, will add back if async event implemented
  controllers: [MailController],
  exports: [MailService],
})
export class MailModule {}
