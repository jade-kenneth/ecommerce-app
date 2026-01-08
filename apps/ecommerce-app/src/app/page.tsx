'use client';

import {
  Carousel,
  Categories,
  Footer,
  FrequentlySearched,
  Highlight,
  HighPoint,
  JustForYou,
  Navbar,
  TopSelling,
} from '../libs/portal/features';
import { Layout } from '../libs/portal/layout/Layout';
export default function Index() {
  return (
    <Layout>
      <Highlight />
      <Navbar />
      <FrequentlySearched />
      <Carousel />
      <Categories />
      <TopSelling />
      <HighPoint />
      <JustForYou />
      <Footer />
    </Layout>
  );
}
