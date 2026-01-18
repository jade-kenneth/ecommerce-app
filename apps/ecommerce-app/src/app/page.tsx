'use client';

import dynamic from 'next/dynamic';
import { Show, useGlobalStore } from '../libs/global/src';
import {
  Carousel,
  Footer,
  FrequentlySearched,
  Highlight,
  HighPoint,
  JustForYou,
  TopSelling,
} from '../libs/portal/features';
import { Cart } from '../libs/portal/features/Cart';
import { CartProvider } from '../libs/portal/features/Cart/CartContext';
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
  const globalStore = useGlobalStore((state) => state);

  return (
    <CartProvider>
      <Layout>
        <div className="sticky top-0 z-50 bg-white border-b border-[#EAEAEA]">
          <Highlight />
          <ClientOnlyNavbar />
        </div>
        <FrequentlySearched />
        <Show when={!globalStore.cart.isOpen} fallback={<Cart />}>
          <Carousel />
          <ClientOnlyCategories />
          <TopSelling />
          <HighPoint />
          <JustForYou />
        </Show>
        <Footer />
      </Layout>
    </CartProvider>
  );
}
