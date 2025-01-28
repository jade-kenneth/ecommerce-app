'use client';
import { FrequentlySearched, Highlights, Layout, Navbar } from '@portal/layout';
export default function Index() {
  return (
    <Layout>
      <Highlights />
      <Navbar />
      <FrequentlySearched />
    </Layout>
  );
}
