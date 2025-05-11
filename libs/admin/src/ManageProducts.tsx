import { DataTable } from '@global';
import { useState } from 'react';

export default function ManageProducts() {
  const [page, setPage] = useState(1);
  return (
    <DataTable
      id="products"
      items={[
        {
          id: '1212',
          name: 'Product 1',
          description: 'Product 1 description',
          category: 'Category 1',
        },
        {
          id: '1212',
          name: 'Product 2',
          description: 'Product 2 description',
          category: 'Category 2',
        },
        {
          id: '1212',
          name: 'Product 3',
          description: 'Product 3 description',
          category: 'Category 3',
        },
      ]}
      columns={[
        {
          heading: 'Image',
          filterable: true,
          render: (item) => <p>{item.id}</p>,
          sortable: true,
        },
        {
          heading: 'Product Name',
          filterable: true,
          render: (item) => <p>{item.name}</p>,
          sortable: true,
        },
        {
          heading: 'Category',
          filterable: true,
          render: (item) => <p>{item.category}</p>,
          sortable: true,
        },
        {
          heading: 'Price (₱)',
          filterable: true,
          render: (item) => <p>{item.id}</p>,
          sortable: true,
        },
        {
          heading: 'Discount (%)',
          filterable: true,
          render: (item) => <p>{item.id}</p>,
          sortable: true,
        },
        {
          heading: 'Discount (%)',
          filterable: true,
          render: (item) => <p>{item.id}</p>,
          sortable: true,
        },
        {
          heading: 'Final Price (₱)',
          filterable: true,
          render: (item) => <p>{item.id}</p>,
          sortable: true,
        },
        {
          heading: 'Points',
          filterable: true,
          render: (item) => <p>{item.id}</p>,
          sortable: true,
        },
        {
          heading: 'Stock ',
          filterable: true,
          render: (item) => <p>{item.id}</p>,
          sortable: true,
        },
        {
          heading: 'Status',
          filterable: true,
          render: (item) => <p>{item.id}</p>,
          sortable: true,
        },
      ]}
      pagination={{
        page,
        pageSize: 10,
        totalItems: 100,
        onPageChange: (page) => {
          console.log(page, 'page');
          setPage(page);
        },
      }}
    />
  );
}
