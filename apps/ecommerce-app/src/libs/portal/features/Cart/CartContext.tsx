import { ReactNode } from 'react';
import { createContext } from '../../../global/src';
import { useCart } from './useCart';

export const [CartContext, useCartContext] =
  createContext<ReturnType<typeof useCart>>();

export interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider(props: CartProviderProps) {
  const context = useCart();
  console.log('CartContext', context);
  return <CartContext value={context}>{props.children}</CartContext>;
}
