import Decimal from 'decimal.js';
import { Types } from 'mongoose';
import { Node } from './common';

// Services consumes this types
export enum StatusType {
  ACTIVE = 'ACTIVE',
  SOLD_OUT = 'SOLD_OUT',
  INACTIVE = 'INACTIVE',
  DRAFT = 'DRAFT',
}

export enum ReservationType {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
}

export enum CategoryType {
  BEVERAGES = 'BEVERAGES',
  CANNED = 'CANNED',
  INSTANT = 'INSTANT',
  RICE = 'RICE',
  ESSENTIALS = 'ESSENTIALS',
  SNACKS = 'SNACKS',
  PERSONAL_CARE = 'PERSONAL_CARE',
  HOUSEHOLD_ITEMS = 'HOUSEHOLD_ITEMS',
  SWEETS = 'SWEETS',
  HEALTH_WELLNESS = 'HEALTH_WELLNESS',
  DAILY_DISHES = 'DAILY_DISHES',
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
  _id: Types.ObjectId;
  thumbnail: string;
  name: string;
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
  sold?: number;
  vouchers?: Voucher[];
  dateAdded?: Date;
};
