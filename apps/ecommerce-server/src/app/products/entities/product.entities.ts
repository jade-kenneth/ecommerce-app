import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  CategoryType,
  KeyValuePair,
  ReservationType,
  StatusType,
  Voucher,
} from '../../__generated/graphql-types';
import { KeyValuePairSchema } from './key-value.entities';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  thumbnail: string;
  @Prop({ required: true, enum: StatusType })
  status: StatusType;
  @Prop({ required: true })
  discount: number;
  @Prop({ required: true })
  points: number;
  @Prop({ required: true, enum: CategoryType })
  category: CategoryType;
  pieces: number;
  @Prop({ required: true, enum: CategoryType })
  type: CategoryType;
  description: string;
  @Prop({ required: true, enum: ReservationType })
  reservation: ReservationType;
  flashSale: boolean;
  @Prop({ type: [KeyValuePairSchema], default: [] })
  variations: KeyValuePair[];
  sold: number;
  @Prop({ type: [KeyValuePairSchema], default: [] })
  vouchers: Voucher[];
  @Prop({ required: true, type: Date })
  dateAdded: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
