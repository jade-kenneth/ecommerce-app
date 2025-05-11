import { DataTable } from '@global';

export default function Page() {
  return (
    <DataTable
      id="products"
      items={[
        {
          id: '1212',
          name: 'Product 1',
          description: 'Product 1 description',
        },
      ]}
      columns={[
        {
          label: 'Product',
          filterable: true,
          render: (item) => <p>{item.id}</p>,
          sortable: true,
        },
      ]}
    />
  );
}
