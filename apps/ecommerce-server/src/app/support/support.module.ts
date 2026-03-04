import { Module } from '@nestjs/common';
import { ProductsModule } from '../products/products.module';
import { OrderModule } from '../shopping/order/order.module';
import { SupportController } from './support.controller';
import { SupportService } from './support.service';

@Module({
  imports: [ProductsModule, OrderModule],
  controllers: [SupportController],
  providers: [SupportService],
  exports: [SupportService],
})
export class SupportModule {}
