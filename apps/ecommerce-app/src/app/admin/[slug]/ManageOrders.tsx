'use client';

import { createListCollection, Portal } from '@ark-ui/react';
import { useMutation, useQuery } from '@apollo/client/react';
import {
  CheckCircle2,
  ClipboardList,
  MoreVertical,
  RefreshCcw,
  ShoppingCart,
  Wallet,
  XIcon,
} from 'lucide-react';
import Image from 'next/image';
import { Reducer, useMemo, useReducer, useState } from 'react';
import { Badge, Button, DataTable, Menu, toaster } from '~/components';
import { Dialog } from '~/components/Dialog';

import { MY_ORDERS_QUERY, UPDATE_ORDER_STATUS_MUTATION } from '~/graphql/Cart';
import { PRODUCTS_QUERY } from '~/graphql/Product';
import type { MyOrdersQuery } from '~/graphql/generated';
import { OrderStatus } from '~/graphql/generated';
import { usePaginated } from '~/hooks/usePaginated';
import { formatDate } from '~/utils';
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

const formatCurrency = (value?: string | number | null) =>
  numberFormatter.format(value ?? 0, {
    locale: 'en-PH',
    currency: 'PHP',
  });

export const ManageOrders = () => {
  const [state, setState] = useReducer<Reducer<PageState, Partial<PageState>>>(
    (prev, next) => ({
      ...prev,
      ...next,
    }),
    { page: 1, pageSize: 10 },
  );

  const query = useQuery(MY_ORDERS_QUERY, {
    fetchPolicy: 'network-only',
  });
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [selectedOrder, setSelectedOrder] = useState<
    MyOrdersQuery['myOrders'][number] | null
  >(null);

  const [updateOrderStatus] = useMutation(UPDATE_ORDER_STATUS_MUTATION);

  const orders = query.data?.myOrders ?? [];
  const productIds = useMemo(() => {
    const ids = orders
      .flatMap((order) => order.items ?? [])
      .map((item) => item.productId)
      .filter(Boolean);
    return Array.from(new Set(ids));
  }, [orders]);

  const productsQuery = useQuery(PRODUCTS_QUERY, {
    variables: {
      first: productIds.length,
      filter: {
        _id: {
          in: productIds,
        },
      },
    },
    skip: productIds.length === 0,
  });
  const productMap = useMemo(() => {
    return new Map(
      productsQuery.data?.products.edges.map((edge) => [
        edge.node._id,
        edge.node,
      ]) ?? [],
    );
  }, [productsQuery.data]);

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

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      setUpdatingId(orderId);
      await updateOrderStatus({
        variables: {
          input: {
            orderId,
            status,
          },
        },
      });
      toaster.success({
        description: `Order status updated to ${capitalize(status, {
          delimiter: capitalize.delimiters.UNDERSCORE,
        })}.`,
      });
      await query.refetch();
    } catch (error) {
      toaster.error({
        description: 'Unable to update order status. Please try again.',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const selectedItems = selectedOrder?.items ?? [];

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
                {item.createdAt ? formatDate(item.createdAt) : '-'}
              </p>
            ),
            sortable: true,
          },
          {
            heading: 'Actions',

            render: (item) => (
              <Menu.Root>
                <Menu.Trigger className="flex items-center justify-center">
                  <MoreVertical className="w-4 h-4" />
                </Menu.Trigger>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content className="min-w-[150px]">
                      <Menu.Item
                        value="view"
                        onSelect={() => setSelectedOrder(item)}
                      >
                        View details
                      </Menu.Item>
                      <Menu.Separator />
                      {Object.values(OrderStatus).map((status) => {
                        const isCurrent = item.status === status;
                        return (
                          <Menu.Item
                            key={status}
                            value={`${item._id}-${status}`}
                            disabled={isCurrent || updatingId === item._id}
                            onSelect={() =>
                              !isCurrent && handleUpdateStatus(item._id, status)
                            }
                          >
                            {isCurrent
                              ? `Current: ${capitalize(status, {
                                  delimiter: capitalize.delimiters.UNDERSCORE,
                                })}`
                              : `Mark as ${capitalize(status, {
                                  delimiter: capitalize.delimiters.UNDERSCORE,
                                })}`}
                          </Menu.Item>
                        );
                      })}
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
            ),
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

      <Dialog.Root
        open={Boolean(selectedOrder)}
        onOpenChange={(details) => {
          if (!details.open) {
            setSelectedOrder(null);
          }
        }}
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content className="w-[92vw] max-w-4xl p-0 overflow-hidden">
            <div className="flex items-start justify-between border-b border-cyan-100 bg-cyan-50 px-6 py-5">
              <div className="flex flex-col gap-1">
                <p className="text-xl font-semibold text-gray-900">
                  Order Details
                </p>
                <p className="text-sm text-gray-500">{selectedOrder?._id}</p>
              </div>
              <Dialog.CloseTrigger>
                <XIcon
                  size={18}
                  color="gray"
                  onClick={() => setSelectedOrder(null)}
                />
              </Dialog.CloseTrigger>
            </div>

            <Dialog.Body className="flex flex-col gap-6 px-6 py-6">
              {selectedOrder && (
                <>
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-xs uppercase text-gray-400">
                        Placed on
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatDate(selectedOrder.createdAt)}
                      </p>
                    </div>
                    <Badge.Root
                      colorScheme={getStatusColorScheme(selectedOrder.status)}
                    >
                      <Badge.Indicator asChild>
                        <span className="w-2 h-2 rounded-full bg-current" />
                      </Badge.Indicator>
                      <Badge.Label>
                        {capitalize(selectedOrder.status ?? 'pending', {
                          delimiter: capitalize.delimiters.UNDERSCORE,
                        })}
                      </Badge.Label>
                    </Badge.Root>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-gray-200 bg-white p-4">
                      <p className="text-xs uppercase text-gray-500">
                        Subtotal
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatCurrency(selectedOrder.subtotal)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Tax: {formatCurrency(selectedOrder.tax)}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-white p-4">
                      <p className="text-xs uppercase text-gray-500">
                        Shipping
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatCurrency(selectedOrder.shippingFee)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {selectedOrder.shippingOption?.label ?? 'Standard'}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-4">
                      <p className="text-xs uppercase text-cyan-700">Total</p>
                      <p className="text-lg font-semibold text-cyan-800">
                        {formatCurrency(selectedOrder.total)}
                      </p>
                      <p className="text-xs text-cyan-700">
                        Includes taxes and shipping
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <p className="text-sm font-semibold text-gray-900">
                      Items ({selectedItems.length})
                    </p>
                    <div className="flex flex-col gap-3">
                      {selectedItems.map((item) => {
                        const product = productMap.get(item.productId);
                        const name = product?.name ?? 'Discontinued Product';
                        const thumbnail = product?.thumbnail ?? '/Logo.png';
                        return (
                          <div
                            key={`${selectedOrder._id}-${item.productId}`}
                            className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 sm:flex-row sm:items-center sm:gap-4"
                          >
                            <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-gray-200 bg-white">
                              <Image
                                src={thumbnail}
                                alt={name}
                                fill
                                className="object-cover"
                                sizes="64px"
                              />
                            </div>
                            <div className="flex flex-1 flex-col gap-1">
                              <p className="text-sm font-semibold text-gray-900">
                                {name}
                              </p>
                              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                                <span>Qty {item.quantity}</span>
                                <span className="h-3 w-px bg-gray-200" />
                                <span>
                                  {formatCurrency(item.unitPrice)} each
                                </span>
                              </div>
                            </div>
                            <div className="text-left sm:text-right">
                              <p className="text-xs text-gray-500">
                                Line total
                              </p>
                              <p className="text-sm font-semibold text-gray-900">
                                {formatCurrency(item.totalPrice)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </div>
  );
};
