import type { Metadata } from 'next';
import { Sticky } from '~/components/Sticky';
import {
  Carousel,
  Categories,
  Footer,
  FrequentlySearched,
  Highlight,
  Navbar,
} from '~/features/portal';
import { Layout } from '~/features/portal/Layout/Layout';
import { HomeProductSections } from './HomeProductSections';

export const metadata: Metadata = {
  title: 'Home | Amy Store',
  description:
    'Browse featured categories, promos, and top products on Amy Store.',
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
