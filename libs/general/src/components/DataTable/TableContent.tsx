import { Flex, Table, Text } from '@chakra-ui/react';
import { useDataTableContext } from './DataTableContext';

export function TableContent() {
  const datatable = useDataTableContext();
  return (
    <div className="block grow rounded-lg whitespace-nowrap w-full border-[1px] border-[#F2F2F2] overflow-x-auto">
      <Flex py={3} px={3}>
        <Text
          color={'colors.carbon.300'}
          fontSize={'18px'}
          fontWeight={'medium'}
        >
          Product Details
        </Text>
      </Flex>
      <Table.Root>
        <Table.Header>
          <Table.Row bg={'colors.carbon.900'}>
            {datatable.table.columns.map((column) => {
              return (
                <Table.ColumnHeader color={'colors.carbon.500'}>
                  {column.heading}
                </Table.ColumnHeader>
              );
            })}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {datatable.table.items.map((item) => {
            return (
              <Table.Row>
                {datatable.table.columns.map((column) => {
                  return <Table.Cell>{column.render(item)}</Table.Cell>;
                })}
              </Table.Row>
            );
          })}
        </Table.Body>
        <Table.Footer>
          <Table.Row></Table.Row>
        </Table.Footer>
      </Table.Root>
    </div>
  );
}
