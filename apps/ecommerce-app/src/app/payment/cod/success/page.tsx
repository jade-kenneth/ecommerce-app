'use client';

import { useQuery } from '@apollo/client/react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import { Button } from '~/components';
import { Sticky } from '~/components/Sticky';
import { Footer } from '~/features/portal';
import { Highlight } from '~/features/portal/Highlight';
import { Layout } from '~/features/portal/layout/Layout';
import { MY_ORDERS_QUERY } from '~/graphql/Cart';
import { numberFormatter } from '~/utils/numberFormatter';

const ClientOnlyNavbar = dynamic(
  () => import('~/features/portal').then((mod) => mod.Navbar),
  { ssr: false },
);

function CashOnDeliverySuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const ordersQuery = useQuery(MY_ORDERS_QUERY, { fetchPolicy: 'network-only' });
  const order = ordersQuery.data?.myOrders.find((item) => item._id === orderId);

  const shippingFee =
    order?.shippingFee !== undefined
      ? `${numberFormatter.format(order.shippingFee)}`
      : null;

  const detailsMessage = orderId
    ? 'Your order is confirmed. Please pay the courier upon delivery.'
    : 'Your order is confirmed. Please check your orders page for details.';

  return (
    <>
      <Sticky>
        <Highlight />
        <ClientOnlyNavbar />
      </Sticky>
      <Layout>
        <div className="mx-auto w-full max-w-xl px-4 py-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-600">
            Cash on Delivery
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-gray-900">
            Order placed
          </h1>
          <p className="mt-4 text-sm text-gray-600">{detailsMessage}</p>
          {orderId && (
            <p className="mt-2 text-xs text-gray-400">Order ID: {orderId}</p>
          )}
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Shipping Fee</span>
              <span className="font-semibold text-gray-900">
                {ordersQuery.loading
                  ? 'Loading...'
                  : (shippingFee ?? 'Unavailable')}
              </span>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              className="rounded-[32px] bg-cyan-700 text-white px-6 py-2"
              onClick={() => router.push('/orders')}
            >
              View Orders
            </Button>
            <Button
              variant="outline"
              className="rounded-[32px] border-gray-200 px-6 py-2"
              onClick={() => router.push('/')}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
        <Footer />
      </Layout>
    </>
  );
}

export default function CashOnDeliverySuccessPage() {
  return (
    <Suspense fallback={<div className="py-10" />}>
      <CashOnDeliverySuccessContent />
    </Suspense>
  );
}
