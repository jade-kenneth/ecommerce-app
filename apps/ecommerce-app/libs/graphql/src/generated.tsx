/* eslint-disable */
// @ts-nocheck
// Generated file
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Cursor: { input: string; output: string };
  DateTime: { input: string | Date; output: string };
  Decimal: { input: string; output: string };
  JSON: { input: Record<string, any>; output: Record<string, any> };
  ObjectID: { input: string; output: string };
  Upload: { input: File; output: File };
};

export type Account = {
  __typename: 'Account';
  _id: Scalars['ObjectID']['output'];
  emailAddress: Scalars['String']['output'];
  googleDetails?: Maybe<GoogleDetails>;
  role: Scalars['String']['output'];
};

export enum AccountType {
  Admin = 'ADMIN',
  Member = 'MEMBER',
}

export type Cart = {
  __typename: 'Cart';
  _id: Scalars['ObjectID']['output'];
  createdAt: Scalars['String']['output'];
  items: Array<CartItem>;
  shippingFee?: Maybe<Scalars['String']['output']>;
  status: CartStatus;
  subtotal?: Maybe<Scalars['String']['output']>;
  tax?: Maybe<Scalars['String']['output']>;
  total?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
};

export type CartItem = {
  __typename: 'CartItem';
  productId: Scalars['ObjectID']['output'];
  quantity: Scalars['Int']['output'];
  totalPrice?: Maybe<Scalars['String']['output']>;
  unitPrice?: Maybe<Scalars['String']['output']>;
};

export type CartProductDetails = {
  __typename: 'CartProductDetails';
  name: Scalars['String']['output'];
  price: Scalars['Decimal']['output'];
  productId: Scalars['ObjectID']['output'];
  thumbnail: Scalars['String']['output'];
};

export enum CartStatus {
  Active = 'ACTIVE',
  CheckedOut = 'CHECKED_OUT',
}

export enum CategoryType {
  Beverages = 'BEVERAGES',
  Canned = 'CANNED',
  DailyDishes = 'DAILY_DISHES',
  Essentials = 'ESSENTIALS',
  HealthWellness = 'HEALTH_WELLNESS',
  HouseholdItems = 'HOUSEHOLD_ITEMS',
  Instant = 'INSTANT',
  PersonalCare = 'PERSONAL_CARE',
  Rice = 'RICE',
  Snacks = 'SNACKS',
  Sweets = 'SWEETS',
}

export type ChannelProperties = {
  __typename: 'ChannelProperties';
  failure_return_url?: Maybe<Scalars['String']['output']>;
  success_return_url?: Maybe<Scalars['String']['output']>;
};

export type CheckoutInput = {
  clientId?: InputMaybe<Scalars['String']['input']>;
  paymentMethodId?: InputMaybe<Scalars['ObjectID']['input']>;
  shippingOptionId?: InputMaybe<Scalars['ObjectID']['input']>;
};

export type CheckoutUrl = {
  __typename: 'CheckoutUrl';
  checkout_url?: Maybe<Scalars['String']['output']>;
};

export type Config = {
  __typename: 'Config';
  _id: Scalars['ObjectID']['output'];
  carouselItems: Array<Scalars['String']['output']>;
  highPointsThreshold?: Maybe<Scalars['Int']['output']>;
  topSoldThreshold?: Maybe<Scalars['Int']['output']>;
};

