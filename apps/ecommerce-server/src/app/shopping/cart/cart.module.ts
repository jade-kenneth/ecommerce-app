import { Module } from '@nestjs/common';

import { ProductsModule } from '../../products/products.module';
import { CheckoutModule } from '../checkout/checkout.module';

import { CartResolver } from './cart.resolver';
import { CartService } from './cart.service';
import { CartRepositoryModule } from './repositories/cart.repository.module';

@Module({
  imports: [CartRepositoryModule, ProductsModule, CheckoutModule],
  providers: [CartService, CartResolver],
  exports: [CartService],
})
export class CartModule {}
