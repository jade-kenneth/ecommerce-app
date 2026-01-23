import { Inject, Injectable } from '@nestjs/common';
import { AddToCartInput, CartStatus } from '../__generated/graphql-types';

import { Types } from 'mongoose';
import { Filter } from '../../libs/repository';
import { ObjectType } from '../../types/common';
import { Tokens } from '../../types/tokens';
import { ProductsService } from '../products/products.service';
import { Cart, CartRepository } from './repositories/carts.repository';

@Injectable()
export class CartsService {
  constructor(
    @Inject(Tokens.CartsToken)
    private readonly carts: CartRepository,
    private readonly products: ProductsService
  ) {}

  public async getCart(params: {
    first?: number;
    after?: string;
    filter: Filter<Cart>;
  }): Promise<Cart[]> {
    const { filter = {}, after, first } = params;

    const data = await this.carts.list(filter).collect();

    return data;
  }
  public async addToCart({
    params,
  }: {
    params: AddToCartInput & { _id: string };
  }) {
    const timestamp = new Date();
    const product = await this.products.findProduct(
      new Types.ObjectId(params.productId)
    );
    const cart = await this.carts.find(new Types.ObjectId(params._id));

    if (!cart) {
      await this.carts.create({
        _id: new Types.ObjectId(params._id),
        createdAt: timestamp,
        items: [
          {
            productId: params.productId,
            quantity: params.quantity,
            totalPrice: '0',
            unitPrice: '0',
          },
        ],
        shippingFee: '0',
        status: CartStatus.ACTIVE,
        subtotal: '0',
        tax: '0',
        total: '0',
        updatedAt: timestamp,
        nodeType: ObjectType.Cart,
      });
    }

    if (!product) throw new Error('Product not found');

    if (!cart?.items.length) return;

    const item = cart.items.find((item) =>
      item.productId.equals(params.productId)
    );

    if (item) {
      item.quantity += params.quantity;
      item.totalPrice = (item.quantity * Number(item.unitPrice)).toString();

      await recalcCart(cart);

      const updatedItems = cart.items.map((cartItem) =>
        cartItem.productId.equals(item.productId) ? item : cartItem
      );

      await this.carts.update(new Types.ObjectId(params._id), {
        items: updatedItems,
      });
    } else {
      await this.carts.update(new Types.ObjectId(params._id), {
        items: [
          ...cart.items,
          {
            productId: params.productId,
            quantity: params.quantity,
            totalPrice: '0',
            unitPrice: '0',
          },
        ],
      });
    }

    // await this.carts.create({ ...params }).catch(async (err) => {
    //   console.log(err, 'error');
    //   return;
    // });
  }

  public async findCart(id: Types.ObjectId) {
    return this.carts.find(id);
  }

  // public async updateProduct(params: UpdateProductInput) {
  //   const { _id, ...updateData } = params;

  //   await this.products
  //     .update(_id, {
  //       ...updateData,
  //     })
  //     .catch(async (err) => {
  //       console.log(err, 'error');
  //       return;
  //     });
  // }
  // public async deleteProduct(params: DeleteProductInput) {
  //   try {
  //     await this.carts.delete(params._id);
  //   } catch (error) {
  //     console.error('Error deleting product:', error);
  //   }
  // }

  // public async getHighPointsProducts(params: {
  //   first?: number;
  //   after?: string;
  //   filter: Filter<Product>;
  // }): Promise<Connection<Product>> {
  //   const { filter = {}, after, first } = params;
  //   const highPoint = this.configService.getString('HIGHPOINT_THRESHOLD') ?? 1;
  //   const data = await this.products
  //     .list({
  //       ...filter,
  //       points: {
  //         greaterThanOrEqual: new Decimal(highPoint),
  //       },
  //     })
  //     .connection({ after, first, order: 'desc' });

  //   return data;
  // }
}
export async function recalcCart(cart: Cart) {
  const VAT_RATE = 0.12; //TODO configure this as config
  // 1️⃣ Subtotal (sum of all item totals)
  cart.subtotal = cart?.items
    .reduce(
      (sum, item) =>
        Number(sum) + Number(item.unitPrice) * Number(item.quantity),
      0
    )
    .toString();

  // 2️⃣ VAT (12%)
  cart.tax = Number((Number(cart.subtotal) * VAT_RATE).toFixed(2)).toString();

  // 3️⃣ Total
  cart.total = Number(
    (
      Number(cart.subtotal) +
      Number(cart.tax) +
      Number(cart.shippingFee)
    ).toFixed(2)
  ).toString();
}
