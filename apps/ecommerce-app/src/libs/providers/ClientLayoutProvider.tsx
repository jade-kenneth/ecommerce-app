'use client';

import { ApolloProvider } from '@apollo/client';

import { PropsWithChildren } from 'react';
import { apolloClient } from '~/config/client';

export const ClientApolloProvider = (props: PropsWithChildren) => {
  return (
    <ApolloProvider client={apolloClient}>{props.children}</ApolloProvider>
  );
};
