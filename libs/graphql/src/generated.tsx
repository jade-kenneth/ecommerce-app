/* eslint-disable */
// @ts-nocheck
// Generated file
// Last modified: Mon, 16 Feb 2026 15:57:37 GMT
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
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
const defaultOptions = {} as const;
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

export enum AccountType {
  Admin = 'ADMIN',
  Member = 'MEMBER',
}

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

export type CheckoutInput = {
  clientId?: InputMaybe<Scalars['String']['input']>;
  paymentMethodId?: InputMaybe<Scalars['ObjectID']['input']>;
  shippingOptionId?: InputMaybe<Scalars['ObjectID']['input']>;
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

export type DeleteProductInput = {
  _id: Scalars['ObjectID']['input'];
};

export type IdFilterInput = {
  equal?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  notEqual?: InputMaybe<Scalars['String']['input']>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type KeyValuePairInput = {
  key: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type LicenseInput = {
  _id: Scalars['ObjectID']['input'];
  code: Scalars['String']['input'];
  expirationDate: Scalars['String']['input'];
};

export enum OrderStatus {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Paid = 'PAID',
  Pending = 'PENDING',
  Shipped = 'SHIPPED',
}

export enum PaymentMethodType {
  BankTransfer = 'BANK_TRANSFER',
  Card = 'CARD',
  CashOnDelivery = 'CASH_ON_DELIVERY',
  Gcash = 'GCASH',
}

export type ProductByIdsInput = {
  ids: Array<Scalars['ObjectID']['input']>;
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
  status?: InputMaybe<ProductsStatusFilterInput>;
};

export type ProductsStatusFilterInput = {
  equal?: InputMaybe<StatusType>;
  in?: InputMaybe<Array<StatusType>>;
  notEqual?: InputMaybe<StatusType>;
  notIn?: InputMaybe<Array<StatusType>>;
};

export type RemoveFromCartInput = {
  productId: Scalars['ObjectID']['input'];
};

export enum ReservationType {
  Available = 'AVAILABLE',
  Unavailable = 'UNAVAILABLE',
}

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
  orderId: Scalars['ObjectID']['input'];
  status: OrderStatus;
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
  } | null;
};

export type UpdateCartItemMutationVariables = Exact<{
  input: UpdateCartItemInput;
}>;

export type UpdateCartItemMutation = {
  __typename: 'Mutation';
  updateCartItem?: boolean | null;
};

export type CartQueryVariables = Exact<{
  id: Scalars['ObjectID']['input'];
}>;

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
      __typename: 'CartItem';
      productId: string;
      quantity: number;
      unitPrice?: string | null;
      totalPrice?: string | null;
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
      __typename: 'CartItem';
      productId: string;
      quantity: number;
      unitPrice?: string | null;
      totalPrice?: string | null;
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
      };
    }>;
  };
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
  }> | null;
};

export const ProductCoreDataFragmentDoc = /*#__PURE__*/ gql`
  fragment ProductCoreData on Product {
    _id
    name
    price
    points
    pieces
    status
    discount
    category
    thumbnail
  }
`;
export const CreateMemberAccountDocument = /*#__PURE__*/ gql`
  mutation CreateMemberAccount($input: CreateAccountInput!) {
    createMemberAccount(input: $input)
  }
`;
export type CreateMemberAccountMutationFn = Apollo.MutationFunction<
  CreateMemberAccountMutation,
  CreateMemberAccountMutationVariables
>;
export function useCreateMemberAccountMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateMemberAccountMutation,
    CreateMemberAccountMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateMemberAccountMutation,
    CreateMemberAccountMutationVariables
  >(CreateMemberAccountDocument, options);
}
export type CreateMemberAccountMutationHookResult = ReturnType<
  typeof useCreateMemberAccountMutation
>;
export type CreateMemberAccountMutationResult =
  Apollo.MutationResult<CreateMemberAccountMutation>;
