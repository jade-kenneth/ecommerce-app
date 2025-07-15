import { ProductCoreDataFragment } from '@graphql/products';
import { createContext } from '@utils';

export const [ProductProvider, useProductProviderContext] =
  createContext<ProductCoreDataFragment>();
