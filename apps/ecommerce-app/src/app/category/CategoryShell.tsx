'use client';

import dynamic from 'next/dynamic';
import { PropsWithChildren } from 'react';
import { Sticky } from '~/components/Sticky';
import { Footer, Highlight } from '~/features/portal';
import { Layout } from '~/features/portal/Layout/Layout';

const ClientOnlyNavbar = dynamic(
  () => import('~/features/portal').then((mod) => mod.Navbar),
  { ssr: false },
);

export default function CategoryShell({ children }: PropsWithChildren) {
  return (
    <>
      <Sticky>
        <Highlight />
        <ClientOnlyNavbar />
      </Sticky>
      <Layout>
        {children}
        <Footer />
      </Layout>
    </>
  );
}
