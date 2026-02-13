import { Module } from '@nestjs/common';

import { ProductsService } from '../products/products.service';
import { ProductsRepositoryModule } from '../products/repositories/product.repository.module';
import { AccountModule } from '../user-session/account/account.module';
import { PaymentsModule } from '../payments/payment.module';
import { CartResolver } from './carts.resolver';
import { CartsService } from './carts.service';
import { CartsRepositoryModule } from './repositories/carts.repository.module';
import { OrdersRepositoryModule } from './repositories/orders.repository.module';

@Module({
  imports: [
    CartsRepositoryModule,
    OrdersRepositoryModule,
    ProductsRepositoryModule,
    AccountModule,
    PaymentsModule,
  ],
  providers: [CartsService, CartResolver, ProductsService],
  exports: [CartsService],
})
export class CartsModule {}
