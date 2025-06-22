import { Inject, Injectable } from '@nestjs/common';
import { Decimal128 } from 'mongodb';
import { Types } from 'mongoose';
import { CreateProductInput } from '../__generated/graphql-types';

import { Product } from '../../types/product';

import { Filter } from '../../libs/repository';
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
  }): Promise<Array<Product>> {
    const { filter } = params;

    const data = await this.products.list(filter, {
      sort: { dateAdded: 'desc' },
    });
    let serialized = [];
    const serializeInput = (obj: Record<string, any>) => {
      const result: Record<string, any> = {};
      for (const key in obj) {
        const val = obj[key];
        result[key] = val instanceof Decimal128 ? val.toString() : val;
      }
      return result;
    };
    for (const item of data) {
      const d = serializeInput(item);
      serialized.push(d);
    }
    return serialized as Array<Product>;
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
