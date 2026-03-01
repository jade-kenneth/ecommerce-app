import { ProductCoreDataFragment } from '~/graphql/generated';
import { createContext } from '~/utils/createContext';

export const [ProductProvider, useProductProviderContext] =
  createContext<ProductCoreDataFragment>();
