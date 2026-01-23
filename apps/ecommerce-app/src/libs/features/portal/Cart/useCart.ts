'use client';

import { omit } from 'es-toolkit';
import { useEffect, useReducer } from 'react';
import {
  CartStatus,
  PaymentMethodType,
  ShippingType,
  useCartQuery,
  useProductsQuery,
  useSelfQuery,
} from '~/graphql/generated';
import { useLicenseContext } from '~/providers/LicenseProvider/LicenseContext';

export interface Item {
  thumbnail: string;
  name: string;
  price: number;
  productId: string;
  quantity: number;
}

export type CartItem = {
  items: Item[];
  subtotal?: string;
  tax?: string;
  status?: CartStatus;
  shipping?: {
    fee?: string;
    type?: ShippingType;
    description?: string;
  };
  paymentMethod?: PaymentMethodType;
};

type CartState = {
  cart: CartItem;
  itemsCount: number;
};

export const useCart = () => {
  const [state, setState] = useReducer(
    (prev: CartState, next: Partial<CartState>) => ({ ...prev, ...next }),
    {
      cart: {
        items: [],
        paymentMethod: PaymentMethodType.Gcash,
        shipping: {
          type: ShippingType.Standard,
          description: 'Estimated delivery: 5-7 business days',
          fee: '5',
        },
      },
      itemsCount: 0,
    }
  );

  const { cart, itemsCount } = state;

  const { data: selfQuery } = useSelfQuery();
  const selfId = selfQuery?.self?._id ?? '';

  const { data: cartData } = useCartQuery({
    skip: !selfId,
    variables: { id: selfId },
  });

  const productIds = cartData?.cart.items?.map((p) => p?.productId ?? '') ?? [];
  const licenseContext = useLicenseContext();
  const { data: productsData } = useProductsQuery({
    skip: !licenseContext.isLicensed,
    variables: {
      filter: {
        _id: { in: productIds },
      },
    },
  });

  function addCartItem(newItem: Item) {
    const existingIndex = cart.items.findIndex(
      (i) => i.productId === newItem.productId
    );

    let updatedItems: Item[];

    if (existingIndex !== -1) {
      updatedItems = [...cart.items];
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity: updatedItems[existingIndex].quantity + 1,
      };
    } else {
      updatedItems = [...cart.items, newItem];
    }

    setState({
      cart: { ...cart, items: updatedItems },
      itemsCount: updatedItems.reduce((sum, curr) => sum + curr.quantity, 0),
    });
  }

  useEffect(() => {
    if (!productsData?.products.edges.length || !cartData?.cart) return;

    const PRODUCTS_MAP = new Map(
      productsData.products.edges.map((p) => [
        p.node._id,
        {
          thumbnail: p.node.thumbnail,
          name: p.node.name,
          price: p.node.price,
        },
      ])
    );

    const MERGED_ITEMS = cartData.cart.items.map((item) => ({
      ...item,
      ...PRODUCTS_MAP.get(item.productId)!,
    }));

    const nextCart: CartItem = {
      ...state.cart,
      ...cartData.cart,
      items: MERGED_ITEMS.map((i) => omit(i, ['__typename'])),
    };

    setState({
      cart: nextCart,
      itemsCount: nextCart.items.reduce(
        (sum, curr) => sum + (curr.quantity ?? 0),
        0
      ),
    });
  }, [productsData, cartData]);

  return {
    state,
    itemsCount,
    addCartItem,
    setState,
  };
};
