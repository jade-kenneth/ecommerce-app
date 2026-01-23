import { Injectable } from '@nestjs/common';
import {
  CreateGcashPaymentInput,
  PaymentRequestResponse,
} from '../../types/payment';
import { XenditService } from './xendit.service';

@Injectable()
export class PaymentsService {
  constructor(private readonly xendit: XenditService) {}

  async createGcashPayment(
    input: CreateGcashPaymentInput
  ): Promise<PaymentRequestResponse> {
    try {
      return this.xendit.post('/v3/payment_requests', {
        reference_id: input.referenceId,
        type: 'PAY',
        country: 'PH',
        currency: 'PHP',
        request_amount: input.amount,
        capture_method: 'AUTOMATIC',
        channel_code: 'GCASH',
        channel_properties: {
          success_return_url: input.successUrl,
          failure_return_url: input.failureUrl,
        },
        description: input.description ?? 'GCash payment',
      });
    } catch (error) {}
  }
}
