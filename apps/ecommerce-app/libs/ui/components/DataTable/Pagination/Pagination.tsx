import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as Pagination from '../../ui/Pagination';
import { useDataTableContext } from '../DataTableContext';
export default function TablePagination() {
  const { table } = useDataTableContext();

  return (
    <Pagination.Root
      count={table.pagination?.totalItems}
      pageSize={table.pagination?.pageSize}
      defaultPage={1}
      page={table.pagination?.page}
      translations={{
        nextTriggerLabel: 'Next',
        prevTriggerLabel: 'Prev',
        itemLabel: (details) => `Page ${details.page}`,
      }}
    >
      <Pagination.PrevTrigger
        onClick={() =>
          table.pagination?.onPageChange?.(table.pagination.page - 1)
        }
      >
        <ChevronLeft className="w-4 h-4" /> Previous
      </Pagination.PrevTrigger>

      <Pagination.NextTrigger
        onClick={() =>
          table.pagination?.onPageChange?.(table.pagination.page + 1)
        }
      >
        Next <ChevronRight className="w-4 h-4" />
      </Pagination.NextTrigger>
    </Pagination.Root>
  );
}
