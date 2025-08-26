
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

import { ObjectId  as _ObjectId} from '@ecommerce/object-id'
import { Decimal as _Decimal } from 'decimal.js'

export enum StatusType {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    SOLD_OUT = "SOLD_OUT",
    DRAFT = "DRAFT"
}

export enum ReservationType {
    AVAILABLE = "AVAILABLE",
    UNAVAILABLE = "UNAVAILABLE"
}

export enum CategoryType {
    BEVERAGES = "BEVERAGES",
    CANNED = "CANNED",
    INSTANT = "INSTANT",
    RICE = "RICE",
    ESSENTIALS = "ESSENTIALS",
    SNACKS = "SNACKS",
    PERSONAL_CARE = "PERSONAL_CARE",
    HOUSEHOLD_ITEMS = "HOUSEHOLD_ITEMS",
    SWEETS = "SWEETS",
    HEALTH_WELLNESS = "HEALTH_WELLNESS",
    DAILY_DISHES = "DAILY_DISHES"
}

export interface CreateConfigInput {
    highPointsThreshold: number;
    topSoldThreshold: number;
    carouselItems: string[];
}

export interface UpdateConfigInput {
    _id: ObjectId;
    highPointsThreshold: number;
    topSoldThreshold: number;
    carouselItems: string[];
}

export interface ProductsStatusFilterInput {
    equal?: Nullable<StatusType>;
    in?: Nullable<StatusType[]>;
    notIn?: Nullable<StatusType[]>;
    notEqual?: Nullable<StatusType>;
}

export interface ProductsCategoryFilterInput {
    equal?: Nullable<CategoryType>;
    in?: Nullable<CategoryType[]>;
    notIn?: Nullable<CategoryType[]>;
    notEqual?: Nullable<CategoryType>;
}

export interface ProductsFilterInput {
    status?: Nullable<ProductsStatusFilterInput>;
    category?: Nullable<ProductsCategoryFilterInput>;
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
    _id: ObjectId;
    thumbnail: string;
    name: string;
    price: number;
    status: StatusType;
    discount?: Nullable<number>;
    points: Decimal;
    category: CategoryType[];
    pieces: number;
    type?: Nullable<CategoryType>;
    description?: Nullable<string>;
    reservation?: Nullable<ReservationType>;
    flashSale?: Nullable<boolean>;
    variations?: Nullable<KeyValuePairInput[]>;
    sold?: Nullable<number>;
    vouchers?: Nullable<VoucherInput[]>;
    dateAdded?: Nullable<DateTime>;
}

export interface UpdateProductInput {
    _id: ObjectId;
    thumbnail: string;
    name: string;
    price: number;
    status: StatusType;
    discount?: Nullable<number>;
    points: Decimal;
    category: CategoryType[];
    pieces: number;
    type?: Nullable<CategoryType>;
    description?: Nullable<string>;
    reservation?: Nullable<ReservationType>;
    flashSale?: Nullable<boolean>;
    variations?: Nullable<KeyValuePairInput[]>;
    vouchers?: Nullable<VoucherInput[]>;
    dateAdded?: Nullable<DateTime>;
}

export interface DeleteProductInput {
    _id: ObjectId;
}

export interface Node {
    _id: ObjectId;
}

export interface Config {
    highPointsThreshold?: Nullable<number>;
    topSoldThreshold?: Nullable<number>;
    carouselItems?: Nullable<Nullable<string>[]>;
}

export interface Error {
    message: string;
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

export interface Connection {
    totalCount: number;
    edges: Edge[];
    pageInfo: PageInfo;
}

export interface PageInfo {
    hasNextPage: boolean;
    endCursor?: Nullable<Cursor>;
}

export interface Edge {
    cursor: Cursor;
    node: Node;
}

export interface IQuery {
    config(): Config | Promise<Config>;
    products(first?: Nullable<number>, after?: Nullable<Cursor>, filter?: Nullable<ProductsFilterInput>): Connection | Promise<Connection>;
}

export interface IMutation {
    createConfig(input: CreateConfigInput): Nullable<boolean> | Promise<Nullable<boolean>>;
    updateConfig(input: UpdateConfigInput): Nullable<boolean> | Promise<Nullable<boolean>>;
    uploadFile(file: Upload): Nullable<string> | Promise<Nullable<string>>;
    createProduct(input: CreateProductInput): Nullable<boolean> | Promise<Nullable<boolean>>;
    updateProduct(input: UpdateProductInput): Nullable<boolean> | Promise<Nullable<boolean>>;
    deleteProduct(input: DeleteProductInput): Nullable<boolean> | Promise<Nullable<boolean>>;
}

export interface FileSizeTooBigError extends Error {
    message: string;
}

export interface FileFormatNotSupportedError extends Error {
    message: string;
}

export interface FileNameTooLongError extends Error {
    message: string;
}

export interface Product extends Node {
    _id: ObjectId;
    thumbnail: string;
    name: string;
    price: number;
    status: StatusType;
    discount: number;
    points: Decimal;
    category?: Nullable<CategoryType[]>;
    pieces: number;
    type?: Nullable<CategoryType>;
    description?: Nullable<string>;
    reservation?: Nullable<ReservationType>;
    flashSale?: Nullable<boolean>;
    variations?: Nullable<KeyValuePair[]>;
    sold?: Nullable<number>;
    vouchers?: Nullable<Voucher[]>;
    dateAdded?: Nullable<DateTime>;
}

export type JSON = Record<string, any>;
export type ObjectId = _ObjectId;
export type DateTime = Date;
export type Decimal = _Decimal;
export type Cursor = unknown;
export type Upload = unknown;
type Nullable<T> = T | null;
