import { ProductCoreDataFragment } from '@graphql/generated';
import { createContext } from '@utils';

export const [ProductProvider, useProductProviderContext] =
  createContext<ProductCoreDataFragment>();
