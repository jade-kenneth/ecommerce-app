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

export interface KeyValuePairInput {
  key: string;
  value: string;
}

export interface VoucherInput {
  date?: Nullable<DateTime>;
  name?: Nullable<string>;
  description?: Nullable<string>;
  code?: Nullable<string>;
  value?: Nullable<number>;
}

export interface CreateProductInput {
  thumbnail?: Nullable<string>;
  name?: Nullable<string>;
  price?: Nullable<number>;
  status?: Nullable<StatusType>;
  discount?: Nullable<number>;
  points?: Nullable<number>;
  category?: Nullable<CategoryType>;
  pieces?: Nullable<number>;
  type?: Nullable<CategoryType>;
  description?: Nullable<string>;
  reservation?: Nullable<ReservationType>;
  flashSale?: Nullable<boolean>;
  variations?: Nullable<KeyValuePairInput[]>;
  sold?: Nullable<number>;
  vouchers?: Nullable<VoucherInput[]>;
  dateAdded?: Nullable<DateTime>;
}

export interface Node {
  _id: ObjectId;
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
  _id: ObjectId;
  thumbnail?: Nullable<string>;
  name?: Nullable<string>;
  price?: Nullable<number>;
  status?: Nullable<StatusType>;
  discount?: Nullable<number>;
  points?: Nullable<number>;
  category?: Nullable<CategoryType>;
  pieces?: Nullable<number>;
  type?: Nullable<CategoryType>;
  description?: Nullable<string>;
  reservation?: Nullable<ReservationType>;
  flashSale?: Nullable<boolean>;
  variations?: Nullable<KeyValuePair[]>;
  sold?: Nullable<number>;
  vouchers?: Nullable<Voucher[]>;
  dateAdded?: Nullable<DateTime>;
}

export interface IQuery {
  products(): Nullable<Product[]> | Promise<Nullable<Product[]>>;
}

export interface IMutation {
  createProduct(
    input: CreateProductInput
  ): Nullable<Product> | Promise<Nullable<Product>>;
}

export type JSON = Record<string, any>;
export type ObjectId = Types.ObjectId;
export type DateTime = Date;
type Nullable<T> = T | null;
