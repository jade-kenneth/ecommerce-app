/* eslint-disable */
// @ts-nocheck
// Generated file
// Last modified: Sat, 14 Jun 2025 06:58:36 GMT
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
  DateTime: { input: string | Date; output: string };
  JSON: { input: Record<string, any>; output: Record<string, any> };
  ObjectID: { input: string; output: string };
};

export enum CategoryType {
  Dairy = 'DAIRY',
  Fish = 'FISH',
  Fruit = 'FRUIT',
  Sweets = 'SWEETS',
  Vegetables = 'VEGETABLES',
}

export type CreateProductInput = {
  category?: InputMaybe<Array<CategoryType>>;
  dateAdded?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  discount?: InputMaybe<Scalars['Int']['input']>;
  flashSale?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  pieces?: InputMaybe<Scalars['Int']['input']>;
  points?: InputMaybe<Scalars['Int']['input']>;
  price?: InputMaybe<Scalars['Int']['input']>;
  reservation?: InputMaybe<ReservationType>;
  sold?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<StatusType>;
  thumbnail?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<CategoryType>;
  variations?: InputMaybe<Array<KeyValuePairInput>>;
  vouchers?: InputMaybe<Array<VoucherInput>>;
};

export type KeyValuePairInput = {
  key: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export enum ReservationType {
  Available = 'AVAILABLE',
  Unavailable = 'UNAVAILABLE',
}

export enum StatusType {
  Available = 'AVAILABLE',
  OutOfStock = 'OUT_OF_STOCK',
}

export type VoucherInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['Int']['input']>;
};

export type ProductsQueryVariables = Exact<{ [key: string]: never }>;

export type ProductsQuery = {
  __typename: 'Query';
  products?: Array<{
    __typename: 'Product';
    _id: string;
    name?: string | null;
    price?: number | null;
    points?: number | null;
  }> | null;
};

export const ProductsDocument = /*#__PURE__*/ gql`
  query Products {
    products {
      _id
      name
      price
      points
    }
  }
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
