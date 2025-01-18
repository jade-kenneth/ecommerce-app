/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

import { Types } from 'mongoose';

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

export interface Node {
  id: ObjectId;
}

export interface Voucher {
  date?: Nullable<DateTime>;
  name?: Nullable<string>;
  description?: Nullable<string>;
  code?: Nullable<string>;
  value?: Nullable<number>;
}

export interface KeyValuePair {
  key: string;
  value: string;
}

export interface Product extends Node {
  id: ObjectId;
  thumbnail: string;
  name: string;
  price: number;
  status?: Nullable<StatusType>;
  discount: number;
  points?: Nullable<number>;
  category?: Nullable<CategoryType>;
  pieces?: Nullable<number>;
  type?: Nullable<CategoryType>;
  description: string;
  reservation?: Nullable<ReservationType>;
  flashSale?: Nullable<boolean>;
  variations: KeyValuePair[];
  sold?: Nullable<number>;
  vouchers?: Nullable<Voucher[]>;
  dateAdded?: Nullable<DateTime>;
}

export interface IQuery {
  products(): Nullable<Product[]> | Promise<Nullable<Product[]>>;
}

export type JSON = Record<string, any>;
export type ObjectId = Types.ObjectId;
export type DateTime = Date;
type Nullable<T> = T | null;