export type CreateMemberAccountMutationOptions = Apollo.BaseMutationOptions<
  CreateMemberAccountMutation,
  CreateMemberAccountMutationVariables
>;
export const CreateAdminAccountDocument = /*#__PURE__*/ gql`
  mutation CreateAdminAccount($input: CreateAccountInput!) {
    createAdminAccount(input: $input)
  }
`;
export type CreateAdminAccountMutationFn = Apollo.MutationFunction<
  CreateAdminAccountMutation,
  CreateAdminAccountMutationVariables
>;
export function useCreateAdminAccountMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateAdminAccountMutation,
    CreateAdminAccountMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateAdminAccountMutation,
    CreateAdminAccountMutationVariables
  >(CreateAdminAccountDocument, options);
}
export type CreateAdminAccountMutationHookResult = ReturnType<
  typeof useCreateAdminAccountMutation
>;
export type CreateAdminAccountMutationResult =
  Apollo.MutationResult<CreateAdminAccountMutation>;
export type CreateAdminAccountMutationOptions = Apollo.BaseMutationOptions<
  CreateAdminAccountMutation,
  CreateAdminAccountMutationVariables
>;
export const SelfDocument = /*#__PURE__*/ gql`
  query Self {
    self {
      _id
      emailAddress
      role
    }
  }
`;
export function useSelfQuery(
  baseOptions?: Apollo.QueryHookOptions<SelfQuery, SelfQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<SelfQuery, SelfQueryVariables>(SelfDocument, options);
}
export function useSelfLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SelfQuery, SelfQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<SelfQuery, SelfQueryVariables>(
    SelfDocument,
    options,
  );
}
// @ts-ignore
export function useSelfSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<SelfQuery, SelfQueryVariables>,
): Apollo.UseSuspenseQueryResult<SelfQuery, SelfQueryVariables>;
export function useSelfSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<SelfQuery, SelfQueryVariables>,
): Apollo.UseSuspenseQueryResult<SelfQuery | undefined, SelfQueryVariables>;
export function useSelfSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<SelfQuery, SelfQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<SelfQuery, SelfQueryVariables>(
    SelfDocument,
    options,
  );
}
export type SelfQueryHookResult = ReturnType<typeof useSelfQuery>;
export type SelfLazyQueryHookResult = ReturnType<typeof useSelfLazyQuery>;
export type SelfSuspenseQueryHookResult = ReturnType<
  typeof useSelfSuspenseQuery
>;
export type SelfQueryResult = Apollo.QueryResult<SelfQuery, SelfQueryVariables>;
export function refetchSelfQuery(variables?: SelfQueryVariables) {
  return { query: SelfDocument, variables: variables };
}
export const UpdateCartItemDocument = /*#__PURE__*/ gql`
  mutation UpdateCartItem($input: UpdateCartItemInput!) {
    updateCartItem(input: $input)
  }
`;
export type UpdateCartItemMutationFn = Apollo.MutationFunction<
  UpdateCartItemMutation,
  UpdateCartItemMutationVariables
>;
export function useUpdateCartItemMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateCartItemMutation,
    UpdateCartItemMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateCartItemMutation,
    UpdateCartItemMutationVariables
  >(UpdateCartItemDocument, options);
}
export type UpdateCartItemMutationHookResult = ReturnType<
  typeof useUpdateCartItemMutation
>;
export type UpdateCartItemMutationResult =
  Apollo.MutationResult<UpdateCartItemMutation>;
export type UpdateCartItemMutationOptions = Apollo.BaseMutationOptions<
  UpdateCartItemMutation,
  UpdateCartItemMutationVariables
