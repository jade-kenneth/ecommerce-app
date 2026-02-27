import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  UriFunction,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import invariant from 'tiny-invariant';

import { getSession } from '~/providers/AuthProvider/service';
import { apolloCache } from './cache';

const portalApi = process.env.NEXT_PUBLIC_PORTAL_API;

const AUTH_LINK = setContext(async (_req, ctx) => {
  if (typeof window === 'undefined') return ctx;
  const session = await getSession();
  if (session.status === 'authenticated') {
    return {
      ...ctx,
      headers: {
        Role: session.role,
        Authorization: `Bearer ${session.accessToken}`,
      },
    };
  }
  return ctx;
});

invariant(portalApi, "'NEXT_PUBLIC_PORTAL_API' is missing");

const PORTAL_LINK = new HttpLink({ uri: createUrl(portalApi) });
const BASE_LINK = ApolloLink.from([AUTH_LINK]);

export const apolloLink = ApolloLink.split(
  () => true,
  ApolloLink.from([BASE_LINK.concat(PORTAL_LINK)]),
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
});

function createUrl(url: string): UriFunction {
  invariant(URL.canParse(url));

  return (operation) => {
    const u = new URL(url);
    u.searchParams.set('_q', operation.operationName);
    return u.toString();
  };
}
