import { TypedDocumentNode } from '@apollo/client/core';
import gql from 'graphql-tag';
import { LicenseMutation, LicenseMutationVariables } from './generated';

export const LICENSE_MUTATION: TypedDocumentNode<
  LicenseMutation,
  LicenseMutationVariables
> = gql`
  mutation License($input: LicenseInput!) {
    createLicense(input: $input)
  }
`;
