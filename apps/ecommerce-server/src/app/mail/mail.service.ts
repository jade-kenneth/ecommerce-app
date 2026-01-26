import * as Brevo from '@getbrevo/brevo';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  private emailApi: Brevo.TransactionalEmailsApi;

  constructor() {
    this.emailApi = new Brevo.TransactionalEmailsApi();

    this.emailApi.setApiKey(
      Brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY!,
    );
  }

  async sendEmail(to: string, subject: string, html: string) {
    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.sender = {
      name: 'Jade Kenneth From DarundayInc ',
      email: process.env.BREVO_SENDER_EMAIL!,
    };
    sendSmtpEmail.to = [{ email: to }];
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;

    try {
      const response = await this.emailApi.sendTransacEmail(sendSmtpEmail);
      return response;
    } catch (err) {
      console.error('Brevo send email error:', err);
      throw err;
    }
  }
}
