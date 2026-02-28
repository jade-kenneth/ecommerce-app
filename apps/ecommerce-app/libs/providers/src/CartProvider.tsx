'use client';

import { CartProvider } from 'libs/features/src/portal';
import { PropsWithChildren } from 'react';

export const ClientCartProvider = (props: PropsWithChildren) => {
  return <CartProvider>{props.children}</CartProvider>;
};
