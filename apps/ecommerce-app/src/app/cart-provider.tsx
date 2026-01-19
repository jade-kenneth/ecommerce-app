'use client';

import { PropsWithChildren } from 'react';
import { CartProvider } from '../libs/portal/features/Cart/CartContext';

export const ClientCartProvider = (props: PropsWithChildren) => {
  return <CartProvider>{props.children}</CartProvider>;
};
