import { Inject, Injectable } from '@nestjs/common';
import {
  CreateProductInput,
  UpdateProductInput,
} from '../__generated/graphql-types';

import { Product } from '../../types/product';

import { ObjectType } from '@ecommerce-app/object-shared';
import { ObjectId } from '@ecommerce/object-id';
import { Connection, Filter } from '../../libs/repository';
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
    first?: number;
    after?: string;
    filter: Filter<Product>;
  }): Promise<Connection<Product>> {
    const { filter = {}, after, first } = params;

    const data = await this.products
      .list(filter)
      .connection({ after, first, order: 'desc' });

    return data;
  }
  public async createProduct(params: CreateProductInput) {
    await this.products
      .create({
        ...params,
        cursor: generateCursor(
          new Date(),
          ObjectId.generate(ObjectType.Product)
        ),
      })
      .catch(async (err) => {
        console.log(err, 'error');
        return;
      });
  }

  public async updateProduct(params: UpdateProductInput) {
    const { _id, ...updateData } = params;

    await this.products
      .update(_id, {
        ...updateData,
      })
      .catch(async (err) => {
        console.log(err, 'error');
        return;
      });
  }
}
