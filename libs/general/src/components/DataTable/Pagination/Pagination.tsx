import { ButtonGroup, Flex, IconButton, Pagination } from '@chakra-ui/react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { useDataTableContext } from '../DataTableContext';

export default function TablePagination() {
  const { table } = useDataTableContext();

  return (
    <Pagination.Root
      count={table.pagination?.totalItems}
      pageSize={table.pagination?.pageSize}
      defaultPage={1}
      page={table.pagination?.page}
    >
      <ButtonGroup
        variant="plain"
        w="full"
        display={'flex'}
        justifyContent={'space-between'}
        size="sm"
      >
        <Pagination.PrevTrigger>
          <IconButton color={'#667085'}>
            <LuChevronLeft />
          </IconButton>
        </Pagination.PrevTrigger>

        <Flex>
          <Pagination.Items
            ellipsis={
              <IconButton color={'#667085'} bg="none" boxShadow={'none'}>
                ...
              </IconButton>
            }
            color="#667085"
            render={(page) => (
              <IconButton
                color={'#667085'}
                bg="none"
                boxShadow={'none'}
                _selected={{ color: 'colors.primary.500', bg: '#F9FAFB' }}
                variant={'surface'}
                onClick={() => table.pagination?.onPageChange?.(page.value)}
              >
                {page.value}
              </IconButton>
            )}
          />
        </Flex>

        <Pagination.NextTrigger>
          <IconButton color={'#667085'}>
            <LuChevronRight />
          </IconButton>
        </Pagination.NextTrigger>
      </ButtonGroup>
    </Pagination.Root>
  );
}
