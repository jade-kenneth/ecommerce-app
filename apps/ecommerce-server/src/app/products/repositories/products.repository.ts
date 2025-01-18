import { Connection, Types } from 'mongoose';

import { MongooseRepository } from '../../../libs/mongoose-repository';
import { Repository } from '../../../libs/repository';
import {
  CategoryType,
  DateTime,
  KeyValuePair,
  ReservationType,
  StatusType,
  Voucher,
} from '../../__generated/graphql-types';

export type Product = {
  _id: Types.ObjectId;
  thumbnail?: string;
  name?: string;
  price?: number;
  status?: StatusType;
  discount?: number;
  points?: number;
  category?: CategoryType;
  pieces?: number;
  type?: CategoryType;
  description?: string;
  reservation?: ReservationType;
  flashSale?: boolean;
  variations?: KeyValuePair[];
  sold?: number;
  vouchers?: Voucher[];
  dateAdded?: DateTime;
};

export type ProductRepository = Repository<Product>;
export async function ProductRepositoryFactory(
  connection: Connection
): Promise<ProductRepository> {
  return new MongooseRepository<Product>(
    connection,
    'Products',
    {
      _id: Types.ObjectId,
      name: String,
      thumbnail: String,
      price: Number,
      status: String,
      discount: Number,
      points: Number,
      category: String,
      pieces: Number,
      type: String,
      description: String,
      reservation: String,
      flashSale: Boolean,
      variations: [Buffer],
      sold: Number,
      vouchers: [Buffer],
      dateAdded: Date,
    },
    []
  );
}
