import { TypedDocumentNode } from '@apollo/client/core';
import gql from 'graphql-tag';
import {
  CreateGcashPaymentMutation,
  CreateGcashPaymentMutationVariables,
} from './generated';

export const CREATE_GCASH_PAYMENT_MUTATION: TypedDocumentNode<
  CreateGcashPaymentMutation,
  CreateGcashPaymentMutationVariables
> = gql`
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
