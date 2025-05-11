import React from 'react';

export interface Column<T> {
  label: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
}

export interface PaginationProps {
  page: number;
  pageSize: number;
  totalItems: number;
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
  filterBy: string;
  filterValue: string;
}

export interface TableProps<T> {
  items: T[];
  columns: Column<T>[];
  loading?: boolean;
  pagination?: PaginationProps;
  sorting?: SortingProps;
  onRowSelect?: (item: T) => void;
}
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
  items,
  loading,
  onRowSelect,
  pagination,
  sorting,
}: TableProps<T>) {
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [sortBy, setSortBy] = React.useState<string | null>(null);
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = React.useState<Record<string, any>>({});

  const handleRowSelect = (item: T) => {
    onRowSelect?.(item);
  };

  return {
    columns,
    items,
    loading,
    pagination,
    sorting,
    page,
    pageSize,
    sortBy,
    sortOrder,
    filters,
    handleRowSelect,
  };
}
export interface UseDataTableReturn
  extends ReturnType<typeof useDataTable<any, FilterEntries>> {}

export interface UseDataTableProps<T, F extends FilterEntries>
  extends TableProps<T> {
  filtering?: UseFilterProps<F>;
}
export function useDataTable<T, F extends FilterEntries>(
  props: UseDataTableProps<T, F>
) {
  const table = useTable(props);
  const filter = useFilter(props.filtering);
  return { table, filter };
}
