import { Inject, Injectable } from '@nestjs/common';
import { CreateProductInput } from '../__generated/graphql-types';

import { Product } from '../../types/product';

import { Connection, Filter } from '../../libs/repository';
import { EventType } from '../../types/common';
import { generateCursor } from '../../util/generate-cursor';
import { ProductRepositoryToken } from './repositories/product.repository.module';
import { ProductRepository } from './repositories/products.repository';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(ProductRepositoryToken)
    private products: ProductRepository
  ) {}

  public async getProducts(params: {
    filter: Filter<Product>;
  }): Promise<Connection<Product>> {
    const { filter } = params;

    const data = await this.products
      .list(filter)
      .connection({ order: 'desc', first: 10 });

    return data;
  }
  public async createProduct(params: CreateProductInput) {
    await this.products
      .create({
        ...params,

        cursor: generateCursor(
          new Date().toISOString(),
          EventType.ProductCreated.toString()
        ),
      })
      .catch(async (err) => {
        console.log(err, 'error');
        return;
      });
  }
}
