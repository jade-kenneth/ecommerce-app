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
      `
    <div style="
      max-width: 600px;
      margin: 0 auto;
      font-family: Arial, Helvetica, sans-serif;
      background-color: #ffffff;
      padding: 24px;
      color: #1f2937;
    ">
      
      <!-- Header -->
      <h1 style="
        font-size: 24px;
        margin-bottom: 8px;
        color: #0f172a;
      ">
        Welcome, ${event.data.firstName}! 🎉
      </h1>

      <p style="
        font-size: 16px;
        line-height: 1.6;
        margin-bottom: 16px;
      ">
        We’re excited to let you know that your member account has been
        <strong>successfully created</strong>.
      </p>

      <!-- Highlight box -->
      <div style="
        background-color: #f8fafc;
        border-left: 4px solid #06b6d4;
        padding: 16px;
        margin: 24px 0;
        border-radius: 6px;
      ">
        <p style="margin: 0; font-size: 15px;">
          You can now access your account, explore features, and start your journey with us right away.
        </p>
      </div>

      <!-- CTA -->
      <a href="#"
        style="
          display: inline-block;
          background-color: #06b6d4;
          color: #ffffff;
          text-decoration: none;
          padding: 12px 20px;
          border-radius: 6px;
          font-size: 15px;
          font-weight: bold;
        ">
        Log in to Your Account
      </a>

      <!-- Footer -->
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />

      <p style="
        font-size: 13px;
        color: #6b7280;
        line-height: 1.5;
      ">
        If you didn’t create this account, you can safely ignore this email.
        <br />
        Need help? Just reply to this message — we’re happy to assist.
      </p>

      <p style="
        font-size: 13px;
        color: #6b7280;
        margin-top: 16px;
      ">
        — The Team
      </p>
    </div>
    `,
    );
  }
}
