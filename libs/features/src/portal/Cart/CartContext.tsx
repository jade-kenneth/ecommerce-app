'use client';

import { ReactNode } from 'react';
import { createContext } from '~/utils/createContext';
import { useCart } from './useCart';

export const [CartContext, useCartContext] =
  createContext<ReturnType<typeof useCart>>();

export interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider(props: CartProviderProps) {
  const context = useCart();

  return <CartContext value={context}>{props.children}</CartContext>;
}
