import { Inject, Injectable } from '@nestjs/common';
import { CreateProductInput, Product } from '../__generated/graphql-types';

import { Types } from 'mongoose';
import { ProductRepositoryToken } from './repositories/product.repository.module';
import { ProductRepository } from './repositories/products.repository';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(ProductRepositoryToken)
    private products: ProductRepository
  ) {}

  public async listOfProducts(): Promise<Array<Product>> {
    return await this.products.list();
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
