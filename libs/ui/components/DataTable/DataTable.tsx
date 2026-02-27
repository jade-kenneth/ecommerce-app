'use client';
import { DataTableProvider } from './DataTableContext';
import TablePagination from './Pagination/Pagination';
import { TableContent } from './TableContent';
import {
  FilterEntries,
  useDataTable,
  UseDataTableProps,
  UseDataTableReturn,
} from './useDataTable';

type DatTableProps<T, F extends FilterEntries> = UseDataTableProps<T, F> & {
  id: string;
};
export function DataTable<T, F extends FilterEntries>({
  columns,
  collections,
  loading,
  onRowSelect,
  filtering,
  pagination,
  sorting,
}: DatTableProps<T, F>) {
  const datatable = useDataTable({
    columns,
    collections,
    filtering,
    loading,
    onRowSelect,
    pagination,
    sorting,
  });

  return (
    <DataTableProvider value={datatable as UseDataTableReturn}>
      <div className="w-full gap-4 relative border-[1px] border-[#F2F2F2] rounded-lg">
        <TableContent />
        <TablePagination />
      </div>
    </DataTableProvider>
  );
}
