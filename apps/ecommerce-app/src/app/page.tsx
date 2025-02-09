'use client';
import { Carousel } from '@portal/global';
import { FrequentlySearched, Layout, Navbar } from '@portal/layout';
export default function Index() {
  return (
    <Layout>
      {/* <Highlights /> */}
      <Navbar />
      <FrequentlySearched />
      <Carousel />
    </Layout>
  );
}
