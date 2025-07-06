import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  UriFunction,
} from '@apollo/client';
import invariant from 'tiny-invariant';
import { apolloCache } from './cache';

const portalApi = process.env.NEXT_PUBLIC_PORTAL_API;

invariant(portalApi, "'NEXT_PUBLIC_PORTAL_API' is missing");

const portalLink = new HttpLink({ uri: createUrl(portalApi) });

export const apolloLink = ApolloLink.split(
  () => true,
  ApolloLink.from([portalLink])
);

export const apolloClient = new ApolloClient({
  link: apolloLink,
  cache: apolloCache,
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'ignore',
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
    },
    query: {
      errorPolicy: 'ignore',
    },
  },
  connectToDevTools: false,
});

function createUrl(url: string): UriFunction {
  invariant(URL.canParse(url));

  return (operation) => {
    const u = new URL(url);
    u.searchParams.set('_q', operation.operationName);
    return u.toString();
  };
}
