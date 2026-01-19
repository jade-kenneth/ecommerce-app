// payments.resolver.ts
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateGcashPaymentInput } from '../../types/payment';
import { PaymentsService } from './payments.service';

@Resolver()
export class PaymentsResolver {
  constructor(private readonly payments: PaymentsService) {}

  @Mutation('createGcashPayment')
  async createGcashPayment(@Args('input') input: CreateGcashPaymentInput) {
    const result = await this.payments.createGcashPayment(input);

    // return redirect URL to frontend
    return result;
  }
}
