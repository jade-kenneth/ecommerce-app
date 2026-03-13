import type { TypedDocumentNode } from '@apollo/client/core';
import gql from 'graphql-tag';

import type {
  CreateAdminAccountMutation,
  CreateAdminAccountMutationVariables,
  CreateMemberAccountMutation,
  CreateMemberAccountMutationVariables,
  LinkGoogleAccountMutation,
  LinkGoogleAccountMutationVariables,
  SelfQuery,
  SelfQueryVariables,
  UnlinkGoogleAccountMutation,
  UnlinkGoogleAccountMutationVariables,
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
      googleDetails {
        id
      }
    }
  }
`;

export const LINK_GOOGLE_ACCOUNT_MUTATION: TypedDocumentNode<
  LinkGoogleAccountMutation,
  LinkGoogleAccountMutationVariables
> = gql`
  mutation LinkGoogleAccount($input: LinkGoogleAccountInput!) {
    linkGoogleAccount(input: $input)
  }
`;

export const UNLINK_GOOGLE_ACCOUNT_MUTATION: TypedDocumentNode<
  UnlinkGoogleAccountMutation,
  UnlinkGoogleAccountMutationVariables
> = gql`
  mutation UnlinkGoogleAccount {
    unlinkGoogleAccount
  }
`;
