import { Module } from '@nestjs/common';

import { ProductsService } from '../products/products.service';
import { ProductsRepositoryModule } from '../products/repositories/product.repository.module';
import { AccountModule } from '../user-session/account/account.module';
import {
  CartItemResolver,
  CartResolver,
  OrderResolver,
} from './carts.resolver';
import { CartsService } from './carts.service';
import { CartsRepositoryModule } from './repositories/carts.repository.module';
import { OrdersRepositoryModule } from './repositories/orders.repository.module';

@Module({
  imports: [
    CartsRepositoryModule,
    OrdersRepositoryModule,
    ProductsRepositoryModule,
    AccountModule,
  ],
  providers: [
    CartsService,
    CartResolver,
    OrderResolver,
    CartItemResolver,
    ProductsService,
  ],
  exports: [CartsService],
})
export class CartsModule {}
