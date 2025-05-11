'use client';
import { DataTableProvider } from './DataTableContext';
import TablePagination from './Pagination/Pagination';
import { TableContent } from './TableContent';
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

  return (
    <DataTableProvider value={datatable}>
      <TableContent />
      <TablePagination />
    </DataTableProvider>
  );
}