>;
export const CartDocument = /*#__PURE__*/ gql`
  query Cart($id: ObjectID!) {
    cart(id: $id) {
      _id
      items {
        productId
        quantity
        unitPrice
        totalPrice
      }
      subtotal
      tax
      status
      createdAt
      updatedAt
    }
  }
`;
export function useCartQuery(
  baseOptions: Apollo.QueryHookOptions<CartQuery, CartQueryVariables> &
    ({ variables: CartQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<CartQuery, CartQueryVariables>(CartDocument, options);
}
export function useCartLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<CartQuery, CartQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<CartQuery, CartQueryVariables>(
    CartDocument,
    options,
  );
}
// @ts-ignore
export function useCartSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<CartQuery, CartQueryVariables>,
): Apollo.UseSuspenseQueryResult<CartQuery, CartQueryVariables>;
export function useCartSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<CartQuery, CartQueryVariables>,
): Apollo.UseSuspenseQueryResult<CartQuery | undefined, CartQueryVariables>;
export function useCartSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<CartQuery, CartQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<CartQuery, CartQueryVariables>(
    CartDocument,
    options,
  );
}
export type CartQueryHookResult = ReturnType<typeof useCartQuery>;
export type CartLazyQueryHookResult = ReturnType<typeof useCartLazyQuery>;
export type CartSuspenseQueryHookResult = ReturnType<
  typeof useCartSuspenseQuery
>;
export type CartQueryResult = Apollo.QueryResult<CartQuery, CartQueryVariables>;
export function refetchCartQuery(variables: CartQueryVariables) {
  return { query: CartDocument, variables: variables };
}
export const MyOrdersDocument = /*#__PURE__*/ gql`
  query MyOrders {
    myOrders {
      _id
      items {
        productId
        quantity
        unitPrice
        totalPrice
      }
      shippingOption {
        type
        label
        description
        estimatedDays
        fee
      }
      subtotal
      tax
      shippingFee
      total
      status
      createdAt
    }
  }
`;
export function useMyOrdersQuery(
  baseOptions?: Apollo.QueryHookOptions<MyOrdersQuery, MyOrdersQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<MyOrdersQuery, MyOrdersQueryVariables>(
    MyOrdersDocument,
    options,
  );
}
export function useMyOrdersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    MyOrdersQuery,
    MyOrdersQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<MyOrdersQuery, MyOrdersQueryVariables>(
    MyOrdersDocument,
    options,
  );
}
// @ts-ignore
export function useMyOrdersSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    MyOrdersQuery,
    MyOrdersQueryVariables
  >,
): Apollo.UseSuspenseQueryResult<MyOrdersQuery, MyOrdersQueryVariables>;
export function useMyOrdersSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<MyOrdersQuery, MyOrdersQueryVariables>,
): Apollo.UseSuspenseQueryResult<
  MyOrdersQuery | undefined,
  MyOrdersQueryVariables
>;
export function useMyOrdersSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<MyOrdersQuery, MyOrdersQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<MyOrdersQuery, MyOrdersQueryVariables>(
    MyOrdersDocument,
    options,
  );
}
export type MyOrdersQueryHookResult = ReturnType<typeof useMyOrdersQuery>;
export type MyOrdersLazyQueryHookResult = ReturnType<
  typeof useMyOrdersLazyQuery
>;
export type MyOrdersSuspenseQueryHookResult = ReturnType<
  typeof useMyOrdersSuspenseQuery
>;
export type MyOrdersQueryResult = Apollo.QueryResult<
  MyOrdersQuery,
  MyOrdersQueryVariables
>;
export function refetchMyOrdersQuery(variables?: MyOrdersQueryVariables) {
  return { query: MyOrdersDocument, variables: variables };
}
export const ShippingOptionsDocument = /*#__PURE__*/ gql`
  query ShippingOptions {
    shippingOptions {
      _id
      type
      label
      description
      fee
      estimatedDays
    }
  }
`;
export function useShippingOptionsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    ShippingOptionsQuery,
    ShippingOptionsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ShippingOptionsQuery, ShippingOptionsQueryVariables>(
    ShippingOptionsDocument,
    options,
  );
}
export function useShippingOptionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ShippingOptionsQuery,
    ShippingOptionsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    ShippingOptionsQuery,
    ShippingOptionsQueryVariables
  >(ShippingOptionsDocument, options);
}
// @ts-ignore
export function useShippingOptionsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    ShippingOptionsQuery,
    ShippingOptionsQueryVariables
  >,
): Apollo.UseSuspenseQueryResult<
  ShippingOptionsQuery,
  ShippingOptionsQueryVariables
