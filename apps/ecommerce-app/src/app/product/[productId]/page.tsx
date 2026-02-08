'use client';

import { ShoppingCart } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { Badge, Button, Cards, Spinner, toaster } from '~/components';
import { Sticky } from '~/components/Sticky';
import { Footer, Highlight } from '~/features/portal';
import { useCartContext } from '~/features/portal/Cart/CartContext';
import { Layout } from '~/features/portal/layout/Layout';
import {
  useProductsQuery,
  useUpdateCartItemMutation,
} from '~/graphql/generated';
import { useGlobalStore } from '~/hooks/useGlobalStore';
import { capitalize } from '~/utils/capitalize';
import { numberFormatter } from '~/utils/numberFormatter';

const ClientOnlyNavbar = dynamic(
  () => import('~/features/portal').then((mod) => mod.Navbar),
  { ssr: false },
);

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Array.isArray(params.productId)
    ? params.productId[0]
    : params.productId;
  const resolvedProductId = productId ?? '';

  const globalStore = useGlobalStore((state) => state);
  const cartContext = useCartContext();

  const { data, loading } = useProductsQuery({
    variables: {
      first: 1,
      filter: {
        _id: {
          equal: resolvedProductId,
        },
      },
    },
    skip: !resolvedProductId,
  });

  const product = data?.products.edges?.[0]?.node;
  const relatedProductsQuery = useProductsQuery({
    variables: {
      first: 5,
      filter: {
        category: {
          in: product?.category ?? [],
        },
        _id: {
          notEqual: resolvedProductId,
        },
      },
    },
    skip: !product?.category?.length,
  });
  const [updateCartItem, { loading: adding }] = useUpdateCartItemMutation();

  const handleAddToCart = async () => {
    if (!product) return;
    if (!globalStore.authenticate.isAuthenticated) {
      globalStore.signIn.setIsSignIn(true);
      return;
    }

    try {
      await updateCartItem({
        variables: {
          input: {
            productId: product._id,
            quantity: 1,
          },
        },
      });

      cartContext.addCartItem({
        name: product.name,
        price: product.price,
        productId: product._id,
        quantity: 1,
        thumbnail: product.thumbnail,
        discount: product.discount,
        categories: product.category ?? [],
      });

      toaster.success({
        description: `${product.name} added to cart.`,
      });
    } catch (error) {
      toaster.error({
        description: 'Unable to add item to cart. Please try again.',
      });
    }
  };

  const discountAmount = product?.discount
    ? product.price * (product.discount / 100)
    : 0;
  const finalPrice = product ? product.price - discountAmount : 0;
  const isInStock = (product?.pieces ?? 0) > 0;

  const relatedProducts = useMemo(() => {
    return (
      relatedProductsQuery.data?.products.edges.map((edge) => edge.node) ?? []
    );
  }, [relatedProductsQuery.data]);

  return (
    <>
      <Sticky>
        <Highlight />
        <ClientOnlyNavbar />
      </Sticky>
      <Layout>
        <div className="mx-auto w-full max-w-screen px-4 sm:px-6 lg:px-10 py-8">
          {loading && (
            <div className="flex justify-center py-16">
              <Spinner className="h-16" />
            </div>
          )}

          {!loading && !product && (
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-gray-100 bg-white p-8 text-center">
              <p className="text-lg font-semibold text-gray-900">
                Product not found
              </p>
              <p className="text-sm text-gray-500">
                We couldn't find the product you're looking for.
              </p>
              <Button
                className="rounded-[32px] px-6 py-2 bg-cyan-700 text-white"
                onClick={() => router.push('/')}
              >
                Back to Home
              </Button>
            </div>
          )}

          {!loading && product && (
            <div className="flex flex-col gap-10">
              <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-8">
                <div className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
                  <div className="relative w-full max-h-[420px] aspect-[4/5] overflow-hidden rounded-2xl bg-gray-50">
                    <Image
                      src={product.thumbnail}
                      alt={product.name}
                      fill
                      className="object-cover"
                      priority
                    />
                    {product.discount > 0 && (
                      <div className="absolute top-4 left-4 rounded-full bg-cyan-700 px-3 py-1 text-xs font-semibold text-white">
                        {product.discount}% OFF
                      </div>
                    )}
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {product.category?.map((category) => (
                      <Badge.Root
                        key={category}
                        className="rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-xs text-cyan-700"
                      >
                        <Badge.Label>
                          {capitalize(category, {
                            delimiter: capitalize.delimiters.UNDERSCORE,
                          })}
                        </Badge.Label>
                      </Badge.Root>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-3">
                    <p className="text-3xl font-semibold text-gray-900">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-3">
                      <p className="text-2xl font-semibold text-gray-900">
                        {numberFormatter.format(finalPrice, {
                          locale: 'en-US',
                          currency: 'PHP',
                        })}
                      </p>
                      {product.discount > 0 && (
                        <p className="text-sm text-gray-400 line-through">
                          {numberFormatter.format(product.price, {
                            locale: 'en-US',
                            currency: 'PHP',
                          })}
                        </p>
                      )}
                    </div>
                    {product.discount > 0 && (
                      <p className="text-sm text-cyan-700">
                        Save{' '}
                        {numberFormatter.format(discountAmount, {
                          locale: 'en-US',
                          currency: 'PHP',
                        })}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-gray-200 bg-white p-4">
                      <p className="text-xs uppercase text-gray-500">Status</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {capitalize(product.status ?? 'unknown', {
                          delimiter: capitalize.delimiters.UNDERSCORE,
                        })}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-white p-4">
                      <p className="text-xs uppercase text-gray-500">Stock</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {product.pieces} available
                      </p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-white p-4">
                      <p className="text-xs uppercase text-gray-500">Points</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {numberFormatter.format(product.points ?? 0, {
                          minDecimalPlaces: 0,
                          maxDecimalPlaces: 0,
                        })}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-white p-4">
                      <p className="text-xs uppercase text-gray-500">SKU</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {product._id}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-500">
                    Enjoy the convenience and quality of this product. Add it to
                    your cart to secure your order today.
                  </div>

                  <Button
                    className="rounded-[32px] bg-cyan-700 text-white px-6 py-3 flex items-center justify-center gap-2 disabled:opacity-60"
                    onClick={handleAddToCart}
                    disabled={!isInStock || adding}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {isInStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </div>
              </div>

              {relatedProducts.length > 0 && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-semibold text-gray-900">
                      Related Products
                    </p>
                    <p className="text-sm text-gray-500">
                      Based on similar categories
                    </p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {relatedProducts.map((item) => (
                      <Cards key={item._id} {...item} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <Footer />
      </Layout>
    </>
  );
}
