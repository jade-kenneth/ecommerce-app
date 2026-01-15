
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

import { ObjectId  as _ObjectId} from '../../libs/object-id'
import { Decimal as _Decimal } from 'decimal.js'

export enum AccountType {
    ADMIN = "ADMIN",
    MEMBER = "MEMBER"
}

export enum CartStatus {
    ACTIVE = "ACTIVE",
    CHECKED_OUT = "CHECKED_OUT"
}

export enum ShippingType {
    STANDARD = "STANDARD",
    EXPRESS = "EXPRESS",
    SAME_DAY = "SAME_DAY"
}

export enum PaymentMethodType {
    GCASH = "GCASH",
    CARD = "CARD",
    BANK_TRANSFER = "BANK_TRANSFER",
    CASH_ON_DELIVERY = "CASH_ON_DELIVERY"
}

export enum OrderStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    SHIPPED = "SHIPPED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}

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

export interface CreateAccountInput {
    _id: ObjectId;
    emailAddress: string;
    password: string;
    mobileNumber?: Nullable<string>;
}

export interface AddToCartInput {
    productId: ObjectId;
    quantity: number;
}

export interface UpdateCartItemInput {
    productId: ObjectId;
    quantity: number;
}

export interface CheckoutInput {
    shippingOptionId: string;
    paymentMethodId: string;
}

export interface CreateConfigInput {
    _id: ObjectId;
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

export interface Account {
    _id: ObjectId;
    emailAddress: string;
    role: string;
}

export interface IMutation {
    createAdminAccount(input: CreateAccountInput): Nullable<boolean> | Promise<Nullable<boolean>>;
    createMemberAccount(input: CreateAccountInput): Nullable<boolean> | Promise<Nullable<boolean>>;
    addToCart(input: AddToCartInput): Nullable<boolean> | Promise<Nullable<boolean>>;
    updateCartItem(input: UpdateCartItemInput): Cart | Promise<Cart>;
    removeFromCart(productId: ObjectId): Cart | Promise<Cart>;
    clearCart(): Cart | Promise<Cart>;
    checkout(input: CheckoutInput): Order | Promise<Order>;
    createConfig(input: CreateConfigInput): Nullable<boolean> | Promise<Nullable<boolean>>;
    updateConfig(input: UpdateConfigInput): Nullable<boolean> | Promise<Nullable<boolean>>;
    uploadFile(file: Upload): Nullable<string> | Promise<Nullable<string>>;
    createProduct(input: CreateProductInput): Nullable<boolean> | Promise<Nullable<boolean>>;
    updateProduct(input: UpdateProductInput): Nullable<boolean> | Promise<Nullable<boolean>>;
    deleteProduct(input: DeleteProductInput): Nullable<boolean> | Promise<Nullable<boolean>>;
}

export interface IQuery {
    memberAccounts(): Account[] | Promise<Account[]>;
    self(): Nullable<Account> | Promise<Nullable<Account>>;
    carts(): Cart[] | Promise<Cart[]>;
    shippingOptions(): ShippingOption[] | Promise<ShippingOption[]>;
    paymentMethods(): PaymentMethod[] | Promise<PaymentMethod[]>;
    myOrders(): Order[] | Promise<Order[]>;
    order(id: ObjectId): Nullable<Order> | Promise<Nullable<Order>>;
    config(): Config | Promise<Config>;
    products(first?: Nullable<number>, after?: Nullable<Cursor>, filter?: Nullable<ProductsFilterInput>): Connection | Promise<Connection>;
    highPointProducts(first?: Nullable<number>, after?: Nullable<Cursor>, filter?: Nullable<ProductsFilterInput>): Connection | Promise<Connection>;
}

export interface CartItem {
    product: Product;
    quantity: number;
    unitPrice: string;
    totalPrice: string;
}

export interface PaymentMethod {
    _id: ObjectId;
    type: PaymentMethodType;
    label: string;
    description?: Nullable<string>;
    isActive: boolean;
}

export interface ShippingOption {
    _id: ObjectId;
    type: ShippingType;
    label: string;
    description?: Nullable<string>;
    fee: string;
    estimatedDays?: Nullable<string>;
}

export interface Cart {
    _id: ObjectId;
    items?: Nullable<Nullable<CartItem>[]>;
    ownerId: ObjectId;
    subtotal: string;
    tax: string;
    shippingFee: string;
    total: string;
    status: CartStatus;
    createdAt: string;
    updatedAt: string;
}

export interface Order {
    _id: ObjectId;
    items?: Nullable<Nullable<CartItem>[]>;
    ownerId: ObjectId;
    shippingOption: ShippingOption;
    paymentMethod: PaymentMethod;
    subtotal: string;
    tax: string;
    shippingFee: string;
    total: string;
    status: OrderStatus;
    createdAt: string;
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

export interface Config {
    _id: ObjectId;
    highPointsThreshold?: Nullable<number>;
    topSoldThreshold?: Nullable<number>;
    carouselItems: string[];
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
