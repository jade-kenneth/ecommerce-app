import { Connection } from 'mongoose';

import { ObjectId } from 'apps/ecommerce-server/src/libs/object-id';
import { MongooseRepository } from '../../../libs/mongoose-repository';
import { Repository } from '../../../libs/repository';
import { CartItem, CartStatus } from '../../__generated/graphql-types';

export type Cart = {
  _id: ObjectId;
  items: CartItem[];
  subtotal: String;
  tax: String;
  shippingFee: String;
  total: String;
  status: CartStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type CartRepository = Repository<Cart>;

export async function CartRepositoryFactory(
  connection: Connection
): Promise<CartRepository> {
  return new MongooseRepository<Cart>(
    connection,
    'Carts',
    {
      _id: ObjectId,
      items: [Buffer],
      ownerId: ObjectId,
      subtotal: String,
      tax: String,
      shippingFee: String,
      total: String,
      status: String,
      createdAt: Date,
      updatedAt: Date,
    },
    []
  );
}
