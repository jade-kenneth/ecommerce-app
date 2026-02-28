import { ProductCoreDataFragment } from 'libs/graphql/src/generated';
import { createContext } from 'libs/utils/createContext';

export const [ProductProvider, useProductProviderContext] =
  createContext<ProductCoreDataFragment>();
