import { TypedDocumentNode } from '@apollo/client/core';
import gql from 'graphql-tag';
import { UploadFileMutation, UploadFileMutationVariables } from './generated';

export const UPLOAD_FILE_MUTATION: TypedDocumentNode<
  UploadFileMutation,
  UploadFileMutationVariables
> = gql`
  mutation UploadFile($file: Upload!) {
    uploadFile(file: $file)
  }
`;
