'use client';

import dynamic from 'next/dynamic';
import {
  Carousel,
  Footer,
  FrequentlySearched,
  Highlight,
  HighPoint,
  JustForYou,
  TopSelling,
} from '../libs/portal/features';
import { Layout } from '../libs/portal/layout/Layout';

const ClientOnlyNavbar = dynamic(
  () => import('../libs/portal/features').then((mod) => mod.Navbar),
  { ssr: false }
);
const ClientOnlyCategories = dynamic(
  () => import('../libs/portal/features').then((mod) => mod.Categories),
  { ssr: false }
);

export default function Index() {
  return (
    <Layout>
      <div className="sticky top-0 z-50 bg-white border-b border-[#EAEAEA]">
        <Highlight />
        <ClientOnlyNavbar />
      </div>
      <FrequentlySearched />
      <Carousel />
      <ClientOnlyCategories />
      <TopSelling />
      <HighPoint />
      <JustForYou />
      <Footer />
    </Layout>
  );
}
