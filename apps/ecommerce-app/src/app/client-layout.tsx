'use client';

import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '@global';
import { PropsWithChildren } from 'react';

export const ClientApolloProvider = (props: PropsWithChildren) => {
  return (
    <ApolloProvider client={apolloClient}>{props.children}</ApolloProvider>
  );
};
