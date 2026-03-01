'use client';

import { CartProvider } from '~/features/portal';
import { PropsWithChildren } from 'react';

export const ClientCartProvider = (props: PropsWithChildren) => {
  return <CartProvider>{props.children}</CartProvider>;
};
