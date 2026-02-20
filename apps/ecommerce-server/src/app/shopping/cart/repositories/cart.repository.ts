import { Connection, Types } from 'mongoose';

import { MongooseRepository } from '../../../../libs/mongoose-repository';
import { Repository } from '../../../../libs/repository';
import { Node } from '../../../../types/common';
import { CartItem, CartStatus } from '../../../__generated/graphql-types';

export type Cart = Node & {
  items: CartItem[];
  subtotal?: string;
  tax?: string;
  shippingFee?: string;
  total?: string;
  status: CartStatus;
  createdAt: Date;
  updatedAt: Date;
};

const CartItemSchema = {
  productId: Types.ObjectId,
  quantity: Number,
  unitPrice: Number,
  totalPrice: Number,
};

export type CartRepository = Repository<Cart>;

export async function CartRepositoryFactory(
  connection: Connection,
): Promise<CartRepository> {
  return new MongooseRepository<Cart>(
    connection,
    'Carts',
    {
      _id: Types.ObjectId,
      items: [CartItemSchema],
      subtotal: String,
      tax: String,
      shippingFee: String,
      total: String,
      status: String,
      createdAt: Date,
      updatedAt: Date,
    },
    [],
  );
}
