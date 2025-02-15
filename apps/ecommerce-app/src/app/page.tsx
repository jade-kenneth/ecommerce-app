'use client';
import { Carousel, Categories, TopSelling } from '@portal/global';
import { FrequentlySearched, Highlight, Layout, Navbar } from '@portal/layout';
import HighPoint from 'libs/portal/global/src/components/HighPoint';
import JustForYou from 'libs/portal/global/src/components/JustForYou';
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
    </Layout>
  );
}
