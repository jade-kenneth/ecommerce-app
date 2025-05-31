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
      <div className="w-[440px] h-[126px] text-[green] bg-[red] border-[1px_solid_#F2F2F2] rounded-[8px] flex items-center justify-center">
        hellos
      </div>
      <Categories />
      <TopSelling />
      <HighPoint />
      <JustForYou />
      <Footer />
    </Layout>
  );
}
