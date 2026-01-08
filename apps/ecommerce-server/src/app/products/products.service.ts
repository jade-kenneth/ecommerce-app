import { Inject, Injectable } from '@nestjs/common';
import {
  CreateProductInput,
  DeleteProductInput,
  UpdateProductInput,
} from '../__generated/graphql-types';

import { Product } from '../../types/product';

import { Connection, Filter } from '../../libs/repository';
import { generateCursor } from '../../util/generate-cursor';

import Decimal from 'decimal.js';
import { ObjectId } from '../../libs/object-id';

import { ObjectType } from '../../libs/object-shared';
import { Tokens } from '../../types/tokens';
import { ConfigService } from '../config/config.service';
import { ProductRepository } from './repositories/products.repository';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(Tokens.ProductRepositoryToken)
    private products: ProductRepository,
    private configService: ConfigService
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
  public async deleteProduct(params: DeleteProductInput) {
    try {
      await this.products.delete(params._id);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }

  public async getHighPointsProducts(params: {
    first?: number;
    after?: string;
    filter: Filter<Product>;
  }): Promise<Connection<Product>> {
    const { filter = {}, after, first } = params;
    const highPoint = this.configService.getString('HIGHPOINT_THRESHOLD') ?? 1;
    const data = await this.products
      .list({
        ...filter,
        points: {
          greaterThanOrEqual: new Decimal(highPoint),
        },
      })
      .connection({ after, first, order: 'desc' });

    return data;
  }
}
