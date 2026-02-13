import { Module } from '@nestjs/common';

import { OrdersRepositoryModule } from '../carts/repositories/orders.repository.module';
import { PaymentsResolver } from './payment.resolver';
import { PaymentsService } from './payments.service';
import { XenditService } from './xendit.service';

@Module({
  // add repository module for saving referenceId in db
  imports: [OrdersRepositoryModule],
  providers: [PaymentsService, XenditService, PaymentsResolver],
})
export class PaymentsModule {}
