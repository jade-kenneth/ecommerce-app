import { TypedDocumentNode } from '@apollo/client/core';
import gql from 'graphql-tag';
import {
  ConfigQuery,
  ConfigQueryVariables,
  CreateConfigMutation,
  CreateConfigMutationVariables,
  CreateProductMutation,
  CreateProductMutationVariables,
  DeleteProductMutation,
  DeleteProductMutationVariables,
  HighPointProductsQuery,
  HighPointProductsQueryVariables,
  ProductCoreDataFragment,
  ProductReviewsQuery,
  ProductReviewsQueryVariables,
  ProductsQuery,
  ProductsQueryVariables,
  SearchProductByNameQuery,
  SearchProductByNameQueryVariables,
  UpdateConfigMutation,
  UpdateConfigMutationVariables,
  UpdateProductMutation,
  UpdateProductMutationVariables,
} from './generated';

export const PRODUCT_CORE_DATA_FRAGMENT: TypedDocumentNode<
  ProductCoreDataFragment,
  Record<string, never>
> = gql`
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
    avgRating
  }
`;

export const PRODUCTS_QUERY: TypedDocumentNode<
  ProductsQuery,
  ProductsQueryVariables
> = gql`
  ${PRODUCT_CORE_DATA_FRAGMENT}
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
`;

export const PRODUCT_REVIEWS_QUERY: TypedDocumentNode<
  ProductReviewsQuery,
  ProductReviewsQueryVariables
> = gql`
  query ProductReviews($productId: ObjectID!) {
    productReviews(productId: $productId) {
      _id
      productId
      accountId
      orderId
      rating
      message
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_PRODUCT_MUTATION: TypedDocumentNode<
  CreateProductMutation,
  CreateProductMutationVariables
> = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input)
  }
`;

export const UPDATE_PRODUCT_MUTATION: TypedDocumentNode<
  UpdateProductMutation,
  UpdateProductMutationVariables
> = gql`
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input)
  }
`;

export const DELETE_PRODUCT_MUTATION: TypedDocumentNode<
  DeleteProductMutation,
  DeleteProductMutationVariables
> = gql`
  mutation DeleteProduct($input: DeleteProductInput!) {
    deleteProduct(input: $input)
  }
`;

export const CONFIG_QUERY: TypedDocumentNode<
  ConfigQuery,
  ConfigQueryVariables
> = gql`
  query Config {
    config {
      _id
      highPointsThreshold
      topSoldThreshold
      carouselItems
    }
  }
`;

export const CREATE_CONFIG_MUTATION: TypedDocumentNode<
  CreateConfigMutation,
  CreateConfigMutationVariables
> = gql`
  mutation CreateConfig($input: CreateConfigInput!) {
    createConfig(input: $input)
  }
`;

export const UPDATE_CONFIG_MUTATION: TypedDocumentNode<
  UpdateConfigMutation,
  UpdateConfigMutationVariables
> = gql`
  mutation UpdateConfig($input: UpdateConfigInput!) {
    updateConfig(input: $input)
  }
`;

export const HIGH_POINT_PRODUCTS_QUERY: TypedDocumentNode<
  HighPointProductsQuery,
  HighPointProductsQueryVariables
> = gql`
  ${PRODUCT_CORE_DATA_FRAGMENT}
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
`;

export const SEARCH_PRODUCT_BY_NAME_QUERY: TypedDocumentNode<
  SearchProductByNameQuery,
  SearchProductByNameQueryVariables
> = gql`
  ${PRODUCT_CORE_DATA_FRAGMENT}
  query SearchProductByName($search: String!, $first: Int, $after: Cursor) {
    searchProductByName(search: $search, first: $first, after: $after) {
      ...ProductCoreData
    }
  }
`;
