'use client';
import { Carousel } from '@portal/global';
import { FrequentlySearched, Highlight, Layout, Navbar } from '@portal/layout';
export default function Index() {
  return (
    <Layout>
      <Highlight />
      <Navbar />
      <FrequentlySearched />
      <Carousel />
    </Layout>
  );
}
