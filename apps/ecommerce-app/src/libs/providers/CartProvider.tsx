'use client';

import { PropsWithChildren } from 'react';
import { CartProvider } from '~/features/portal';

export const ClientCartProvider = (props: PropsWithChildren) => {
  return <CartProvider>{props.children}</CartProvider>;
};
