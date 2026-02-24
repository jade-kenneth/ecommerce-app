'use client';

import type { ReactNode } from 'react';
import { withLayout } from '~/admin';
import { AccountType } from '~/graphql/generated';

interface RootLayoutProps {
  children: ReactNode;
}

function RootLayout({ children }: RootLayoutProps) {
  return <>{children}</>;
}

export default withLayout(RootLayout, {
  role: [AccountType.Member],
});
