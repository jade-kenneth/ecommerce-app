import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type KeyValuePairDocument = KeyValuePair & Document;

@Schema()
export class KeyValuePair {
  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  value: boolean;
}

export const KeyValuePairSchema = SchemaFactory.createForClass(KeyValuePair);
