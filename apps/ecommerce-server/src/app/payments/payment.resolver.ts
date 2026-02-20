// payments.resolver.ts
import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { CreateGcashPaymentInput } from '../../types/payment';
import { Tokens } from '../../types/tokens';
import { OrdersRepository } from '../shopping/order/repositories/orders.repository';
import { PaymentsService } from './payments.service';

@Resolver()
export class PaymentsResolver {
  constructor(
    private readonly payments: PaymentsService,
    @Inject(Tokens.OrdersToken)
    private readonly orders: OrdersRepository,
  ) {}

  @Mutation('createGcashPayment')
  async createGcashPayment(@Args('input') input: CreateGcashPaymentInput) {
    const result = await this.payments.createGcashPayment(input);

    const referenceId = input.referenceId ?? '';
    const match = referenceId.match(/^order-(?<orderId>[a-f0-9]{24})$/i);
    const orderId = match?.groups?.orderId;
    if (orderId && result?.payment_request_id) {
      try {
        await this.orders.update(new Types.ObjectId(orderId), {
          paymentRequestId: result.payment_request_id,
          updatedAt: new Date(),
        });
      } catch (error) {
        console.error('Failed to store payment request id on order:', error);
      }
    }

    // return redirect URL to frontend
    return result;
  }
}
