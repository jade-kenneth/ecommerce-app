import { Module } from '@nestjs/common';

import { ProductsModule } from '../../products/products.module';
import { AccountModule } from '../../identity/account/account.module';
import { CartRepositoryModule } from '../cart/repositories/cart.repository.module';
import { OrdersRepositoryModule } from '../order/repositories/orders.repository.module';
import { CheckoutMethodSettingsService } from './checkout-method-settings.service';
import { CheckoutService } from './checkout.service';
import { CheckoutMethodSettingsRepositoryModule } from './repositories/checkout-method-settings.repository.module';

@Module({
  imports: [
    CartRepositoryModule,
    OrdersRepositoryModule,
    CheckoutMethodSettingsRepositoryModule,
    ProductsModule,
    AccountModule,
  ],
  providers: [CheckoutService, CheckoutMethodSettingsService],
  exports: [CheckoutService, CheckoutMethodSettingsService],
})
export class CheckoutModule {}
