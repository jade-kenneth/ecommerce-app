'use client';

import { Star } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import { Badge, Button, Show, Spinner, toaster } from '~/components';
import { Sticky } from '~/components/Sticky';
import { Tabs } from '~/components/Tabs';
import { Footer, Highlight } from '~/features/portal';
import { Layout } from '~/features/portal/layout/Layout';
import {
  OrderStatus,
  useMyOrdersQuery,
  useProductsQuery,
  useUpdateOrderStatusMutation,
} from '~/graphql/generated';
import { useGlobalStore } from '~/hooks/useGlobalStore';
import { formatDate } from '~/utils';
import { capitalize } from '~/utils/capitalize';
import { numberFormatter } from '~/utils/numberFormatter';

const ClientOnlyNavbar = dynamic(
  () => import('~/features/portal').then((mod) => mod.Navbar),
  { ssr: false },
);

const getStatusColorScheme = (status?: OrderStatus) => {
  switch (status) {
    case OrderStatus.Completed:
      return 'success';
    case OrderStatus.Paid:
      return 'info';
    case OrderStatus.Shipped:
      return 'warning';
    case OrderStatus.Cancelled:
      return 'danger';
    case OrderStatus.Pending:
    default:
      return 'warning';
  }
};

const getHeaderStyles = (status?: OrderStatus) => {
  switch (status) {
    case OrderStatus.Completed:
      return 'border-success-100 bg-success-50/70';
    case OrderStatus.Paid:
      return 'border-cyan-100 bg-cyan-50/70';
    case OrderStatus.Shipped:
      return 'border-yellow-100 bg-yellow-50/70';
    case OrderStatus.Cancelled:
      return 'border-error-100 bg-error-50/70';
    case OrderStatus.Pending:
    default:
      return 'border-warning-100 bg-warning-50/70';
  }
};

const currencyFormatConfig = {
  locale: 'en-US',
  currency: 'PHP',
} as const;

type OrdersTabValue = 'ALL' | OrderStatus;
type OrderFeedbackDraft = {
  rating: number;
  comment: string;
  isSubmitting: boolean;
  isSubmitted: boolean;
};

const DEFAULT_FEEDBACK_DRAFT: OrderFeedbackDraft = {
  rating: 0,
  comment: '',
  isSubmitting: false,
  isSubmitted: false,
};

