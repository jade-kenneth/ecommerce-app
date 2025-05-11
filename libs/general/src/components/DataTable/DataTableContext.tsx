import { createContext } from '../../utils';
import { UseDataTableReturn } from './useDataTable';

export const [DataTableProvider, useDataTableContext] =
  createContext<UseDataTableReturn>({
    name: 'DataTableContext',
  });
