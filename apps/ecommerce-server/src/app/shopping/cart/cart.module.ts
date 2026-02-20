import { Module } from '@nestjs/common';

import { ProductsModule } from '../../products/products.module';
import { CheckoutModule } from '../checkout/checkout.module';
import { OrderModule } from '../order/order.module';
import { CartService } from './cart.service';
import { CartResolver } from './cart.resolver';
import { CartRepositoryModule } from './repositories/cart.repository.module';

@Module({
  imports: [CartRepositoryModule, ProductsModule, OrderModule, CheckoutModule],
  providers: [CartService, CartResolver],
  exports: [CartService],
})
export class CartModule {}
