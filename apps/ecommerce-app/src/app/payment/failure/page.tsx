'use client';

import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import { Button } from '~/components';
import { Sticky } from '~/components/Sticky';
import { Footer, Highlight } from '~/features/portal';
import { Layout } from '~/features/portal/Layout/Layout';

const ClientOnlyNavbar = dynamic(
  () => import('~/features/portal').then((mod) => mod.Navbar),
  { ssr: false },
);

function PaymentFailureContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <>
      <Sticky>
        <Highlight />
        <ClientOnlyNavbar />
      </Sticky>
      <Layout>
        <div className="mx-auto w-full max-w-xl px-4 py-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-amber-600">
            GCash Payment
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-gray-900">
            Payment not completed
          </h1>
          <p className="mt-4 text-sm text-gray-600">
            Your payment was not completed. You can retry from your cart or
            continue shopping.
          </p>
          {orderId && (
            <p className="mt-2 text-xs text-gray-400">Order ID: {orderId}</p>
          )}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              className="rounded-[32px] bg-cyan-700 text-white px-6 py-2"
              onClick={() => router.push('/cart')}
            >
              Back to Cart
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

export default function PaymentFailurePage() {
  return (
    <Suspense fallback={<div className="py-10" />}>
      <PaymentFailureContent />
    </Suspense>
  );
}
