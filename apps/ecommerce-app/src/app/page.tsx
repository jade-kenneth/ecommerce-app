'use client';
import {
  Carousel,
  Categories,
  Footer,
  HighPoint,
  JustForYou,
  TopSelling,
} from '@global';
import { FrequentlySearched, Highlight, Layout, Navbar } from '@portal/layout';

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
