'use client';

import { createListCollection } from '@ark-ui/react';
import { Reducer, useReducer } from 'react';
import { TbDotsVertical } from 'react-icons/tb';
import { Badge, DataTable, Menu } from '~/components';

import { OrderStatus, useMyOrdersQuery } from '~/graphql/generated';
import { usePaginated } from '~/hooks/usePaginated';
import { capitalize } from '~/utils/capitalize';
import { numberFormatter } from '~/utils/numberFormatter';

interface PageState {
  page: number;
  pageSize: number;
}

const getStatusColorScheme = (status?: OrderStatus) => {
  switch (status) {
    case OrderStatus.Completed:
      return 'success';
    case OrderStatus.Paid:
    case OrderStatus.Shipped:
      return 'info';
    case OrderStatus.Cancelled:
      return 'danger';
    case OrderStatus.Pending:
    default:
      return 'warning';
  }
};

export const ManageOrders = () => {
  const [state, setState] = useReducer<Reducer<PageState, Partial<PageState>>>(
    (prev, next) => ({
      ...prev,
      ...next,
    }),
    { page: 1, pageSize: 10 },
  );

  const query = useMyOrdersQuery({
    fetchPolicy: 'network-only',
  });

  const orders = query.data?.myOrders ?? [];
  const { currentPage, totalPages } = usePaginated(orders, state);

  return (
    <DataTable
      id="orders"
      collections={createListCollection({
        items: currentPage,
        itemToValue: (item) => item._id,
        itemToString: (item) => item._id,
      })}
      loading={query.loading}
      columns={[
        {
          heading: 'Order ID',
          filterable: true,
          render: (item) => (
            <p className="text-xs font-mono text-carbon-25">{item._id}</p>
          ),
          sortable: true,
        },
        {
          heading: 'Items',
          filterable: true,
          render: (item) => <p>{item.items?.length ?? 0}</p>,
          sortable: true,
        },
        {
          heading: 'Shipping',
          filterable: true,
          render: (item) => <p>{item.shippingOption?.label ?? '-'}</p>,
          sortable: true,
        },
        {
          heading: 'Subtotal (₱)',
          filterable: true,
          render: (item) => (
            <p>₱{numberFormatter.format(item.subtotal, { locale: 'en-PH' })}</p>
          ),
          sortable: true,
        },
        {
          heading: 'Tax (₱)',
          filterable: true,
          render: (item) => (
            <p>₱{numberFormatter.format(item.tax, { locale: 'en-PH' })}</p>
          ),
          sortable: true,
        },
        {
          heading: 'Shipping Fee (₱)',
          filterable: true,
          render: (item) => (
            <p>
              ₱
              {numberFormatter.format(item.shippingFee, {
                locale: 'en-PH',
              })}
            </p>
          ),
          sortable: true,
        },
        {
          heading: 'Total (₱)',
          filterable: true,
          render: (item) => (
            <p className="font-semibold">
              ₱{numberFormatter.format(item.total, { locale: 'en-PH' })}
            </p>
          ),
          sortable: true,
        },
        {
          heading: 'Status',
          filterable: true,
          render: (item) => (
            <Badge.Root colorScheme={getStatusColorScheme(item.status)}>
              <Badge.Indicator asChild>
                <span className="w-2 h-2 rounded-full bg-current" />
              </Badge.Indicator>
              <Badge.Label>
                {capitalize(item.status ?? '', {
                  delimiter: capitalize.delimiters.UNDERSCORE,
                })}
              </Badge.Label>
            </Badge.Root>
          ),
          sortable: true,
        },
        {
          heading: 'Created',
          filterable: true,
          render: (item) => <p>-</p>,
          sortable: true,
        },
        {
          heading: '',
          filterable: true,
          render: () => (
            <Menu.Root>
              <Menu.Trigger>
                <TbDotsVertical />
              </Menu.Trigger>
              <Menu.Positioner>
                <Menu.Content className="min-w-[150px]">
                  <Menu.Item value="view">View details</Menu.Item>
                  <Menu.Item value="update">Update status</Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Menu.Root>
          ),
          sortable: true,
        },
      ]}
      pagination={{
        page: state.page,
        pageSize: state.pageSize,
        totalItems: orders.length,
        onPageChange: (page) => {
          if (!totalPages) {
            setState({ page: 1 });
            return;
          }
          const nextPage = Math.min(Math.max(page, 1), totalPages);
          setState({ page: nextPage });
        },
      }}
    />
  );
};
