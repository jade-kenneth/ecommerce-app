import { Injectable } from '@nestjs/common';
import { MailService } from 'src/app/mail/mail.service';
import { safeParseFloat } from '../../util/safe-parse-float';
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
      <a href="https://amy-store.site"
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

  @AsyncEventHandler('OrderCreated')
  async handleOrderCreated(event: AsyncEvent<'OrderCreated'>) {
    if (!event.data.emailAddress) return;

    const currencySymbol = '₱';
    const formatMoney = (value: unknown) => {
      const safeAmount = safeParseFloat(value, 0);
      return `${currencySymbol}${safeAmount.toFixed(2)}`;
    };

    const items = event.data.items ?? [];
    const itemsHtml = items
      .map((item) => {
        const imageHtml = item.image
          ? `<img src="${item.image}" alt="${item.name}" style="
              width: 56px;
              height: 56px;
              object-fit: cover;
              border-radius: 6px;
              border: 1px solid #e5e7eb;
            " />`
          : `<div style="
              width: 56px;
              height: 56px;
              border-radius: 6px;
              background-color: #e5e7eb;
            "></div>`;

        return `
          <div style="
            display: flex;
            gap: 12px;
            justify-content: center;
            align-items: center;
            margin-bottom: 12px;
          ">
            ${imageHtml}
            <div style="flex: 1; ">
              <div style="font-weight: 600; color: #0f172a;">
                ${item.name}
              </div>
              <div style="font-size: 13px; color: #6b7280;">
                Qty: ${item.quantity}
              </div>
              
            </div>
           
            <div style="font-weight: 600; color: #0f172a;">
              ${formatMoney(item.total)}
            </div>
          </div>
        `;
      })
      .join('');

    await this.mail.sendEmail(
      event.data.emailAddress,
      `Order received: ${event.data.orderId}`,
      `
    <div style="
      max-width: 600px;
      margin: 0 auto;
      font-family: Arial, Helvetica, sans-serif;
      background-color: #ffffff;
      padding: 24px;
      color: #1f2937;
    ">
      <h1 style="
        font-size: 22px;
        margin-bottom: 8px;
        color: #0f172a;
      ">
        Thanks for your order
      </h1>

      <p style="
        font-size: 16px;
        line-height: 1.6;
        margin-bottom: 16px;
      ">
        We have received your order and will start processing it shortly.
      </p>

      <div style="
        background-color: #f8fafc;
        border-left: 4px solid #06b6d4;
        padding: 16px;
        margin: 24px 0;
        border-radius: 6px;
      ">
        <p style="margin: 0; font-size: 15px;">
          Order ID: <strong>${event.data.orderId}</strong><br />
          Items: <strong>${event.data.itemCount}</strong><br />
          Total: <strong>${formatMoney(event.data.total)}</strong>
        </p>
      </div>

      <div style="
        background-color: #ffffff;
        border: 1px solid #e5e7eb;
        padding: 16px;
        border-radius: 8px;
        margin-bottom: 24px;
      ">
        ${itemsHtml}
      </div>

      <p style="
        font-size: 13px;
        color: #6b7280;
        line-height: 1.5;
      ">
        If you have questions, just reply to this email and we will help.
      </p>
    </div>
    `,
    );
  }
}