>;
export function useShippingOptionsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        ShippingOptionsQuery,
        ShippingOptionsQueryVariables
      >,
): Apollo.UseSuspenseQueryResult<
  ShippingOptionsQuery | undefined,
  ShippingOptionsQueryVariables
>;
export function useShippingOptionsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        ShippingOptionsQuery,
        ShippingOptionsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    ShippingOptionsQuery,
    ShippingOptionsQueryVariables
  >(ShippingOptionsDocument, options);
}
export type ShippingOptionsQueryHookResult = ReturnType<
  typeof useShippingOptionsQuery
>;
export type ShippingOptionsLazyQueryHookResult = ReturnType<
  typeof useShippingOptionsLazyQuery
>;
export type ShippingOptionsSuspenseQueryHookResult = ReturnType<
  typeof useShippingOptionsSuspenseQuery
>;
export type ShippingOptionsQueryResult = Apollo.QueryResult<
  ShippingOptionsQuery,
  ShippingOptionsQueryVariables
>;
export function refetchShippingOptionsQuery(
  variables?: ShippingOptionsQueryVariables,
) {
  return { query: ShippingOptionsDocument, variables: variables };
}
export const CheckoutDocument = /*#__PURE__*/ gql`
  mutation Checkout($input: CheckoutInput!) {
    checkout(input: $input) {
      _id
      items {
        productId
        quantity
        unitPrice
        totalPrice
      }
      shippingOption {
        type
        label
        description
        estimatedDays
        fee
      }
      paymentMethod {
        type
      }
      subtotal
      tax
      shippingFee
      total
      status
      createdAt
    }
  }
`;
export type CheckoutMutationFn = Apollo.MutationFunction<
  CheckoutMutation,
  CheckoutMutationVariables
>;
export function useCheckoutMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CheckoutMutation,
    CheckoutMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CheckoutMutation, CheckoutMutationVariables>(
    CheckoutDocument,
    options,
  );
}
export type CheckoutMutationHookResult = ReturnType<typeof useCheckoutMutation>;
export type CheckoutMutationResult = Apollo.MutationResult<CheckoutMutation>;
export type CheckoutMutationOptions = Apollo.BaseMutationOptions<
  CheckoutMutation,
  CheckoutMutationVariables
>;
export const RemoveFromCartDocument = /*#__PURE__*/ gql`
  mutation RemoveFromCart($input: RemoveFromCartInput!) {
    removeFromCart(input: $input)
  }
`;
export type RemoveFromCartMutationFn = Apollo.MutationFunction<
  RemoveFromCartMutation,
  RemoveFromCartMutationVariables
>;
export function useRemoveFromCartMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RemoveFromCartMutation,
    RemoveFromCartMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    RemoveFromCartMutation,
    RemoveFromCartMutationVariables
  >(RemoveFromCartDocument, options);
}
export type RemoveFromCartMutationHookResult = ReturnType<
  typeof useRemoveFromCartMutation
>;
export type RemoveFromCartMutationResult =
  Apollo.MutationResult<RemoveFromCartMutation>;
export type RemoveFromCartMutationOptions = Apollo.BaseMutationOptions<
  RemoveFromCartMutation,
  RemoveFromCartMutationVariables
>;
export const UpdateOrderStatusDocument = /*#__PURE__*/ gql`
  mutation UpdateOrderStatus($input: UpdateOrderStatusInput!) {
    updateOrderStatus(input: $input)
  }
`;
export type UpdateOrderStatusMutationFn = Apollo.MutationFunction<
  UpdateOrderStatusMutation,
  UpdateOrderStatusMutationVariables
