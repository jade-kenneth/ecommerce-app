/* eslint-disable */
// @ts-nocheck
// Generated file
// Last modified: Thu, 18 Dec 2025 06:23:18 GMT
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
  K extends keyof T
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

export type CreateAccountInput = {
  _id?: InputMaybe<Scalars['ObjectID']['input']>;
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

export type DeleteProductInput = {
  _id: Scalars['ObjectID']['input'];
};

export type KeyValuePairInput = {
  key: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type ProductsCategoryFilterInput = {
  equal?: InputMaybe<CategoryType>;
  in?: InputMaybe<Array<CategoryType>>;
  notEqual?: InputMaybe<CategoryType>;
  notIn?: InputMaybe<Array<CategoryType>>;
};

export type ProductsFilterInput = {
  category?: InputMaybe<ProductsCategoryFilterInput>;
  status?: InputMaybe<ProductsStatusFilterInput>;
};

export type ProductsStatusFilterInput = {
  equal?: InputMaybe<StatusType>;
  in?: InputMaybe<Array<StatusType>>;
  notEqual?: InputMaybe<StatusType>;
  notIn?: InputMaybe<Array<StatusType>>;
};

export enum ReservationType {
  Available = 'AVAILABLE',
  Unavailable = 'UNAVAILABLE',
}

export enum StatusType {
  Active = 'ACTIVE',
  Draft = 'DRAFT',
  Inactive = 'INACTIVE',
  SoldOut = 'SOLD_OUT',
}

export type UpdateConfigInput = {
  _id: Scalars['ObjectID']['input'];
  carouselItems: Array<Scalars['String']['input']>;
  highPointsThreshold: Scalars['Int']['input'];
  topSoldThreshold: Scalars['Int']['input'];
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

export type UploadFileMutationVariables = Exact<{
  file: Scalars['Upload']['input'];
}>;

export type UploadFileMutation = {
  __typename: 'Mutation';
  uploadFile?: string | null;
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
  >
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
  >
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
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UploadFileMutation, UploadFileMutationVariables>(
    UploadFileDocument,
    options
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
  baseOptions?: Apollo.QueryHookOptions<ProductsQuery, ProductsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ProductsQuery, ProductsQueryVariables>(
    ProductsDocument,
    options
  );
}
export function useProductsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ProductsQuery,
    ProductsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ProductsQuery, ProductsQueryVariables>(
    ProductsDocument,
    options
  );
}
export function useProductsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<ProductsQuery, ProductsQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<ProductsQuery, ProductsQueryVariables>(
    ProductsDocument,
    options
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
  >
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
  >
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
  >
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
  baseOptions?: Apollo.QueryHookOptions<ConfigQuery, ConfigQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ConfigQuery, ConfigQueryVariables>(
    ConfigDocument,
    options
  );
}
export function useConfigLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ConfigQuery, ConfigQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ConfigQuery, ConfigQueryVariables>(
    ConfigDocument,
    options
  );
}
export function useConfigSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<ConfigQuery, ConfigQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<ConfigQuery, ConfigQueryVariables>(
    ConfigDocument,
    options
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
  >
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
  >
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
  >
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
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    HighPointProductsQuery,
    HighPointProductsQueryVariables
  >(HighPointProductsDocument, options);
}
export function useHighPointProductsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        HighPointProductsQuery,
        HighPointProductsQueryVariables
      >
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
  variables?: HighPointProductsQueryVariables
) {
  return { query: HighPointProductsDocument, variables: variables };
}
