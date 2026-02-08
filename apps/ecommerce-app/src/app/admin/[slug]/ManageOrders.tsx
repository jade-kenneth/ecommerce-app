'use client';

import { createListCollection } from '@ark-ui/react';
import {
  CheckCircle2,
  ClipboardList,
  MoreVertical,
  RefreshCcw,
  ShoppingCart,
  Wallet,
} from 'lucide-react';
import { Reducer, useMemo, useReducer } from 'react';
import { Badge, Button, DataTable, Menu } from '~/components';

import { OrderStatus, useMyOrdersQuery } from '~/graphql/generated';
import { usePaginated } from '~/hooks/usePaginated';
import { capitalize } from '~/utils/capitalize';
import { numberFormatter } from '~/utils/numberFormatter';
import { safeParseFloat } from '~/utils/safeParseFloat';

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
  const summary = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce(
      (sum, order) => sum + safeParseFloat(order.total, 0),
      0,
    );
    const pendingOrders = orders.filter(
      (order) => order.status === OrderStatus.Pending,
    ).length;
    const completedOrders = orders.filter(
      (order) => order.status === OrderStatus.Completed,
    ).length;

    return [
      {
        label: 'Total Orders',
        value: numberFormatter.format(totalOrders, { locale: 'en-PH' }),
        icon: ClipboardList,
        accent: 'text-cyan-600',
      },
      {
        label: 'Pending',
        value: numberFormatter.format(pendingOrders, { locale: 'en-PH' }),
        icon: ShoppingCart,
        accent: 'text-cyan-500',
      },
      {
        label: 'Completed',
        value: numberFormatter.format(completedOrders, { locale: 'en-PH' }),
        icon: CheckCircle2,
        accent: 'text-cyan-600',
      },
      {
        label: 'Revenue',
        value: `₱${numberFormatter.format(totalRevenue, { locale: 'en-PH' })}`,
        icon: Wallet,
        accent: 'text-cyan-700',
      },
    ];
  }, [orders]);

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900">Manage Orders</p>
            <p className="text-sm text-gray-500">
              Review order volume, revenue, and fulfillment status in one place.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-2 border-gray-200 text-gray-600 hover:bg-gray-50"
            onClick={() => query.refetch()}
          >
            <RefreshCcw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">
                  {item.label}
                </p>
                <Icon className={`h-5 w-5 ${item.accent}`} />
              </div>
              <p className="mt-3 text-2xl font-semibold text-gray-900">
                {item.value}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                {query.loading ? 'Updating…' : 'Current snapshot'}
              </p>
            </div>
          );
        })}
      </div>

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
              <p>
                ₱{numberFormatter.format(item.subtotal, { locale: 'en-PH' })}
              </p>
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
            render: (item) => (
              <p className="text-sm text-gray-600">
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString('en-PH', {
                      month: 'short',
                      day: '2-digit',
                      year: 'numeric',
                    })
                  : '-'}
              </p>
            ),
            sortable: true,
          },
          {
            heading: '',
            filterable: true,
            render: () => (
              <Menu.Root>
                <Menu.Trigger>
                  <MoreVertical className="w-4 h-4" />
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
    </div>
  );
};
