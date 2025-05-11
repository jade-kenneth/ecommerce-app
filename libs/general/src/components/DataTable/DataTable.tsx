'use client';
import { FilterEntries, useDataTable, UseDataTableProps } from './useDataTable';

type DatTableProps<T, F extends FilterEntries> = UseDataTableProps<T, F> & {
  id: string;
};
export function DataTable<T, F extends FilterEntries>({
  columns,
  items,
  loading,
  onRowSelect,
  filtering,
  pagination,
  sorting,
}: DatTableProps<T, F>) {
  const datatable = useDataTable({
    columns,
    items,
    filtering,
    loading,
    onRowSelect,
    pagination,
    sorting,
  });

  return <p>Table</p>;
}
