import { Table } from '@chakra-ui/react';
import { useDataTableContext } from './DataTableContext';

export function TableContent() {
  const datatable = useDataTableContext();
  return (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          {datatable.table.columns.map((column) => {
            return <Table.ColumnHeader>{column.heading}</Table.ColumnHeader>;
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
  );
}
