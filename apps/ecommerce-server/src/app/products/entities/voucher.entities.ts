import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VoucherDocument = Voucher & Document;

@Schema()
export class Voucher {
  @Prop({ required: true, type: Date })
  date: Date;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  description: string;
  @Prop({ required: true })
  code: string;
  @Prop({ required: true })
  value: number;
}

export const VoucherSchema = SchemaFactory.createForClass(Voucher);
