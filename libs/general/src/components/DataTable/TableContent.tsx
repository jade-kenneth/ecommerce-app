import { Flex, Table, Text } from '@chakra-ui/react';
import { useDataTableContext } from './DataTableContext';

export function TableContent() {
  const datatable = useDataTableContext();
  return (
    <Flex
      direction={'column'}
      border="1px solid #F2F2F2"
      borderRadius="8px"
      gap="4"
    >
      <Flex pt={3} px={3}>
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
    </Flex>
  );
}
