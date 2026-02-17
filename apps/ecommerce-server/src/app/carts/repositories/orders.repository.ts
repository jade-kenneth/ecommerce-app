import { Connection, Schema, Types } from 'mongoose';

import { MongooseRepository } from '../../../libs/mongoose-repository';
import { Repository } from '../../../libs/repository';
import {
  CartItem,
  OrderStatus,
  PaymentMethod,
  ShippingOption,
} from '../../__generated/graphql-types';

export type Order = {
  _id: Types.ObjectId;
  accountId: Types.ObjectId;
  items: CartItem[];
  shippingOption: ShippingOption;
  paymentMethod: PaymentMethod;
  paymentRequestId?: string;
  subtotal: string;
  tax: string;
  shippingFee: string;
  total: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  gaClientId: string;
};

const CartItemSchema = {
  productId: Types.ObjectId,
  quantity: Number,
  unitPrice: Number,
  totalPrice: Number,
};

const ShippingOptionSchema = Schema.Types.Mixed;
const PaymentMethodSchema = Schema.Types.Mixed;

export type OrdersRepository = Repository<Order>;

export async function OrdersRepositoryFactory(
  connection: Connection,
): Promise<OrdersRepository> {
  return new MongooseRepository<Order>(
    connection,
    'Orders',
    {
      accountId: Types.ObjectId,
      items: [CartItemSchema],
      gaClientId: String,
      shippingOption: ShippingOptionSchema,
      paymentMethod: PaymentMethodSchema,
      paymentRequestId: String,
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
