import { TypedDocumentNode } from '@apollo/client/core';
import gql from 'graphql-tag';
import {
  CreateAdminAccountMutation,
  CreateAdminAccountMutationVariables,
  CreateMemberAccountMutation,
  CreateMemberAccountMutationVariables,
  SelfQuery,
  SelfQueryVariables,
} from './generated';

export const CREATE_MEMBER_ACCOUNT_MUTATION: TypedDocumentNode<
  CreateMemberAccountMutation,
  CreateMemberAccountMutationVariables
> = gql`
  mutation CreateMemberAccount($input: CreateAccountInput!) {
    createMemberAccount(input: $input)
  }
`;

export const CREATE_ADMIN_ACCOUNT_MUTATION: TypedDocumentNode<
  CreateAdminAccountMutation,
  CreateAdminAccountMutationVariables
> = gql`
  mutation CreateAdminAccount($input: CreateAccountInput!) {
    createAdminAccount(input: $input)
  }
`;

export const SELF_QUERY: TypedDocumentNode<SelfQuery, SelfQueryVariables> = gql`
  query Self {
    self {
      _id
      emailAddress
      role
    }
  }
`;
