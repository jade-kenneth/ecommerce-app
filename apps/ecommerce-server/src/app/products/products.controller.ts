import { Controller, Get } from '@nestjs/common';

@Controller('products')
export class ProductsController {
  @Get()
  findProduct() {
    return 'product 3';
  }
}
