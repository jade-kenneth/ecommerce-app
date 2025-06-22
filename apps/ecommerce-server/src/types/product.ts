import Decimal from 'decimal.js';
import { Node } from './common';
export enum StatusType {
  AVAILABLE = 'AVAILABLE',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

export enum ReservationType {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
}

export enum CategoryType {
  FRUIT = 'FRUIT',
  DAIRY = 'DAIRY',
  VEGETABLES = 'VEGETABLES',
  FISH = 'FISH',
  SWEETS = 'SWEETS',
}
export interface KeyValuePair {
  key: string;
  value: string;
}
export interface Voucher {
  date?: Date;
  name?: string;
  description?: string;
  code?: string;
  value?: number;
}
export type Product = Node & {
  thumbnail?: string;
  name?: string;
  price?: number;
  status?: StatusType;
  discount?: number;
  points?: Decimal;
  category?: CategoryType[];
  pieces?: number;
  type?: CategoryType;
  description?: string;
  reservation?: ReservationType;
  flashSale?: boolean;
  variations?: KeyValuePair[];
  sold?: number;
  vouchers?: Voucher[];
  dateAdded?: Date;
};
