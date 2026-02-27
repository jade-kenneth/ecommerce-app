import { ListCollection } from '@ark-ui/react';
import React from 'react';

export interface Column<T> {
  heading: string;
  render: (item: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
}

export interface PaginationProps {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange?: (page: number) => void;
}

export interface SortingProps {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface TextFilter {
  type: 'text';
  value: string;
  placeholder?: string;
}

export interface SelectFilter {
  type: 'select';
  options: Array<{ label: string; value: string | number }>;
  value: string | number;
  placeholder?: string;
}

export interface NumberRangeFilter {
  type: 'numberRange';
  min: number;
  max: number;
  placeholder?: string;
}

export interface NumberRange {
  min: number;
  max: number;
}

export type Filter = TextFilter | SelectFilter | NumberRangeFilter;

export interface FilterEntries {
  [key: string]: Filter;
}

/**
 * Structure
 *
 * filter = {{
 *  name: {
 *    type: 'text',
 *    }
 * }}
 *
 */
export type GetFilterKeyValueType<T extends Filter> = T extends TextFilter
  ? string
  : T extends SelectFilter
  ? string | number
  : T extends NumberRangeFilter
  ? NumberRange
  : never;

type FilterKeyValuePairs<T extends FilterEntries> = {
  [K in keyof T]: GetFilterKeyValueType<T[K]>;
};

export interface UseFilterProps<F extends FilterEntries> {
  filters: {
    entries: F;
    onValueChange: (value: FilterKeyValuePairs<F>) => void;
  };
  filterBy?: string;
  filterValue?: string;
}

export interface TableProps<T> {
  collections: ListCollection<T>;
  columns: Column<T>[];
  loading?: boolean;
  pagination?: PaginationProps;
  sorting?: SortingProps;
  onRowSelect?: (item: T) => void;
}

type FilterStateValue = string | number | NumberRange;
type FilterState = Record<string, FilterStateValue>;

export function useFilter<F extends FilterEntries>(props?: UseFilterProps<F>) {
  const [filterValue, setFilterValue] = React.useState<string>('');
  const [filterBy, setFilterBy] = React.useState<string>('');

  const handleFilterChange = (value: string) => {
    setFilterValue(value);
  };

  const handleFilterByChange = (value: string) => {
    setFilterBy(value);
  };

  return {
    filterValue,
    filterBy,
    handleFilterChange,
    handleFilterByChange,
  };
}
export function useTable<T>({
  columns,
  collections,
  loading,
  onRowSelect,
  pagination,
  sorting,
}: TableProps<T>) {
  const [sortBy, setSortBy] = React.useState<string | null>(null);
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [filters] = React.useState<FilterState>({});

  const handleRowSelect = (item: T) => {
    onRowSelect?.(item);
  };

  return {
    columns,
    collections,
    loading,
    pagination,
    sorting,
    sortBy,
    sortOrder,
    filters,
    handleRowSelect,
  };
}
export interface UseDataTableReturn
  <
    T = unknown,
    F extends FilterEntries = FilterEntries,
  > {
  table: ReturnType<typeof useTable<T>>;
  filter: ReturnType<typeof useFilter<F>>;
}

export interface UseDataTableProps<T, F extends FilterEntries>
  extends TableProps<T> {
  filtering?: UseFilterProps<F>;
}
export function useDataTable<T, F extends FilterEntries>(
  props: UseDataTableProps<T, F>
): UseDataTableReturn<T, F> {
  const table = useTable(props);
  const filter = useFilter(props.filtering);
  return { table, filter };
}
