
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

import { Types  } from 'mongoose'
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
    shippingOptionId?: Nullable<ObjectId>;
    paymentMethodId?: Nullable<ObjectId>;
}

export interface RemoveFromCartInput {
    productId: ObjectId;
    quantity: number;
}

export interface ProductByIdsInput {
    ids: ObjectId[];
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

export interface LicenseInput {
    _id: ObjectId;
    code: string;
    expirationDate: string;
}

export interface CreateGcashPaymentInput {
    amount: Decimal;
    referenceId?: Nullable<string>;
    successUrl: string;
    failureUrl: string;
    description?: Nullable<string>;
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

export interface IdFilterInput {
    equal?: Nullable<string>;
    in?: Nullable<string[]>;
    notIn?: Nullable<string[]>;
    notEqual?: Nullable<string>;
}

export interface ProductsFilterInput {
    status?: Nullable<ProductsStatusFilterInput>;
    category?: Nullable<ProductsCategoryFilterInput>;
    _id?: Nullable<IdFilterInput>;
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
    removeFromCart(input: RemoveFromCartInput): Cart | Promise<Cart>;
    clearCart(): Cart | Promise<Cart>;
    checkout(input: CheckoutInput): Order | Promise<Order>;
    createConfig(input: CreateConfigInput): Nullable<boolean> | Promise<Nullable<boolean>>;
    updateConfig(input: UpdateConfigInput): Nullable<boolean> | Promise<Nullable<boolean>>;
    uploadFile(file: Upload): Nullable<string> | Promise<Nullable<string>>;
    createLicense(input: LicenseInput): Nullable<boolean> | Promise<Nullable<boolean>>;
    createGcashPayment(input?: Nullable<CreateGcashPaymentInput>): Nullable<PaymentRequestResponse> | Promise<Nullable<PaymentRequestResponse>>;
    createProduct(input: CreateProductInput): Nullable<boolean> | Promise<Nullable<boolean>>;
    updateProduct(input: UpdateProductInput): Nullable<boolean> | Promise<Nullable<boolean>>;
    deleteProduct(input: DeleteProductInput): Nullable<boolean> | Promise<Nullable<boolean>>;
}

export interface IQuery {
    memberAccounts(): Account[] | Promise<Account[]>;
    self(): Nullable<Account> | Promise<Nullable<Account>>;
    cart(id: ObjectId): Cart | Promise<Cart>;
    shippingOptions(): ShippingOption[] | Promise<ShippingOption[]>;
    paymentMethods(): PaymentMethod[] | Promise<PaymentMethod[]>;
    myOrders(): Order[] | Promise<Order[]>;
    order(id: ObjectId): Nullable<Order> | Promise<Nullable<Order>>;
    productByIds(ids?: Nullable<ProductByIdsInput>): CartProductDetails | Promise<CartProductDetails>;
    config(): Config | Promise<Config>;
    products(first?: Nullable<number>, after?: Nullable<Cursor>, filter?: Nullable<ProductsFilterInput>): Connection | Promise<Connection>;
    highPointProducts(first?: Nullable<number>, after?: Nullable<Cursor>, filter?: Nullable<ProductsFilterInput>): Connection | Promise<Connection>;
}

export interface CartItem {
    productId: ObjectId;
    quantity: number;
    unitPrice?: Nullable<string>;
    totalPrice?: Nullable<string>;
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
    items: CartItem[];
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
    shippingOption: ShippingOption;
    paymentMethod: PaymentMethod;
    subtotal: string;
    tax: string;
    shippingFee: string;
    total: string;
    status: OrderStatus;
    createdAt: string;
}

export interface CartProductDetails {
    thumbnail: string;
    name: string;
    price: Decimal;
    productId: ObjectId;
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

export interface License {
    _id: ObjectId;
    code: string;
    expirationDate: string;
}

export interface CheckoutUrl {
    checkout_url?: Nullable<string>;
}

export interface ChannelProperties {
    success_return_url?: Nullable<string>;
    failure_return_url?: Nullable<string>;
}

export interface PaymentAction {
    type?: Nullable<string>;
    descriptor?: Nullable<string>;
    value?: Nullable<string>;
}

export interface PaymentRequestResponse {
    payment_request_id?: Nullable<string>;
    country?: Nullable<string>;
    currency?: Nullable<string>;
    business_id?: Nullable<string>;
    reference_id?: Nullable<string>;
    description?: Nullable<string>;
    created?: Nullable<string>;
    updated?: Nullable<string>;
    status?: Nullable<string>;
    capture_method?: Nullable<string>;
    channel_code?: Nullable<string>;
    request_amount?: Nullable<Decimal>;
    channel_properties?: Nullable<ChannelProperties>;
    type?: Nullable<string>;
    actions?: Nullable<Nullable<PaymentAction>[]>;
}

export interface Product extends Node {
    _id: ObjectId;
    nodeType: string;
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
export type ObjectId = Types.ObjectId;
export type DateTime = Date;
export type Decimal = _Decimal;
export type Cursor = unknown;
export type Upload = unknown;
type Nullable<T> = T | null;