export default function OrdersPage() {
  const router = useRouter();

  const isAuthenticated = useGlobalStore(
    (state) => state.authenticate.isAuthenticated,
  );

  const ordersQuery = useMyOrdersQuery({
    skip: !isAuthenticated,
  });
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const orders = ordersQuery.data?.myOrders ?? [];
  const [activeTab, setActiveTab] = useState<OrdersTabValue>('ALL');
  const [activeFeedbackOrderId, setActiveFeedbackOrderId] = useState<
    string | null
  >(null);
  const [orderFeedback, setOrderFeedback] = useState<
    Record<string, OrderFeedbackDraft>
  >({});

  const statusTabs = useMemo(() => {
    const counts = orders.reduce(
      (acc, order) => {
        acc[order.status] = (acc[order.status] ?? 0) + 1;
        return acc;
      },
      {
        [OrderStatus.Pending]: 0,
        [OrderStatus.Paid]: 0,
        [OrderStatus.Shipped]: 0,
        [OrderStatus.Completed]: 0,
        [OrderStatus.Cancelled]: 0,
      } as Record<OrderStatus, number>,
    );

    return [
      { value: 'ALL' as const, label: 'All', count: orders.length },
      {
        value: OrderStatus.Pending,
        label: 'Pending',
        count: counts[OrderStatus.Pending],
      },
      {
        value: OrderStatus.Paid,
        label: 'Paid',
        count: counts[OrderStatus.Paid],
      },
      {
        value: OrderStatus.Shipped,
        label: 'Shipped',
        count: counts[OrderStatus.Shipped],
      },
      {
        value: OrderStatus.Completed,
        label: 'Completed',
        count: counts[OrderStatus.Completed],
      },
      {
        value: OrderStatus.Cancelled,
        label: 'Cancelled',
        count: counts[OrderStatus.Cancelled],
      },
    ];
  }, [orders]);

  const visibleOrders = useMemo(() => {
    if (activeTab === 'ALL') return orders;
    return orders.filter((order) => order.status === activeTab);
  }, [activeTab, orders]);

  const activeTabLabel =
    statusTabs.find((tab) => tab.value === activeTab)?.label ?? 'All';

  const productIds = useMemo(() => {
    const ids = visibleOrders
      .flatMap((order) => order.items ?? [])
      .map((item) => item.productId)
      .filter(Boolean);
    return Array.from(new Set(ids));
  }, [visibleOrders]);

  const productsQuery = useProductsQuery({
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

  const getFeedbackDraft = (
    orderId: string,
    initial?: { rating?: number | null; message?: string | null },
  ): OrderFeedbackDraft => {
    if (orderFeedback[orderId]) return orderFeedback[orderId];

    const initialRatingRaw = Number(initial?.rating ?? 0);
    const initialRating = Number.isFinite(initialRatingRaw)
      ? Math.min(5, Math.max(0, Math.round(initialRatingRaw)))
      : 0;
    const initialComment = (initial?.message ?? '').trim();

    return {
      rating: initialRating,
      comment: initialComment,
      isSubmitting: false,
      isSubmitted: initialRating > 0 || initialComment.length > 0,
    };
  };

  const updateFeedbackDraft = (
    orderId: string,
    patch: Partial<OrderFeedbackDraft>,
  ) => {
    setOrderFeedback((prev) => ({
      ...prev,
      [orderId]: {
        ...(prev[orderId] ?? DEFAULT_FEEDBACK_DRAFT),
        ...patch,
      },
    }));
  };

  const submitOrderFeedback = async (orderId: string) => {
    const draft = getFeedbackDraft(orderId);

    if (draft.rating < 1) {
      toaster.error({ description: 'Please select a star rating first.' });
      return;
    }

    updateFeedbackDraft(orderId, { isSubmitting: true });

    try {
      await updateOrderStatus({
        variables: {
          input: {
            orderId,
            rating: draft.rating,
            message: draft.comment.trim(),
          },
        },
      });
      await ordersQuery.refetch();

      updateFeedbackDraft(orderId, {
        isSubmitting: false,
        isSubmitted: true,
      });
      setActiveFeedbackOrderId((current) =>
        current === orderId ? null : current,
      );

      toaster.success({ description: 'Order rating updated.' });
    } catch (error) {
      updateFeedbackDraft(orderId, { isSubmitting: false });
      toaster.error({
        description: 'Failed to submit your rating. Please try again.',
      });
    }
  };

  return (
    <>
      <Sticky>
        <Highlight />
        <ClientOnlyNavbar />
      </Sticky>
      <Layout>
        <div className="mx-auto w-full max-w-screen px-4 sm:px-6 lg:px-10 py-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-2xl font-semibold text-gray-900">My Orders</p>
              <p className="text-sm text-gray-500">
                Track your recent purchases and order status.
              </p>
            </div>
          </div>

          {ordersQuery.loading && (
            <div className="flex justify-center py-16">
              <Spinner className="h-16" />
            </div>
          )}

          {!ordersQuery.loading && orders.length === 0 && (
            <div className="mt-8 rounded-3xl border border-gray-100 bg-white p-8 text-center">
              <p className="text-lg font-semibold text-gray-900">
                No orders yet
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Browse products and add them to your cart to get started.
              </p>
              <Button
                className="mt-4 rounded-[32px] bg-cyan-700 text-white px-6 py-2"
                onClick={() => router.push('/')}
              >
                Shop Now
              </Button>
            </div>
          )}

          {!ordersQuery.loading && orders.length > 0 && (
            <div className="mt-8 flex flex-col gap-6">
              <Tabs.Root
                value={activeTab}
                onValueChange={(details: { value: string }) =>
                  setActiveTab(details.value as OrdersTabValue)
                }
                variant="enclosed"
                size="sm"
                className="w-full"
              >
                <Tabs.List className="w-full overflow-x-auto">
                  <Tabs.Indicator />
                  {statusTabs.map((tab) => (
                    <Tabs.Trigger
                      key={tab.value}
                      value={tab.value}
                      className="gap-2 whitespace-nowrap ui-selected:bg-cyan-500 rounded-md ui-selected:text-white"
                    >
                      <span>{tab.label}</span>
                      <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-gray-600 shadow-sm">
                        {tab.count}
                      </span>
                    </Tabs.Trigger>
                  ))}
                </Tabs.List>
              </Tabs.Root>

              {visibleOrders.length === 0 && (
                <div className="rounded-3xl border border-gray-100 bg-white p-8 text-center">
                  <p className="text-lg font-semibold text-gray-900">
                    No {activeTabLabel.toLowerCase()} orders
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Check back later or browse products to place a new order.
                  </p>
                  <Button
                    className="mt-4 rounded-[32px] bg-cyan-700 text-white px-6 py-2"
                    onClick={() => router.push('/')}
                  >
                    Shop Now
                  </Button>
                </div>
              )}

              {visibleOrders.map((order) => {
                const items = order.items ?? [];
                const itemsCount = items.reduce(
                  (total, item) => total + (item.quantity ?? 0),
                  0,
                );
                const feedbackDraft = getFeedbackDraft(order._id, {
                  rating: order.rating,
                  message: order.message,
                });
                const isCompleted = order.status === OrderStatus.Completed;
                const isFeedbackOpen = activeFeedbackOrderId === order._id;
                const orderRating = Number(order.rating ?? 0);
                const hasPersistedRating =
                  Number.isFinite(orderRating) && orderRating > 0;
                const normalizedPersistedRating = Math.min(
                  5,
                  Math.max(0, Math.round(orderRating)),
                );
                const orderMessage = order.message?.trim() ?? '';
                return (
                  <div
                    key={order._id}
                    className="rounded-3xl  border border-gray-200 bg-white shadow-sm overflow-hidden"
                  >
                    <div
                      className={`flex flex-col gap-3 px-6 py-4 border-b ${getHeaderStyles(
                        order.status,
                      )}`}
                    >
                      <div className="flex  flex-col lg:flex-row h-full  gap-2 lg:gap-3 sm:flex-row items-start lg:items-start justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-400">
                            Order
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            #{order._id}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Placed {formatDate(order.createdAt)}
                          </p>
                        </div>

                        <Badge.Root
                          colorScheme={getStatusColorScheme(order.status)}
                          size="sm"
                          className="font-semibold"
                        >
                          <Badge.Label>
                            {capitalize(order.status ?? 'pending', {
                              delimiter: capitalize.delimiters.UNDERSCORE,
                            })}
                          </Badge.Label>
                        </Badge.Root>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        <span>{itemsCount} items</span>
                        <span className="h-3 w-px bg-gray-200" />
                        <span>
                          Shipping: {order.shippingOption?.label ?? 'Standard'}
                        </span>
                        {order.shippingOption?.estimatedDays && (
                          <>
                            <span className="h-3 w-px bg-gray-200" />
                            <span>
                              {order.shippingOption.estimatedDays} delivery
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="grid lg:grid-cols-3  gap-4 px-6 py-5">
                      {items.map((item) => {
                        const product = productMap.get(item.productId);
                        const name = product?.name ?? 'Discontinued Product';
                        const thumbnail = product?.thumbnail ?? '/Logo.png';
                        return (
                          <div
                            key={`${order._id}-${item.productId}`}
                            className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:gap-4"
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
                                  {numberFormatter.format(
                                    item.unitPrice,
                                    currencyFormatConfig,
                                  )}{' '}
                                  each
                                </span>
                              </div>
                            </div>
                            <div className="text-left sm:text-right">
                              <p className="text-xs text-gray-500">
                                Line total
                              </p>
                              <p className="text-sm font-semibold text-gray-900">
                                {numberFormatter.format(
                                  item.totalPrice,
                                  currencyFormatConfig,
                                )}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="grid grid-cols-1 bg-gray-50 border-t border-gray-200 py-4 gap-4 px-6 pb-6 sm:grid-cols-3">
                      <div className="rounded-2xl border border-gray-200 bg-white p-4">
                        <p className="text-xs uppercase text-gray-500">
                          Subtotal
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {numberFormatter.format(
                            order.subtotal,
                            currencyFormatConfig,
                          )}
                        </p>
                        <p className="text-xs text-gray-500">
                          Tax:{' '}
                          {numberFormatter.format(
                            order.tax,
                            currencyFormatConfig,
                          )}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-gray-200 bg-white p-4">
                        <p className="text-xs uppercase text-gray-500">
                          Shipping
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {numberFormatter.format(
                            order.shippingFee,
                            currencyFormatConfig,
                          )}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.shippingOption?.label ?? 'Standard'}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-4">
                        <p className="text-xs uppercase text-cyan-700">Total</p>
                        <p className="text-lg font-semibold text-cyan-900">
                          {numberFormatter.format(
                            order.total,
                            currencyFormatConfig,
                          )}
                        </p>
                        <p className="text-xs text-cyan-700">
                          Includes taxes and shipping
                        </p>
                      </div>
                    </div>

                    <Show when={isCompleted}>
                      <div className="border-t border-gray-200 px-6 py-5">
                        <Show
                          when={hasPersistedRating}
                          fallback={
                            <>
                              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                  <p className="text-sm font-semibold text-gray-900">
                                    Rate this completed order
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Share your experience to help us improve.
                                  </p>
                                </div>
                                <Button
                                  variant="solid"
                                  className="rounded-[32px] px-5 py-2 text-cyan-700"
                                  onClick={() =>
                                    setActiveFeedbackOrderId((current) =>
                                      current === order._id ? null : order._id,
                                    )
                                  }
                                >
                                  <Show when={isFeedbackOpen} fallback="Rate Order">
                                    Hide Rating
                                  </Show>
                                </Button>
                              </div>

                              <Show when={isFeedbackOpen}>
                                <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4">
                                  <div className="flex items-center gap-2">
                                    {[1, 2, 3, 4, 5].map((value) => {
                                      const active =
                                        value <= feedbackDraft.rating;
                                      return (
                                        <button
                                          key={value}
                                          type="button"
                                          aria-label={`Rate ${value} star${
                                            value > 1 ? 's' : ''
                                          }`}
                                          className="rounded-md p-1 transition hover:scale-105 disabled:cursor-not-allowed"
                                          onClick={() =>
                                            updateFeedbackDraft(order._id, {
                                              rating: value,
                                            })
                                          }
                                          disabled={feedbackDraft.isSubmitting}
                                        >
                                          <Star
                                            className={
                                              active
                                                ? 'h-6 w-6 fill-cyan-400 text-cyan-400'
                                                : 'h-6 w-6 text-gray-300'
                                            }
                                          />
                                        </button>
                                      );
                                    })}
                                  </div>

                                  <textarea
                                    className="mt-3 min-h-[90px] w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                                    placeholder="Tell us what went well (optional)"
                                    value={feedbackDraft.comment}
                                    onChange={(event) =>
                                      updateFeedbackDraft(order._id, {
                                        comment: event.target.value,
                                      })
                                    }
                                    maxLength={240}
                                    disabled={feedbackDraft.isSubmitting}
                                  />

                                  <div className="mt-3 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-xs text-gray-500">
                                      {feedbackDraft.comment.length}/240
                                    </p>
                                    <Button
                                      className="rounded-[32px] px-5 py-2 text-white"
                                      onClick={() =>
                                        submitOrderFeedback(order._id)
                                      }
                                      disabled={feedbackDraft.isSubmitting}
                                    >
                                      <Show
                                        when={feedbackDraft.isSubmitting}
                                        fallback="Submit Rating"
                                      >
                                        Submitting...
                                      </Show>
                                    </Button>
                                  </div>
                                </div>
                              </Show>
                            </>
                          }
                        >
                          <div className="rounded-2xl border border-gray-200 bg-white p-4">
                            <p className="text-sm font-semibold text-gray-900">
                              Your rating
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              {[1, 2, 3, 4, 5].map((value) => {
                                const active =
                                  value <= normalizedPersistedRating;
                                return (
                                  <Star
                                    key={value}
                                    className={
                                      active
                                        ? 'h-6 w-6 fill-cyan-400 text-cyan-400'
                                        : 'h-6 w-6 text-gray-300'
                                    }
                                  />
                                );
                              })}
                            </div>
                            <Show when={orderMessage.length > 0}>
                              <p className="mt-3 text-sm text-gray-600">
                                {orderMessage}
                              </p>
                            </Show>
                          </div>
                        </Show>
                      </div>
                    </Show>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <Footer />
      </Layout>
    </>
  );
}
