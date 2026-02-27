import { Module } from '@nestjs/common';

import { PaymentsModule } from '../../payments/payment.module';
import { ProductReviewsRepositoryModule } from '../../product-reviews/repositories/product-reviews.repository.module';
import { OrderService } from './order.service';
import { OrdersRepositoryModule } from './repositories/orders.repository.module';

@Module({
  imports: [
    OrdersRepositoryModule,
    PaymentsModule,
    ProductReviewsRepositoryModule,
  ],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
