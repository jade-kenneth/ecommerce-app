import { Injectable } from '@nestjs/common';
import { MailService } from 'src/app/mail/mail.service';
import { AsyncEventHandler } from '../async-event-module/async-event-handler.decorator';
import { AsyncEvent } from '../async-event-module/types';

@Injectable()
export class EmailHandler {
  constructor(private readonly mail: MailService) {}

  @AsyncEventHandler('SuccessfulSignup')
  async handle(event: AsyncEvent<'SuccessfulSignup'>) {
    await this.mail.sendEmail(
      event.data.emailAddress,
      'Welcome!',
      `<p>Hello ${event.data.firstName}, your member account was created.</p>`,
    );
  }
}
