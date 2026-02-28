'use client';

import { ApolloProvider } from '@apollo/client';

import { apolloClient } from 'libs/config/src/client';
import { PropsWithChildren } from 'react';

export const ClientApolloProvider = (props: PropsWithChildren) => {
  return (
    <ApolloProvider client={apolloClient}>{props.children}</ApolloProvider>
  );
};