>;
export function useUpdateOrderStatusMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateOrderStatusMutation,
    UpdateOrderStatusMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateOrderStatusMutation,
    UpdateOrderStatusMutationVariables
  >(UpdateOrderStatusDocument, options);
}
export type UpdateOrderStatusMutationHookResult = ReturnType<
  typeof useUpdateOrderStatusMutation
>;
export type UpdateOrderStatusMutationResult =
  Apollo.MutationResult<UpdateOrderStatusMutation>;
export type UpdateOrderStatusMutationOptions = Apollo.BaseMutationOptions<
  UpdateOrderStatusMutation,
  UpdateOrderStatusMutationVariables
>;
export const UploadFileDocument = /*#__PURE__*/ gql`
  mutation UploadFile($file: Upload!) {
    uploadFile(file: $file)
  }
`;
export type UploadFileMutationFn = Apollo.MutationFunction<
  UploadFileMutation,
  UploadFileMutationVariables
>;
export function useUploadFileMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UploadFileMutation,
    UploadFileMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UploadFileMutation, UploadFileMutationVariables>(
    UploadFileDocument,
    options,
  );
}
export type UploadFileMutationHookResult = ReturnType<
  typeof useUploadFileMutation
>;
export type UploadFileMutationResult =
  Apollo.MutationResult<UploadFileMutation>;
export type UploadFileMutationOptions = Apollo.BaseMutationOptions<
  UploadFileMutation,
  UploadFileMutationVariables
>;
export const LicenseDocument = /*#__PURE__*/ gql`
  mutation License($input: LicenseInput!) {
    createLicense(input: $input)
  }
`;
export type LicenseMutationFn = Apollo.MutationFunction<
  LicenseMutation,
  LicenseMutationVariables
>;
export function useLicenseMutation(
  baseOptions?: Apollo.MutationHookOptions<
    LicenseMutation,
    LicenseMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<LicenseMutation, LicenseMutationVariables>(
    LicenseDocument,
    options,
  );
}
export type LicenseMutationHookResult = ReturnType<typeof useLicenseMutation>;
export type LicenseMutationResult = Apollo.MutationResult<LicenseMutation>;
export type LicenseMutationOptions = Apollo.BaseMutationOptions<
  LicenseMutation,
  LicenseMutationVariables
>;
export const CreateGcashPaymentDocument = /*#__PURE__*/ gql`
  mutation CreateGcashPayment($input: CreateGcashPaymentInput) {
    createGcashPayment(input: $input) {
      reference_id
      actions {
        value
      }
      payment_request_id
    }
  }
`;
export type CreateGcashPaymentMutationFn = Apollo.MutationFunction<
  CreateGcashPaymentMutation,
  CreateGcashPaymentMutationVariables
>;
export function useCreateGcashPaymentMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateGcashPaymentMutation,
    CreateGcashPaymentMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateGcashPaymentMutation,
    CreateGcashPaymentMutationVariables
  >(CreateGcashPaymentDocument, options);
}
export type CreateGcashPaymentMutationHookResult = ReturnType<
  typeof useCreateGcashPaymentMutation
>;
export type CreateGcashPaymentMutationResult =
  Apollo.MutationResult<CreateGcashPaymentMutation>;
export type CreateGcashPaymentMutationOptions = Apollo.BaseMutationOptions<
  CreateGcashPaymentMutation,
  CreateGcashPaymentMutationVariables
