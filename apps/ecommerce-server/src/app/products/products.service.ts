import { Inject, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { CreateProductInput } from '../__generated/graphql-types';

import { Product } from '../../types/product';

import { Connection, Filter } from '../../libs/repository';
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
      .list(filter, { sort: { dateAdded: 'asc' } })
      .connection({});

    return data;
  }
  public async createProduct(params: CreateProductInput) {
    const newObjectId = new Types.ObjectId();
    await this.products
      .create({ ...params, _id: newObjectId })
      .catch(async (err) => {
        console.log(err, 'error');
        return;
      });
  }
}
