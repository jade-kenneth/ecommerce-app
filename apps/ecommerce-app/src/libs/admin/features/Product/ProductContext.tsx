import { createContext } from '../../../global/src';
import { ProductCoreDataFragment } from '../../../global/src/graphql/generated';

export const [ProductProvider, useProductProviderContext] =
  createContext<ProductCoreDataFragment>();
