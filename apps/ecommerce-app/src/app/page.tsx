import type { Metadata } from 'next';
import { Sticky } from '~/components/Sticky';
import { Navbar } from '~/features/portal';
import { Carousel } from '~/features/portal/Carousel';
import { Categories } from '~/features/portal/Categories';
import { Footer } from '~/features/portal/Footer';
import { FrequentlySearched } from '~/features/portal/FrequentlySearch';
import { Highlight } from '~/features/portal/Highlight';
import { Layout } from '~/features/portal/layout/Layout';
import { HomeProductSections } from './HomeProductSections';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Browse featured categories, promos, and top products on Amy.',
};

export default function Index() {
  return (
    <>
      <Sticky>
        <Highlight />
        <Navbar />
      </Sticky>
      <Layout>
        <FrequentlySearched />
        <Carousel />
        <Categories />
        <HomeProductSections />
        <Footer />
      </Layout>
    </>
  );
}
