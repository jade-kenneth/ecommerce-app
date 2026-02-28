import { Connection, Types } from 'mongoose';

import Decimal from 'decimal.js';
import { Decimal128 } from 'mongodb';
import { MongooseRepository } from '../../../libs/mongoose-repository';
import { Repository } from '../../../libs/repository';
import { Node } from '../../../types/common';
import {
  CategoryType,
  DateTime,
  KeyValuePair,
  ReservationType,
  StatusType,
  Voucher,
} from '../../__generated/graphql-types';

export type Product = Node & {
  _id: Types.ObjectId;
  name: string;
  thumbnail: string;
  price: number;
  status: StatusType;
  discount?: number;
  points: Decimal;
  category: CategoryType[];
  pieces: number;
  type?: CategoryType;
  description?: string;
  reservation?: ReservationType;
  flashSale?: boolean;
  variations?: KeyValuePair[];
  avgRating?: number;
  sold?: number;
  vouchers?: Voucher[];
  dateAdded?: DateTime;
  cursor?: Buffer;
};

export type ProductRepository = Repository<Product>;
export async function ProductRepositoryFactory(
  connection: Connection,
): Promise<ProductRepository> {
  return new MongooseRepository<Product>(
    connection,
    'Products',
    {
      _id: Types.ObjectId,
      name: String,
      nodeType: String,
      thumbnail: String,
      price: Number,
      status: String,
      discount: Number,
      points: Decimal128,
      category: [String],
      pieces: Number,
      type: String,
      description: String,
      reservation: String,
      flashSale: Boolean,
      avgRating: Number,
      variations: [Buffer],
      sold: Number,
      vouchers: [Buffer],
      dateAdded: Date,
      cursor: Buffer,
    },
    [],
  );
}