export type Connection = {
  __typename: 'Connection';
  edges: Array<Edge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type CreateAccountInput = {
  _id: Scalars['ObjectID']['input'];
  emailAddress: Scalars['String']['input'];
  mobileNumber?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
};

export type CreateConfigInput = {
  _id: Scalars['ObjectID']['input'];
  carouselItems: Array<Scalars['String']['input']>;
  highPointsThreshold: Scalars['Int']['input'];
  topSoldThreshold: Scalars['Int']['input'];
};

export type CreateGcashPaymentInput = {
  amount: Scalars['Decimal']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  failureUrl: Scalars['String']['input'];
  referenceId?: InputMaybe<Scalars['String']['input']>;
  successUrl: Scalars['String']['input'];
};

export type CreateProductInput = {
  _id: Scalars['ObjectID']['input'];
  category: Array<CategoryType>;
  dateAdded?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  discount?: InputMaybe<Scalars['Int']['input']>;
  flashSale?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  pieces: Scalars['Int']['input'];
  points: Scalars['Decimal']['input'];
  price: Scalars['Int']['input'];
  reservation?: InputMaybe<ReservationType>;
  sold?: InputMaybe<Scalars['Int']['input']>;
  status: StatusType;
  thumbnail: Scalars['String']['input'];
  type?: InputMaybe<CategoryType>;
  variations?: InputMaybe<Array<KeyValuePairInput>>;
  vouchers?: InputMaybe<Array<VoucherInput>>;
};

export type CreateProductReviewInput = {
  message?: InputMaybe<Scalars['String']['input']>;
  orderId?: InputMaybe<Scalars['ObjectID']['input']>;
  productId: Scalars['ObjectID']['input'];
  rating: Scalars['Int']['input'];
};

export type DeleteProductInput = {
  _id: Scalars['ObjectID']['input'];
};

export type Edge = {
  __typename: 'Edge';
  cursor: Scalars['Cursor']['output'];
  node: Node;
};

export type Error = {
  message: Scalars['String']['output'];
};

export type FileFormatNotSupportedError = Error & {
  __typename: 'FileFormatNotSupportedError';
  message: Scalars['String']['output'];
};

export type FileNameTooLongError = Error & {
  __typename: 'FileNameTooLongError';
  message: Scalars['String']['output'];
};

export type FileSizeTooBigError = Error & {
  __typename: 'FileSizeTooBigError';
  message: Scalars['String']['output'];
};

export type GoogleDetails = {
  __typename: 'GoogleDetails';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  displayName?: Maybe<Scalars['String']['output']>;
  emailAddress?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  linkedAt: Scalars['DateTime']['output'];
};

export type IdFilterInput = {
  equal?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  notEqual?: InputMaybe<Scalars['String']['input']>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type IntFilterInput = {
  equal?: InputMaybe<Scalars['Int']['input']>;
  greaterThan?: InputMaybe<Scalars['Int']['input']>;
  greaterThanOrEqual?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lesserThan?: InputMaybe<Scalars['Int']['input']>;
  lesserThanOrEqual?: InputMaybe<Scalars['Int']['input']>;
  notEqual?: InputMaybe<Scalars['Int']['input']>;
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type KeyValuePair = {
  __typename: 'KeyValuePair';
  key: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type KeyValuePairInput = {
  key: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type License = {
  __typename: 'License';
  _id: Scalars['ObjectID']['output'];
  code: Scalars['String']['output'];
  expirationDate?: Maybe<Scalars['String']['output']>;
  variant: LicenseVariant;
};

export type LicenseInput = {
  _id: Scalars['ObjectID']['input'];
  code: Scalars['String']['input'];
  expirationDate?: InputMaybe<Scalars['String']['input']>;
  variant: LicenseVariant;
};

export enum LicenseVariant {
  FiveMinuteTrial = 'FIVE_MINUTE_TRIAL',
  OneHourTrial = 'ONE_HOUR_TRIAL',
  OneMinuteTrial = 'ONE_MINUTE_TRIAL',
  TenMinuteTrial = 'TEN_MINUTE_TRIAL',
}

export type LinkGoogleAccountInput = {
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  emailAddress?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
};

export type Mutation = {
  __typename: 'Mutation';
  checkout: Order;
  clearCart: Cart;
  createAdminAccount?: Maybe<Scalars['Boolean']['output']>;
  createConfig?: Maybe<Scalars['Boolean']['output']>;
  createGcashPayment?: Maybe<PaymentRequestResponse>;
  createLicense?: Maybe<Scalars['Boolean']['output']>;
  createMemberAccount?: Maybe<Scalars['Boolean']['output']>;
  createProduct?: Maybe<Scalars['Boolean']['output']>;
  createProductReview: ProductReview;
  deleteProduct?: Maybe<Scalars['Boolean']['output']>;
  linkGoogleAccount?: Maybe<Scalars['Boolean']['output']>;
  removeFromCart: Scalars['Boolean']['output'];
  unlinkGoogleAccount?: Maybe<Scalars['Boolean']['output']>;
  updateCartItem?: Maybe<Scalars['Boolean']['output']>;
  updateConfig?: Maybe<Scalars['Boolean']['output']>;
  updateOrderStatus?: Maybe<Scalars['Boolean']['output']>;
  updatePaymentMethodStatus: Scalars['Boolean']['output'];
  updateProduct?: Maybe<Scalars['Boolean']['output']>;
  updateShippingMethodStatus: Scalars['Boolean']['output'];
  uploadFile?: Maybe<Scalars['String']['output']>;
};

export type MutationCheckoutArgs = {
  input: CheckoutInput;
};

export type MutationCreateAdminAccountArgs = {
  input: CreateAccountInput;
};

export type MutationCreateConfigArgs = {
  input: CreateConfigInput;
};

export type MutationCreateGcashPaymentArgs = {
  input?: InputMaybe<CreateGcashPaymentInput>;
};

export type MutationCreateLicenseArgs = {
  input: LicenseInput;
};

export type MutationCreateMemberAccountArgs = {
  input: CreateAccountInput;
};

export type MutationCreateProductArgs = {
  input: CreateProductInput;
};

export type MutationCreateProductReviewArgs = {
  input: CreateProductReviewInput;
};

export type MutationDeleteProductArgs = {
  input: DeleteProductInput;
};

export type MutationLinkGoogleAccountArgs = {
  input: LinkGoogleAccountInput;
};

export type MutationRemoveFromCartArgs = {
  input: RemoveFromCartInput;
};

export type MutationUpdateCartItemArgs = {
  input: UpdateCartItemInput;
};

export type MutationUpdateConfigArgs = {
  input: UpdateConfigInput;
};

export type MutationUpdateOrderStatusArgs = {
  input: UpdateOrderStatusInput;
};

export type MutationUpdatePaymentMethodStatusArgs = {
  input: UpdatePaymentMethodStatusInput;
};

export type MutationUpdateProductArgs = {
  input: UpdateProductInput;
};

export type MutationUpdateShippingMethodStatusArgs = {
  input: UpdateShippingMethodStatusInput;
};

export type MutationUploadFileArgs = {
  file: Scalars['Upload']['input'];
};

export type Node = {
  _id: Scalars['ObjectID']['output'];
};

export type Order = {
  __typename: 'Order';
  _id: Scalars['ObjectID']['output'];
  createdAt: Scalars['String']['output'];
  items: Array<OrderItem>;
  paymentMethod: PaymentMethod;
  shippingFee: Scalars['String']['output'];
  shippingOption: ShippingOption;
  status: OrderStatus;
  subtotal: Scalars['String']['output'];
  tax: Scalars['String']['output'];
  total: Scalars['String']['output'];
};

export type OrderItem = {
  __typename: 'OrderItem';
  message?: Maybe<Scalars['String']['output']>;
  productId: Scalars['ObjectID']['output'];
  quantity: Scalars['Int']['output'];
  rating?: Maybe<Scalars['Int']['output']>;
  totalPrice?: Maybe<Scalars['String']['output']>;
  unitPrice?: Maybe<Scalars['String']['output']>;
};

export enum OrderStatus {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Paid = 'PAID',
  Pending = 'PENDING',
  Shipped = 'SHIPPED',
}

export type PageInfo = {
  __typename: 'PageInfo';
  endCursor?: Maybe<Scalars['Cursor']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
};

export type PaymentAction = {
  __typename: 'PaymentAction';
  descriptor?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type PaymentMethod = {
  __typename: 'PaymentMethod';
  _id: Scalars['ObjectID']['output'];
  description?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  label: Scalars['String']['output'];
  type: PaymentMethodType;
};

export enum PaymentMethodType {
  BankTransfer = 'BANK_TRANSFER',
  Card = 'CARD',
  CashOnDelivery = 'CASH_ON_DELIVERY',
  Gcash = 'GCASH',
}

export type PaymentRequestResponse = {
  __typename: 'PaymentRequestResponse';
  actions?: Maybe<Array<Maybe<PaymentAction>>>;
  business_id?: Maybe<Scalars['String']['output']>;
  capture_method?: Maybe<Scalars['String']['output']>;
  channel_code?: Maybe<Scalars['String']['output']>;
  channel_properties?: Maybe<ChannelProperties>;
  country?: Maybe<Scalars['String']['output']>;
  created?: Maybe<Scalars['String']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  payment_request_id?: Maybe<Scalars['String']['output']>;
  reference_id?: Maybe<Scalars['String']['output']>;
  request_amount?: Maybe<Scalars['Decimal']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  updated?: Maybe<Scalars['String']['output']>;
};

export type Product = Node & {
  __typename: 'Product';
  _id: Scalars['ObjectID']['output'];
  avgRating: Scalars['Float']['output'];
  category?: Maybe<Array<CategoryType>>;
  dateAdded?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  discount: Scalars['Int']['output'];
  flashSale?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  nodeType: Scalars['String']['output'];
  pieces: Scalars['Int']['output'];
  points: Scalars['Decimal']['output'];
  price: Scalars['Int']['output'];
  reservation?: Maybe<ReservationType>;
  sold?: Maybe<Scalars['Int']['output']>;
  status: StatusType;
  thumbnail: Scalars['String']['output'];
  type?: Maybe<CategoryType>;
  variations?: Maybe<Array<KeyValuePair>>;
  vouchers?: Maybe<Array<Voucher>>;
};

export type ProductByIdsInput = {
  ids: Array<Scalars['ObjectID']['input']>;
};

export type ProductReview = {
  __typename: 'ProductReview';
  _id: Scalars['ObjectID']['output'];
  accountId: Scalars['ObjectID']['output'];
  createdAt: Scalars['String']['output'];
  message?: Maybe<Scalars['String']['output']>;
  orderId?: Maybe<Scalars['ObjectID']['output']>;
  productId: Scalars['ObjectID']['output'];
  rating: Scalars['Int']['output'];
  updatedAt: Scalars['String']['output'];
};

export type ProductsCategoryFilterInput = {
  equal?: InputMaybe<CategoryType>;
  in?: InputMaybe<Array<CategoryType>>;
  notEqual?: InputMaybe<CategoryType>;
  notIn?: InputMaybe<Array<CategoryType>>;
};

export type ProductsFilterInput = {
  _id?: InputMaybe<IdFilterInput>;
  category?: InputMaybe<ProductsCategoryFilterInput>;
  name?: InputMaybe<IdFilterInput>;
  points?: InputMaybe<IntFilterInput>;
  status?: InputMaybe<ProductsStatusFilterInput>;
};

export type ProductsStatusFilterInput = {
  equal?: InputMaybe<StatusType>;
  in?: InputMaybe<Array<StatusType>>;
  notEqual?: InputMaybe<StatusType>;
  notIn?: InputMaybe<Array<StatusType>>;
};

export type Query = {
  __typename: 'Query';
  cart: Cart;
  config: Config;
  highPointProducts: Connection;
  memberAccounts: Array<Account>;
  myOrders: Array<Order>;
  order?: Maybe<Order>;
  paymentMethods: Array<PaymentMethod>;
  productByIds: CartProductDetails;
  productReviews: Array<ProductReview>;
  products: Connection;
  searchProductByName?: Maybe<Array<Product>>;
  self?: Maybe<Account>;
  shippingOptions: Array<ShippingOption>;
};

export type QueryHighPointProductsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<ProductsFilterInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryOrderArgs = {
  id: Scalars['ObjectID']['input'];
};

export type QueryPaymentMethodsArgs = {
  includeInactive?: InputMaybe<Scalars['Boolean']['input']>;
};

export type QueryProductByIdsArgs = {
  ids?: InputMaybe<ProductByIdsInput>;
};

export type QueryProductReviewsArgs = {
  productId: Scalars['ObjectID']['input'];
};

export type QueryProductsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<ProductsFilterInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

export type QuerySearchProductByNameArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  search: Scalars['String']['input'];
};

export type QueryShippingOptionsArgs = {
  includeInactive?: InputMaybe<Scalars['Boolean']['input']>;
};

export type RemoveFromCartInput = {
  productId: Scalars['ObjectID']['input'];
};

export enum ReservationType {
  Available = 'AVAILABLE',
  Unavailable = 'UNAVAILABLE',
}

export type ShippingOption = {
  __typename: 'ShippingOption';
  _id: Scalars['ObjectID']['output'];
  description?: Maybe<Scalars['String']['output']>;
  estimatedDays?: Maybe<Scalars['String']['output']>;
  fee: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  label: Scalars['String']['output'];
  type: ShippingType;
};

export enum ShippingType {
  Express = 'EXPRESS',
  SameDay = 'SAME_DAY',
  Standard = 'STANDARD',
}

export enum StatusType {
  Active = 'ACTIVE',
  Draft = 'DRAFT',
  Inactive = 'INACTIVE',
  SoldOut = 'SOLD_OUT',
}

export type UpdateCartItemInput = {
  productId: Scalars['ObjectID']['input'];
  quantity: Scalars['Int']['input'];
};

export type UpdateConfigInput = {
  _id: Scalars['ObjectID']['input'];
  carouselItems: Array<Scalars['String']['input']>;
  highPointsThreshold: Scalars['Int']['input'];
  topSoldThreshold: Scalars['Int']['input'];
};

export type UpdateOrderStatusInput = {
  message?: InputMaybe<Scalars['String']['input']>;
  orderId: Scalars['ObjectID']['input'];
  productId?: InputMaybe<Scalars['ObjectID']['input']>;
  rating?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<OrderStatus>;
};

export type UpdatePaymentMethodStatusInput = {
  isActive: Scalars['Boolean']['input'];
  type: PaymentMethodType;
};

export type UpdateProductInput = {
  _id: Scalars['ObjectID']['input'];
  category: Array<CategoryType>;
  dateAdded?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  discount?: InputMaybe<Scalars['Int']['input']>;
  flashSale?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  pieces: Scalars['Int']['input'];
  points: Scalars['Decimal']['input'];
  price: Scalars['Int']['input'];
  reservation?: InputMaybe<ReservationType>;
  status: StatusType;
  thumbnail: Scalars['String']['input'];
  type?: InputMaybe<CategoryType>;
  variations?: InputMaybe<Array<KeyValuePairInput>>;
  vouchers?: InputMaybe<Array<VoucherInput>>;
};

export type UpdateShippingMethodStatusInput = {
  isActive: Scalars['Boolean']['input'];
  type: ShippingType;
};

export type Voucher = {
  code?: Maybe<Scalars['String']['output']>;
  date?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['Int']['output']>;
};

export type VoucherInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['Int']['input']>;
};

export type CreateMemberAccountMutationVariables = Exact<{
  input: CreateAccountInput;
}>;

export type CreateMemberAccountMutation = {
  __typename: 'Mutation';
  createMemberAccount?: boolean | null;
};

export type CreateAdminAccountMutationVariables = Exact<{
  input: CreateAccountInput;
}>;

export type CreateAdminAccountMutation = {
  __typename: 'Mutation';
  createAdminAccount?: boolean | null;
};

export type SelfQueryVariables = Exact<{ [key: string]: never }>;

export type SelfQuery = {
  __typename: 'Query';
  self?: {
    __typename: 'Account';
    _id: string;
    emailAddress: string;
    role: string;
    googleDetails?: { __typename: 'GoogleDetails'; id: string } | null;
  } | null;
};

export type LinkGoogleAccountMutationVariables = Exact<{
  input: LinkGoogleAccountInput;
}>;

export type LinkGoogleAccountMutation = {
  __typename: 'Mutation';
  linkGoogleAccount?: boolean | null;
};

export type UnlinkGoogleAccountMutationVariables = Exact<{
  [key: string]: never;
}>;

export type UnlinkGoogleAccountMutation = {
  __typename: 'Mutation';
  unlinkGoogleAccount?: boolean | null;
};

export type UpdateCartItemMutationVariables = Exact<{
  input: UpdateCartItemInput;
}>;

export type UpdateCartItemMutation = {
  __typename: 'Mutation';
  updateCartItem?: boolean | null;
};

export type CartQueryVariables = Exact<{ [key: string]: never }>;

export type CartQuery = {
  __typename: 'Query';
  cart: {
    __typename: 'Cart';
    _id: string;
    subtotal?: string | null;
    tax?: string | null;
    status: CartStatus;
    createdAt: string;
    updatedAt: string;
    items: Array<{
      __typename: 'CartItem';
      productId: string;
      quantity: number;
      unitPrice?: string | null;
      totalPrice?: string | null;
    }>;
  };
};

export type MyOrdersQueryVariables = Exact<{ [key: string]: never }>;

export type MyOrdersQuery = {
  __typename: 'Query';
  myOrders: Array<{
    __typename: 'Order';
    _id: string;
    subtotal: string;
    tax: string;
    shippingFee: string;
    total: string;
    status: OrderStatus;
    createdAt: string;
    items: Array<{
      __typename: 'OrderItem';
      productId: string;
      quantity: number;
      unitPrice?: string | null;
      totalPrice?: string | null;
      rating?: number | null;
      message?: string | null;
    }>;
    shippingOption: {
      __typename: 'ShippingOption';
      type: ShippingType;
      label: string;
      description?: string | null;
      estimatedDays?: string | null;
      fee: string;
    };
  }>;
};

export type ShippingOptionsQueryVariables = Exact<{ [key: string]: never }>;

export type ShippingOptionsQuery = {
  __typename: 'Query';
  shippingOptions: Array<{
    __typename: 'ShippingOption';
    _id: string;
    type: ShippingType;
    label: string;
    description?: string | null;
    fee: string;
    estimatedDays?: string | null;
  }>;
};

export type PaymentMethodsQueryVariables = Exact<{ [key: string]: never }>;

export type PaymentMethodsQuery = {
  __typename: 'Query';
  paymentMethods: Array<{
    __typename: 'PaymentMethod';
    _id: string;
    type: PaymentMethodType;
    label: string;
    description?: string | null;
    isActive: boolean;
  }>;
};

export type CheckoutMethodSettingsQueryVariables = Exact<{
  [key: string]: never;
}>;

export type CheckoutMethodSettingsQuery = {
  __typename: 'Query';
  shippingOptions: Array<{
    __typename: 'ShippingOption';
    _id: string;
    type: ShippingType;
    label: string;
    description?: string | null;
    fee: string;
    estimatedDays?: string | null;
    isActive: boolean;
  }>;
  paymentMethods: Array<{
    __typename: 'PaymentMethod';
    _id: string;
    type: PaymentMethodType;
    label: string;
    description?: string | null;
    isActive: boolean;
  }>;
};

export type CheckoutMutationVariables = Exact<{
  input: CheckoutInput;
}>;

export type CheckoutMutation = {
  __typename: 'Mutation';
  checkout: {
    __typename: 'Order';
    _id: string;
    subtotal: string;
    tax: string;
    shippingFee: string;
    total: string;
    status: OrderStatus;
    createdAt: string;
    items: Array<{
      __typename: 'OrderItem';
      productId: string;
      quantity: number;
      unitPrice?: string | null;
      totalPrice?: string | null;
      rating?: number | null;
      message?: string | null;
    }>;
    shippingOption: {
      __typename: 'ShippingOption';
      type: ShippingType;
      label: string;
      description?: string | null;
      estimatedDays?: string | null;
      fee: string;
    };
    paymentMethod: { __typename: 'PaymentMethod'; type: PaymentMethodType };
  };
};

export type RemoveFromCartMutationVariables = Exact<{
  input: RemoveFromCartInput;
}>;

export type RemoveFromCartMutation = {
  __typename: 'Mutation';
  removeFromCart: boolean;
};

export type UpdateOrderStatusMutationVariables = Exact<{
  input: UpdateOrderStatusInput;
}>;

export type UpdateOrderStatusMutation = {
  __typename: 'Mutation';
  updateOrderStatus?: boolean | null;
};

export type CreateProductReviewMutationVariables = Exact<{
  input: CreateProductReviewInput;
}>;

export type CreateProductReviewMutation = {
  __typename: 'Mutation';
  createProductReview: {
    __typename: 'ProductReview';
    _id: string;
    productId: string;
    accountId: string;
    orderId?: string | null;
    rating: number;
    message?: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type UpdateShippingMethodStatusMutationVariables = Exact<{
  input: UpdateShippingMethodStatusInput;
}>;

export type UpdateShippingMethodStatusMutation = {
  __typename: 'Mutation';
  updateShippingMethodStatus: boolean;
};

export type UpdatePaymentMethodStatusMutationVariables = Exact<{
  input: UpdatePaymentMethodStatusInput;
}>;

export type UpdatePaymentMethodStatusMutation = {
  __typename: 'Mutation';
  updatePaymentMethodStatus: boolean;
};

export type UploadFileMutationVariables = Exact<{
  file: Scalars['Upload']['input'];
}>;

export type UploadFileMutation = {
  __typename: 'Mutation';
  uploadFile?: string | null;
};

export type LicenseMutationVariables = Exact<{
  input: LicenseInput;
}>;

export type LicenseMutation = {
  __typename: 'Mutation';
  createLicense?: boolean | null;
};

export type CreateGcashPaymentMutationVariables = Exact<{
  input?: InputMaybe<CreateGcashPaymentInput>;
}>;

export type CreateGcashPaymentMutation = {
  __typename: 'Mutation';
  createGcashPayment?: {
    __typename: 'PaymentRequestResponse';
    reference_id?: string | null;
    payment_request_id?: string | null;
    actions?: Array<{
      __typename: 'PaymentAction';
      value?: string | null;
    } | null> | null;
  } | null;
};

export type ProductCoreDataFragment = {
  __typename: 'Product';
  _id: string;
  name: string;
  price: number;
  points: string;
  pieces: number;
  status: StatusType;
  discount: number;
  category?: Array<CategoryType> | null;
  thumbnail: string;
  avgRating: number;
};

export type ProductsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<ProductsFilterInput>;
}>;

export type ProductsQuery = {
  __typename: 'Query';
  products: {
    __typename: 'Connection';
    totalCount: number;
    pageInfo: {
      __typename: 'PageInfo';
      hasNextPage: boolean;
      endCursor?: string | null;
    };
    edges: Array<{
      __typename: 'Edge';
      cursor: string;
      node: {
        __typename: 'Product';
        _id: string;
        name: string;
        price: number;
        points: string;
        pieces: number;
        status: StatusType;
        discount: number;
        category?: Array<CategoryType> | null;
        thumbnail: string;
        avgRating: number;
      };
    }>;
  };
};

export type ProductReviewsQueryVariables = Exact<{
  productId: Scalars['ObjectID']['input'];
}>;

export type ProductReviewsQuery = {
  __typename: 'Query';
  productReviews: Array<{
    __typename: 'ProductReview';
    _id: string;
    productId: string;
    accountId: string;
    orderId?: string | null;
    rating: number;
    message?: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
};

export type CreateProductMutationVariables = Exact<{
  input: CreateProductInput;
}>;

export type CreateProductMutation = {
  __typename: 'Mutation';
  createProduct?: boolean | null;
};

export type UpdateProductMutationVariables = Exact<{
  input: UpdateProductInput;
}>;

export type UpdateProductMutation = {
  __typename: 'Mutation';
  updateProduct?: boolean | null;
};

export type DeleteProductMutationVariables = Exact<{
  input: DeleteProductInput;
}>;

export type DeleteProductMutation = {
  __typename: 'Mutation';
  deleteProduct?: boolean | null;
};

export type ConfigQueryVariables = Exact<{ [key: string]: never }>;

export type ConfigQuery = {
  __typename: 'Query';
  config: {
    __typename: 'Config';
    _id: string;
    highPointsThreshold?: number | null;
    topSoldThreshold?: number | null;
    carouselItems: Array<string>;
  };
};

export type CreateConfigMutationVariables = Exact<{
  input: CreateConfigInput;
}>;

export type CreateConfigMutation = {
  __typename: 'Mutation';
  createConfig?: boolean | null;
};

export type UpdateConfigMutationVariables = Exact<{
  input: UpdateConfigInput;
}>;

export type UpdateConfigMutation = {
  __typename: 'Mutation';
  updateConfig?: boolean | null;
};

export type HighPointProductsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<ProductsFilterInput>;
}>;

export type HighPointProductsQuery = {
  __typename: 'Query';
  highPointProducts: {
    __typename: 'Connection';
    totalCount: number;
    pageInfo: {
      __typename: 'PageInfo';
      hasNextPage: boolean;
      endCursor?: string | null;
    };
    edges: Array<{
      __typename: 'Edge';
      cursor: string;
      node: {
        __typename: 'Product';
        _id: string;
        name: string;
        price: number;
        points: string;
        pieces: number;
        status: StatusType;
        discount: number;
        category?: Array<CategoryType> | null;
        thumbnail: string;
        avgRating: number;
      };
    }>;
  };
};

export type SearchProductByNameQueryVariables = Exact<{
  search: Scalars['String']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['Cursor']['input']>;
}>;

export type SearchProductByNameQuery = {
  __typename: 'Query';
  searchProductByName?: Array<{
    __typename: 'Product';
    _id: string;
    name: string;
    price: number;
    points: string;
    pieces: number;
    status: StatusType;
    discount: number;
    category?: Array<CategoryType> | null;
    thumbnail: string;
    avgRating: number;
  }> | null;
};

export const ProductCoreDataFragmentDoc = /*#__PURE__*/ {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProductCoreData' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Product' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '_id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'price' } },
          { kind: 'Field', name: { kind: 'Name', value: 'points' } },
          { kind: 'Field', name: { kind: 'Name', value: 'pieces' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'discount' } },
          { kind: 'Field', name: { kind: 'Name', value: 'category' } },
          { kind: 'Field', name: { kind: 'Name', value: 'thumbnail' } },
          { kind: 'Field', name: { kind: 'Name', value: 'avgRating' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ProductCoreDataFragment, unknown>;
export const CreateMemberAccountDocument = /*#__PURE__*/ {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateMemberAccount' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'CreateAccountInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createMemberAccount' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateMemberAccountMutation,
  CreateMemberAccountMutationVariables
>;
export const CreateAdminAccountDocument = /*#__PURE__*/ {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateAdminAccount' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'CreateAccountInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createAdminAccount' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateAdminAccountMutation,
  CreateAdminAccountMutationVariables
>;
export const SelfDocument = /*#__PURE__*/ {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Self' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'self' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '_id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'emailAddress' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'role' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'googleDetails' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SelfQuery, SelfQueryVariables>;
export const LinkGoogleAccountDocument = /*#__PURE__*/ {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'LinkGoogleAccount' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'LinkGoogleAccountInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'linkGoogleAccount' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  LinkGoogleAccountMutation,
  LinkGoogleAccountMutationVariables
>;
export const UnlinkGoogleAccountDocument = /*#__PURE__*/ {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UnlinkGoogleAccount' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'unlinkGoogleAccount' },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UnlinkGoogleAccountMutation,
  UnlinkGoogleAccountMutationVariables
>;
export const UpdateCartItemDocument = /*#__PURE__*/ {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateCartItem' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'UpdateCartItemInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateCartItem' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateCartItemMutation,
  UpdateCartItemMutationVariables
>;
export const CartDocument = /*#__PURE__*/ {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Cart' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'cart' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '_id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'items' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'productId' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'quantity' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'unitPrice' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'totalPrice' },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'subtotal' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tax' } },
                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CartQuery, CartQueryVariables>;
export const MyOrdersDocument = /*#__PURE__*/ {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'MyOrders' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'myOrders' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '_id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'items' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'productId' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'quantity' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'unitPrice' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'totalPrice' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'rating' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'message' },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'shippingOption' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'label' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'description' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'estimatedDays' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'fee' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'subtotal' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tax' } },
                { kind: 'Field', name: { kind: 'Name', value: 'shippingFee' } },
                { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<MyOrdersQuery, MyOrdersQueryVariables>;
export const ShippingOptionsDocument = /*#__PURE__*/ {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'ShippingOptions' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'shippingOptions' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '_id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                { kind: 'Field', name: { kind: 'Name', value: 'label' } },
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'fee' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'estimatedDays' },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ShippingOptionsQuery,
  ShippingOptionsQueryVariables
>;
export const PaymentMethodsDocument = /*#__PURE__*/ {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'PaymentMethods' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'paymentMethods' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '_id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                { kind: 'Field', name: { kind: 'Name', value: 'label' } },
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'isActive' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<PaymentMethodsQuery, PaymentMethodsQueryVariables>;
export const CheckoutMethodSettingsDocument = /*#__PURE__*/ {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'CheckoutMethodSettings' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'shippingOptions' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'includeInactive' },
                value: { kind: 'BooleanValue', value: true },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '_id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                { kind: 'Field', name: { kind: 'Name', value: 'label' } },
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'fee' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'estimatedDays' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'isActive' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'paymentMethods' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'includeInactive' },
                value: { kind: 'BooleanValue', value: true },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '_id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                { kind: 'Field', name: { kind: 'Name', value: 'label' } },
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'isActive' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CheckoutMethodSettingsQuery,
  CheckoutMethodSettingsQueryVariables
>;
export const CheckoutDocument = /*#__PURE__*/ {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'Checkout' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'CheckoutInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'checkout' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '_id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'items' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'productId' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'quantity' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'unitPrice' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'totalPrice' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'rating' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'message' },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'shippingOption' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'label' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'description' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'estimatedDays' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'fee' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'paymentMethod' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'subtotal' } },
                { kind: 'Field', name: { kind: 'Name', value: 'tax' } },
                { kind: 'Field', name: { kind: 'Name', value: 'shippingFee' } },
                { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CheckoutMutation, CheckoutMutationVariables>;
export const RemoveFromCartDocument = /*#__PURE__*/ {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'RemoveFromCart' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'RemoveFromCartInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'removeFromCart' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  RemoveFromCartMutation,
  RemoveFromCartMutationVariables
>;
export const UpdateOrderStatusDocument = /*#__PURE__*/ {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateOrderStatus' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'UpdateOrderStatusInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateOrderStatus' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateOrderStatusMutation,
  UpdateOrderStatusMutationVariables
>;
export const CreateProductReviewDocument = /*#__PURE__*/ {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateProductReview' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'CreateProductReviewInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createProductReview' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '_id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'productId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'accountId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'orderId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'rating' } },
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateProductReviewMutation,
  CreateProductReviewMutationVariables
>;
export const UpdateShippingMethodStatusDocument = /*#__PURE__*/ {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateShippingMethodStatus' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'UpdateShippingMethodStatusInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateShippingMethodStatus' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateShippingMethodStatusMutation,
  UpdateShippingMethodStatusMutationVariables
>;
export const UpdatePaymentMethodStatusDocument = /*#__PURE__*/ {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdatePaymentMethodStatus' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'UpdatePaymentMethodStatusInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updatePaymentMethodStatus' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdatePaymentMethodStatusMutation,
  UpdatePaymentMethodStatusMutationVariables
>;
export const UploadFileDocument = /*#__PURE__*/ {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UploadFile' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'file' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'Upload' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'uploadFile' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'file' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'file' },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UploadFileMutation, UploadFileMutationVariables>;
export const LicenseDocument = /*#__PURE__*/ {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'License' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'LicenseInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createLicense' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<LicenseMutation, LicenseMutationVariables>;
export const CreateGcashPaymentDocument = /*#__PURE__*/ {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateGcashPayment' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NamedType',
            name: { kind: 'Name', value: 'CreateGcashPaymentInput' },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createGcashPayment' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'reference_id' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'actions' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'value' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'payment_request_id' },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateGcashPaymentMutation,
  CreateGcashPaymentMutationVariables
>;
export const ProductsDocument = /*#__PURE__*/ {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Products' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'first' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'after' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Cursor' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'filter' },
          },
          type: {
            kind: 'NamedType',
            name: { kind: 'Name', value: 'ProductsFilterInput' },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'products' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'first' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'first' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'after' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'after' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'filter' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'pageInfo' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'hasNextPage' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'endCursor' },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'edges' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'cursor' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'FragmentSpread',
                              name: { kind: 'Name', value: 'ProductCoreData' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProductCoreData' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Product' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '_id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'price' } },
          { kind: 'Field', name: { kind: 'Name', value: 'points' } },
          { kind: 'Field', name: { kind: 'Name', value: 'pieces' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'discount' } },
          { kind: 'Field', name: { kind: 'Name', value: 'category' } },
          { kind: 'Field', name: { kind: 'Name', value: 'thumbnail' } },
          { kind: 'Field', name: { kind: 'Name', value: 'avgRating' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ProductsQuery, ProductsQueryVariables>;
export const ProductReviewsDocument = /*#__PURE__*/ {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'ProductReviews' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'productId' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'ObjectID' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'productReviews' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'productId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'productId' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '_id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'productId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'accountId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'orderId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'rating' } },
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ProductReviewsQuery, ProductReviewsQueryVariables>;
export const CreateProductDocument = /*#__PURE__*/ {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateProduct' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'CreateProductInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createProduct' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateProductMutation,
  CreateProductMutationVariables
>;
export const UpdateProductDocument = /*#__PURE__*/ {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateProduct' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'UpdateProductInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateProduct' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateProductMutation,
  UpdateProductMutationVariables
>;
export const DeleteProductDocument = /*#__PURE__*/ {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'DeleteProduct' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'DeleteProductInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteProduct' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  DeleteProductMutation,
  DeleteProductMutationVariables
>;
export const ConfigDocument = /*#__PURE__*/ {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Config' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'config' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '_id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'highPointsThreshold' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'topSoldThreshold' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'carouselItems' },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ConfigQuery, ConfigQueryVariables>;
export const CreateConfigDocument = /*#__PURE__*/ {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateConfig' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'CreateConfigInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createConfig' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateConfigMutation,
  CreateConfigMutationVariables
>;
export const UpdateConfigDocument = /*#__PURE__*/ {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateConfig' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'UpdateConfigInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateConfig' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateConfigMutation,
  UpdateConfigMutationVariables
>;
export const HighPointProductsDocument = /*#__PURE__*/ {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'HighPointProducts' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'first' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'after' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Cursor' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'filter' },
          },
          type: {
            kind: 'NamedType',
            name: { kind: 'Name', value: 'ProductsFilterInput' },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'highPointProducts' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'first' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'first' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'after' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'after' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'filter' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'pageInfo' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'hasNextPage' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'endCursor' },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'edges' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'cursor' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'FragmentSpread',
                              name: { kind: 'Name', value: 'ProductCoreData' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProductCoreData' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Product' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '_id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'price' } },
          { kind: 'Field', name: { kind: 'Name', value: 'points' } },
          { kind: 'Field', name: { kind: 'Name', value: 'pieces' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'discount' } },
          { kind: 'Field', name: { kind: 'Name', value: 'category' } },
          { kind: 'Field', name: { kind: 'Name', value: 'thumbnail' } },
          { kind: 'Field', name: { kind: 'Name', value: 'avgRating' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  HighPointProductsQuery,
  HighPointProductsQueryVariables
>;
export const SearchProductByNameDocument = /*#__PURE__*/ {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'SearchProductByName' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'search' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'first' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'after' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Cursor' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'searchProductByName' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'search' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'search' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'first' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'first' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'after' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'after' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'ProductCoreData' },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProductCoreData' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Product' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '_id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'price' } },
          { kind: 'Field', name: { kind: 'Name', value: 'points' } },
          { kind: 'Field', name: { kind: 'Name', value: 'pieces' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'discount' } },
          { kind: 'Field', name: { kind: 'Name', value: 'category' } },
          { kind: 'Field', name: { kind: 'Name', value: 'thumbnail' } },
          { kind: 'Field', name: { kind: 'Name', value: 'avgRating' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  SearchProductByNameQuery,
  SearchProductByNameQueryVariables
>;
