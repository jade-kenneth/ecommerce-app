'use client';

import dynamic from 'next/dynamic';
import { Sticky } from '~/components/Sticky';

import {
  Carousel,
  Footer,
  FrequentlySearched,
  Highlight,
  HighPoint,
  JustForYou,
  TopSelling,
} from '~/features/portal';
import { Layout } from '~/features/portal/layout/Layout';

const ClientOnlyNavbar = dynamic(
  () => import('~/features/portal').then((mod) => mod.Navbar),
  { ssr: false },
);
const ClientOnlyCategories = dynamic(
  () => import('~/features/portal').then((mod) => mod.Categories),
  { ssr: false },
);

export default function Index() {
  return (
    <>
      <Sticky>
        <Highlight />
        <ClientOnlyNavbar />
      </Sticky>
      <Layout>
        <FrequentlySearched />
        <Carousel />
        <ClientOnlyCategories />
        <TopSelling />
        <HighPoint />
        <JustForYou />
        <Footer />
      </Layout>
    </>
  );
}
