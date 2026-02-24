'use client';

import { HighPoint, JustForYou, TopSelling } from '~/features/portal';

export function HomeProductSections() {
  return (
    <>
      <TopSelling />
      <HighPoint />
      <JustForYou />
    </>
  );
}
