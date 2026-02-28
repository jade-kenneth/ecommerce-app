import { InMemoryCache } from '@apollo/client';
import { relayStylePagination } from '@apollo/client/utilities';

const keyArgs = [
  /**/
  'sort',
  'filter',
  'search',
  'member',
  'startDate',
  'endDate',
  'startDateTime',
  'endDateTime',
];
export const possibleTypes = { Query: [] };
export const apolloCache = new InMemoryCache({
  possibleTypes,
  typePolicies: {
    Query: {
      keyFields: ['id', ...keyArgs],
      fields: {
        products: {
          ...relayStylePagination(),
          keyArgs,
        },
      },
    },
    Member: {
      fields: {
        cashbackBonuses: {
          ...relayStylePagination(),
          keyArgs,
        },
      },
    },
  },
});
