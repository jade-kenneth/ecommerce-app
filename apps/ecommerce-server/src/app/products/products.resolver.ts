import { Query, Resolver } from '@nestjs/graphql';
import { ProductsService } from './products.service';

@Resolver('Product')
export class ProductResolver {
  constructor(private readonly productService: ProductsService) {}

  @Query('products')
  async products() {
    return this.productService.listOfProducts();
  }
}