>;
export const ProductsDocument = /*#__PURE__*/ gql`
  query Products($first: Int, $after: Cursor, $filter: ProductsFilterInput) {
    products(first: $first, after: $after, filter: $filter) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        cursor
        node {
          ...ProductCoreData
        }
      }
      totalCount
    }
  }
  ${ProductCoreDataFragmentDoc}
`;
export function useProductsQuery(
  baseOptions?: Apollo.QueryHookOptions<ProductsQuery, ProductsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ProductsQuery, ProductsQueryVariables>(
    ProductsDocument,
    options,
  );
}
export function useProductsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ProductsQuery,
    ProductsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ProductsQuery, ProductsQueryVariables>(
    ProductsDocument,
    options,
  );
}
// @ts-ignore
export function useProductsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    ProductsQuery,
    ProductsQueryVariables
  >,
): Apollo.UseSuspenseQueryResult<ProductsQuery, ProductsQueryVariables>;
export function useProductsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<ProductsQuery, ProductsQueryVariables>,
): Apollo.UseSuspenseQueryResult<
  ProductsQuery | undefined,
  ProductsQueryVariables
>;
export function useProductsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<ProductsQuery, ProductsQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<ProductsQuery, ProductsQueryVariables>(
    ProductsDocument,
    options,
  );
}
export type ProductsQueryHookResult = ReturnType<typeof useProductsQuery>;
export type ProductsLazyQueryHookResult = ReturnType<
  typeof useProductsLazyQuery
>;
export type ProductsSuspenseQueryHookResult = ReturnType<
  typeof useProductsSuspenseQuery
>;
export type ProductsQueryResult = Apollo.QueryResult<
  ProductsQuery,
  ProductsQueryVariables
>;
export function refetchProductsQuery(variables?: ProductsQueryVariables) {
  return { query: ProductsDocument, variables: variables };
}
export const CreateProductDocument = /*#__PURE__*/ gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input)
  }
`;
export type CreateProductMutationFn = Apollo.MutationFunction<
  CreateProductMutation,
  CreateProductMutationVariables
>;
export function useCreateProductMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateProductMutation,
    CreateProductMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateProductMutation,
    CreateProductMutationVariables
  >(CreateProductDocument, options);
}
export type CreateProductMutationHookResult = ReturnType<
  typeof useCreateProductMutation
>;
export type CreateProductMutationResult =
  Apollo.MutationResult<CreateProductMutation>;
export type CreateProductMutationOptions = Apollo.BaseMutationOptions<
  CreateProductMutation,
  CreateProductMutationVariables
>;
export const UpdateProductDocument = /*#__PURE__*/ gql`
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input)
  }
`;
export type UpdateProductMutationFn = Apollo.MutationFunction<
  UpdateProductMutation,
  UpdateProductMutationVariables
>;
export function useUpdateProductMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateProductMutation,
    UpdateProductMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateProductMutation,
    UpdateProductMutationVariables
  >(UpdateProductDocument, options);
}
export type UpdateProductMutationHookResult = ReturnType<
  typeof useUpdateProductMutation
>;
export type UpdateProductMutationResult =
  Apollo.MutationResult<UpdateProductMutation>;
export type UpdateProductMutationOptions = Apollo.BaseMutationOptions<
  UpdateProductMutation,
  UpdateProductMutationVariables
>;
export const DeleteProductDocument = /*#__PURE__*/ gql`
  mutation DeleteProduct($input: DeleteProductInput!) {
    deleteProduct(input: $input)
  }
`;
export type DeleteProductMutationFn = Apollo.MutationFunction<
  DeleteProductMutation,
  DeleteProductMutationVariables
>;
export function useDeleteProductMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteProductMutation,
    DeleteProductMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    DeleteProductMutation,
    DeleteProductMutationVariables
  >(DeleteProductDocument, options);
}
export type DeleteProductMutationHookResult = ReturnType<
  typeof useDeleteProductMutation
>;
export type DeleteProductMutationResult =
  Apollo.MutationResult<DeleteProductMutation>;
export type DeleteProductMutationOptions = Apollo.BaseMutationOptions<
  DeleteProductMutation,
  DeleteProductMutationVariables
>;
export const ConfigDocument = /*#__PURE__*/ gql`
  query Config {
    config {
      _id
      highPointsThreshold
      topSoldThreshold
      carouselItems
    }
  }
