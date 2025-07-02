/* eslint-disable */
// @ts-nocheck
// Generated file
// Last modified: Tue, 24 Jun 2025 08:44:47 GMT
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
};

export enum CategoryType {
  Dairy = 'DAIRY',
  Fish = 'FISH',
  Fruit = 'FRUIT',
  Sweets = 'SWEETS',
  Vegetables = 'VEGETABLES',
}

export type CreateProductInput = {
  _id: Scalars['ObjectID']['input'];
  category?: InputMaybe<Array<CategoryType>>;
  dateAdded?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  discount?: InputMaybe<Scalars['Int']['input']>;
  flashSale?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  pieces?: InputMaybe<Scalars['Int']['input']>;
  points?: InputMaybe<Scalars['Decimal']['input']>;
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

export type ProductCoreDataFragment = {
  __typename: 'Product';
  _id: string;
  name?: string | null;
  price?: number | null;
  points?: string | null;
  pieces?: number | null;
  status?: StatusType | null;
  discount?: number | null;
  category?: Array<CategoryType> | null;
};

export type ProductsQueryVariables = Exact<{
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
        name?: string | null;
        price?: number | null;
        points?: string | null;
        pieces?: number | null;
        status?: StatusType | null;
        discount?: number | null;
        category?: Array<CategoryType> | null;
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
  }
`;
export const ProductsDocument = /*#__PURE__*/ gql`
  query Products($filter: ProductsFilterInput) {
    products(filter: $filter) {
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
