import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
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
      <Pagination.PrevTrigger>
        <LuChevronLeft /> Previous
      </Pagination.PrevTrigger>

      <Pagination.NextTrigger>
        Next <LuChevronRight />
      </Pagination.NextTrigger>
    </Pagination.Root>
  );
}
