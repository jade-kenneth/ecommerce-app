import type { TypedDocumentNode } from '@apollo/client/core';
import gql from 'graphql-tag';

import type {
  CartQuery,
  CartQueryVariables,
  CheckoutMethodSettingsQuery,
  CheckoutMethodSettingsQueryVariables,
  CheckoutMutation,
  CheckoutMutationVariables,
  CreateProductReviewMutation,
  CreateProductReviewMutationVariables,
  MyOrdersQuery,
  MyOrdersQueryVariables,
  PaymentMethodsQuery,
  PaymentMethodsQueryVariables,
  RemoveFromCartMutation,
  RemoveFromCartMutationVariables,
  ShippingOptionsQuery,
  ShippingOptionsQueryVariables,
  UpdateCartItemMutation,
  UpdateCartItemMutationVariables,
  UpdateOrderStatusMutation,
  UpdateOrderStatusMutationVariables,
  UpdatePaymentMethodStatusMutation,
  UpdatePaymentMethodStatusMutationVariables,
  UpdateShippingMethodStatusMutation,
  UpdateShippingMethodStatusMutationVariables,
} from './generated';

export const UPDATE_CART_ITEM_MUTATION: TypedDocumentNode<
  UpdateCartItemMutation,
  UpdateCartItemMutationVariables
> = gql`
  mutation UpdateCartItem($input: UpdateCartItemInput!) {
    updateCartItem(input: $input)
  }
`;

export const CART_QUERY: TypedDocumentNode<CartQuery, CartQueryVariables> = gql`
  query Cart {
    cart {
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

export const MY_ORDERS_QUERY: TypedDocumentNode<
  MyOrdersQuery,
  MyOrdersQueryVariables
> = gql`
  query MyOrders {
    myOrders {
      _id
      items {
        productId
        quantity
        unitPrice
        totalPrice
        rating
        message
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

export const SHIPPING_OPTIONS_QUERY: TypedDocumentNode<
  ShippingOptionsQuery,
  ShippingOptionsQueryVariables
> = gql`
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

export const PAYMENT_METHODS_QUERY: TypedDocumentNode<
  PaymentMethodsQuery,
  PaymentMethodsQueryVariables
> = gql`
  query PaymentMethods {
    paymentMethods {
      _id
      type
      label
      description
      isActive
    }
  }
`;

export const CHECKOUT_METHOD_SETTINGS_QUERY: TypedDocumentNode<
  CheckoutMethodSettingsQuery,
  CheckoutMethodSettingsQueryVariables
> = gql`
  query CheckoutMethodSettings {
    shippingOptions(includeInactive: true) {
      _id
      type
      label
      description
      fee
      estimatedDays
      isActive
    }
    paymentMethods(includeInactive: true) {
      _id
      type
      label
      description
      isActive
    }
  }
`;

export const CHECKOUT_MUTATION: TypedDocumentNode<
  CheckoutMutation,
  CheckoutMutationVariables
> = gql`
  mutation Checkout($input: CheckoutInput!) {
    checkout(input: $input) {
      _id
      items {
        productId
        quantity
        unitPrice
        totalPrice
        rating
        message
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

export const REMOVE_FROM_CART_MUTATION: TypedDocumentNode<
  RemoveFromCartMutation,
  RemoveFromCartMutationVariables
> = gql`
  mutation RemoveFromCart($input: RemoveFromCartInput!) {
    removeFromCart(input: $input)
  }
`;

export const UPDATE_ORDER_STATUS_MUTATION: TypedDocumentNode<
  UpdateOrderStatusMutation,
  UpdateOrderStatusMutationVariables
> = gql`
  mutation UpdateOrderStatus($input: UpdateOrderStatusInput!) {
    updateOrderStatus(input: $input)
  }
`;

export const CREATE_PRODUCT_REVIEW_MUTATION: TypedDocumentNode<
  CreateProductReviewMutation,
  CreateProductReviewMutationVariables
> = gql`
  mutation CreateProductReview($input: CreateProductReviewInput!) {
    createProductReview(input: $input) {
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

export const UPDATE_SHIPPING_METHOD_STATUS_MUTATION: TypedDocumentNode<
  UpdateShippingMethodStatusMutation,
  UpdateShippingMethodStatusMutationVariables
> = gql`
  mutation UpdateShippingMethodStatus(
    $input: UpdateShippingMethodStatusInput!
  ) {
    updateShippingMethodStatus(input: $input)
  }
`;

export const UPDATE_PAYMENT_METHOD_STATUS_MUTATION: TypedDocumentNode<
  UpdatePaymentMethodStatusMutation,
  UpdatePaymentMethodStatusMutationVariables
> = gql`
  mutation UpdatePaymentMethodStatus($input: UpdatePaymentMethodStatusInput!) {
    updatePaymentMethodStatus(input: $input)
  }
`;

// Backward-compatible alias with previous export name.
export const GET_CART_QUERY = CART_QUERY;