`;
export function useConfigQuery(
  baseOptions?: Apollo.QueryHookOptions<ConfigQuery, ConfigQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ConfigQuery, ConfigQueryVariables>(
    ConfigDocument,
    options,
  );
}
export function useConfigLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ConfigQuery, ConfigQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ConfigQuery, ConfigQueryVariables>(
    ConfigDocument,
    options,
  );
}
// @ts-ignore
export function useConfigSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    ConfigQuery,
    ConfigQueryVariables
  >,
): Apollo.UseSuspenseQueryResult<ConfigQuery, ConfigQueryVariables>;
export function useConfigSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<ConfigQuery, ConfigQueryVariables>,
): Apollo.UseSuspenseQueryResult<ConfigQuery | undefined, ConfigQueryVariables>;
export function useConfigSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<ConfigQuery, ConfigQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<ConfigQuery, ConfigQueryVariables>(
    ConfigDocument,
    options,
  );
}
export type ConfigQueryHookResult = ReturnType<typeof useConfigQuery>;
export type ConfigLazyQueryHookResult = ReturnType<typeof useConfigLazyQuery>;
export type ConfigSuspenseQueryHookResult = ReturnType<
  typeof useConfigSuspenseQuery
>;
export type ConfigQueryResult = Apollo.QueryResult<
  ConfigQuery,
  ConfigQueryVariables
>;
export function refetchConfigQuery(variables?: ConfigQueryVariables) {
  return { query: ConfigDocument, variables: variables };
}
export const CreateConfigDocument = /*#__PURE__*/ gql`
  mutation CreateConfig($input: CreateConfigInput!) {
    createConfig(input: $input)
  }
`;
export type CreateConfigMutationFn = Apollo.MutationFunction<
  CreateConfigMutation,
  CreateConfigMutationVariables
>;
export function useCreateConfigMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateConfigMutation,
    CreateConfigMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateConfigMutation,
    CreateConfigMutationVariables
  >(CreateConfigDocument, options);
}
export type CreateConfigMutationHookResult = ReturnType<
  typeof useCreateConfigMutation
>;
export type CreateConfigMutationResult =
  Apollo.MutationResult<CreateConfigMutation>;
export type CreateConfigMutationOptions = Apollo.BaseMutationOptions<
  CreateConfigMutation,
  CreateConfigMutationVariables
>;
export const UpdateConfigDocument = /*#__PURE__*/ gql`
  mutation UpdateConfig($input: UpdateConfigInput!) {
    updateConfig(input: $input)
  }
`;
export type UpdateConfigMutationFn = Apollo.MutationFunction<
  UpdateConfigMutation,
  UpdateConfigMutationVariables
>;
export function useUpdateConfigMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateConfigMutation,
    UpdateConfigMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateConfigMutation,
    UpdateConfigMutationVariables
  >(UpdateConfigDocument, options);
}
export type UpdateConfigMutationHookResult = ReturnType<
  typeof useUpdateConfigMutation
>;
export type UpdateConfigMutationResult =
  Apollo.MutationResult<UpdateConfigMutation>;
export type UpdateConfigMutationOptions = Apollo.BaseMutationOptions<
  UpdateConfigMutation,
  UpdateConfigMutationVariables
>;
export const HighPointProductsDocument = /*#__PURE__*/ gql`
  query HighPointProducts(
    $first: Int
    $after: Cursor
    $filter: ProductsFilterInput
  ) {
    highPointProducts(first: $first, after: $after, filter: $filter) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        cursor
        node {
          ...ProductCoreData
        }
      }
      totalCount
    }
  }
  ${ProductCoreDataFragmentDoc}
