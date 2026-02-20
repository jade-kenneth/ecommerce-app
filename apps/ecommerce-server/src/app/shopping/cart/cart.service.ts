import { Inject, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { Filter } from '../../../libs/repository';
import { ObjectType } from '../../../types/common';
import { Tokens } from '../../../types/tokens';
import {
  CartStatus,
  UpdateCartItemInput,
} from '../../__generated/graphql-types';
import { ProductsService } from '../../products/products.service';
import { Cart, CartRepository } from './repositories/cart.repository';

@Injectable()
export class CartService {
  constructor(
    @Inject(Tokens.CartsToken)
    private readonly carts: CartRepository,
    private readonly products: ProductsService,
  ) {}

  public async getCart(params: {
    first?: number;
    after?: string;
    filter: Filter<Cart>;
  }): Promise<Cart[]> {
    const { filter = {} } = params;

    return this.carts.list(filter).collect();
  }

  public async updateCartItem({
    params,
  }: {
    params: UpdateCartItemInput & { _id: string };
  }) {
    const timestamp = new Date();
    const product = await this.products.findProduct(
      new Types.ObjectId(params.productId),
    );
    const cart = await this.carts.find(new Types.ObjectId(params._id));

    if (!product) {
      throw new Error('Product not found');
    }

    if (!cart?.items.length) {
      const newCart: Cart = {
        _id: new Types.ObjectId(params._id),
        createdAt: timestamp,
        items: [
          {
            productId: params.productId,
            quantity: params.quantity,
          },
        ],
        status: CartStatus.ACTIVE,
        updatedAt: timestamp,
        nodeType: ObjectType.Cart,
      };

      await this.carts.create(newCart);

      return true;
    }

    const item = cart.items.find((cartItem) =>
      cartItem.productId.equals(params.productId),
    );

    if (item) {
      if (params.quantity === 1) {
        item.quantity += params.quantity;
      } else if (params.quantity > 1) {
        item.quantity = params.quantity;
      } else if (params.quantity === -1) {
        item.quantity -= 1;
      }
    } else {
      cart.items = [
        ...cart.items,
        {
          productId: params.productId,
          quantity: params.quantity,
        },
      ];
    }

    await this.carts.update(new Types.ObjectId(params._id), {
      items: cart.items,
      updatedAt: timestamp,
    });

    return true;
  }

  public async removeFromCart(params: {
    _id: string;
    productId: Types.ObjectId;
  }) {
    const timestamp = new Date();

    const cart = await this.carts.find(new Types.ObjectId(params._id));

    if (!cart) {
      throw new Error('Cart not found');
    }

    const itemIndex = cart.items.findIndex((item) =>
      item.productId.equals(params.productId),
    );

    if (itemIndex === -1) {
      throw new Error('Product not in cart');
    }

    cart.items.splice(itemIndex, 1);

    await this.carts.update(new Types.ObjectId(params._id), {
      items: cart.items,
      updatedAt: timestamp,
    });

    return true;
  }

  public async findCart(id: Types.ObjectId) {
    return this.carts.find(id);
  }
}
