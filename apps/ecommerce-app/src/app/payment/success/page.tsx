'use client';

import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';

import { Button } from '~/components';
import { Sticky } from '~/components/Sticky';
import { Footer } from '~/features/portal';
import { Highlight } from '~/features/portal/Highlight';
import { Layout } from '~/features/portal/layout/Layout';
import { OrderStatus, useUpdateOrderStatusMutation } from '~/graphql/generated';

const ClientOnlyNavbar = dynamic(
  () => import('~/features/portal').then((mod) => mod.Navbar),
  { ssr: false },
);

type PageState = 'loading' | 'success' | 'error';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [state, setState] = useState<PageState>('loading');
  const [message, setMessage] = useState('Confirming your payment...');
  const submittedRef = useRef(false);

  useEffect(() => {
    if (submittedRef.current) return;

    if (!orderId) {
      setState('error');
      setMessage('Missing order reference. Please check your orders page.');
      return;
    }

    submittedRef.current = true;
    updateOrderStatus({
      variables: {
        input: {
          orderId,
          status: OrderStatus.Paid,
        },
      },
    })
      .then(() => {
        setState('success');
        setMessage('Payment confirmed. Your order is now marked as paid.');
      })
      .catch(() => {
        setState('error');
        setMessage(
          'We could not confirm your payment yet. Please check your orders page or try again later.',
        );
      });
  }, [orderId, updateOrderStatus]);

  const title =
    state === 'success'
      ? 'Payment confirmed'
      : state === 'error'
        ? 'Payment pending'
        : 'Finalizing payment';

  return (
    <>
      <Sticky>
        <Highlight />
        <ClientOnlyNavbar />
      </Sticky>
      <Layout>
        <div className="mx-auto w-full max-w-xl px-4 py-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-600">
            GCash Payment
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-gray-900">{title}</h1>
          <p className="mt-4 text-sm text-gray-600">{message}</p>
          {orderId && (
            <p className="mt-2 text-xs text-gray-400">Order ID: {orderId}</p>
          )}
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

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="py-10" />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