`;
export function useHighPointProductsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    HighPointProductsQuery,
    HighPointProductsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    HighPointProductsQuery,
    HighPointProductsQueryVariables
  >(HighPointProductsDocument, options);
}
export function useHighPointProductsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    HighPointProductsQuery,
    HighPointProductsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    HighPointProductsQuery,
    HighPointProductsQueryVariables
  >(HighPointProductsDocument, options);
}
// @ts-ignore
export function useHighPointProductsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    HighPointProductsQuery,
    HighPointProductsQueryVariables
  >,
): Apollo.UseSuspenseQueryResult<
  HighPointProductsQuery,
  HighPointProductsQueryVariables
>;
export function useHighPointProductsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        HighPointProductsQuery,
        HighPointProductsQueryVariables
      >,
): Apollo.UseSuspenseQueryResult<
  HighPointProductsQuery | undefined,
  HighPointProductsQueryVariables
>;
export function useHighPointProductsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        HighPointProductsQuery,
        HighPointProductsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    HighPointProductsQuery,
    HighPointProductsQueryVariables
  >(HighPointProductsDocument, options);
}
export type HighPointProductsQueryHookResult = ReturnType<
  typeof useHighPointProductsQuery
>;
export type HighPointProductsLazyQueryHookResult = ReturnType<
  typeof useHighPointProductsLazyQuery
>;
export type HighPointProductsSuspenseQueryHookResult = ReturnType<
  typeof useHighPointProductsSuspenseQuery
>;
export type HighPointProductsQueryResult = Apollo.QueryResult<
  HighPointProductsQuery,
  HighPointProductsQueryVariables
>;
export function refetchHighPointProductsQuery(
  variables?: HighPointProductsQueryVariables,
) {
  return { query: HighPointProductsDocument, variables: variables };
}
export const SearchProductByNameDocument = /*#__PURE__*/ gql`
  query SearchProductByName($search: String!, $first: Int, $after: Cursor) {
    searchProductByName(search: $search, first: $first, after: $after) {
      ...ProductCoreData
    }
  }
  ${ProductCoreDataFragmentDoc}
`;
export function useSearchProductByNameQuery(
  baseOptions: Apollo.QueryHookOptions<
    SearchProductByNameQuery,
    SearchProductByNameQueryVariables
  > &
    (
      | { variables: SearchProductByNameQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    SearchProductByNameQuery,
    SearchProductByNameQueryVariables
  >(SearchProductByNameDocument, options);
}
export function useSearchProductByNameLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    SearchProductByNameQuery,
    SearchProductByNameQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    SearchProductByNameQuery,
    SearchProductByNameQueryVariables
  >(SearchProductByNameDocument, options);
}
// @ts-ignore
export function useSearchProductByNameSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    SearchProductByNameQuery,
    SearchProductByNameQueryVariables
  >,
): Apollo.UseSuspenseQueryResult<
  SearchProductByNameQuery,
  SearchProductByNameQueryVariables
>;
export function useSearchProductByNameSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        SearchProductByNameQuery,
        SearchProductByNameQueryVariables
      >,
): Apollo.UseSuspenseQueryResult<
  SearchProductByNameQuery | undefined,
  SearchProductByNameQueryVariables
>;
export function useSearchProductByNameSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        SearchProductByNameQuery,
        SearchProductByNameQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    SearchProductByNameQuery,
    SearchProductByNameQueryVariables
  >(SearchProductByNameDocument, options);
}
export type SearchProductByNameQueryHookResult = ReturnType<
  typeof useSearchProductByNameQuery
>;
export type SearchProductByNameLazyQueryHookResult = ReturnType<
  typeof useSearchProductByNameLazyQuery
>;
export type SearchProductByNameSuspenseQueryHookResult = ReturnType<
  typeof useSearchProductByNameSuspenseQuery
>;
export type SearchProductByNameQueryResult = Apollo.QueryResult<
  SearchProductByNameQuery,
  SearchProductByNameQueryVariables
>;
export function refetchSearchProductByNameQuery(
  variables: SearchProductByNameQueryVariables,
) {
  return { query: SearchProductByNameDocument, variables: variables };
}
