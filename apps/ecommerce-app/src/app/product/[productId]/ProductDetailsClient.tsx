'use client';

import { ShoppingCart, Star } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Badge, Button, Cards, Spinner, toaster } from '~/components';
import { Sticky } from '~/components/Sticky';
import { Footer, Highlight } from '~/features/portal';
import { useCartContext } from '~/features/portal/Cart/CartContext';
import { Layout } from '~/features/portal/layout/Layout';
import {
  useProductReviewsQuery,
  useProductsQuery,
  useUpdateCartItemMutation,
} from '~/graphql/generated';
import { useGlobalStore } from '~/hooks/useGlobalStore';
import { formatDate } from '~/utils';
import { capitalize } from '~/utils/capitalize';
import { numberFormatter } from '~/utils/numberFormatter';

const ClientOnlyNavbar = dynamic(
  () => import('~/features/portal').then((mod) => mod.Navbar),
  { ssr: false },
);

export default function ProductDetailsClient({
  productId,
}: {
  productId: string;
}) {
  const router = useRouter();

  const isAuthenticated = useGlobalStore(
    (state) => state.authenticate.isAuthenticated,
  );
  const setAuthDialogOpen = useGlobalStore(
    (state) => state.authenticate.setAuthDialogOpen,
  );
  const cartContext = useCartContext();

  const { data, loading } = useProductsQuery({
    variables: {
      first: 1,
      filter: {
        _id: {
          equal: productId,
        },
      },
    },
  });

  const productReviewsQuery = useProductReviewsQuery({
    variables: {
      productId,
    },
  });
  console.log(productReviewsQuery, 'reviews data');

  const product = data?.products.edges?.[0]?.node;
  const isProductLoading = loading;
  const relatedProductsQuery = useProductsQuery({
    variables: {
      first: 5,
      filter: {
        category: {
          in: product?.category ?? [],
        },
        _id: {
          notEqual: productId,
        },
      },
    },
    skip: !product?.category?.length,
  });
  const [updateCartItem, { loading: adding }] = useUpdateCartItemMutation();

  const handleAddToCart = async () => {
    if (!product) return;
    if (!isAuthenticated) {
      setAuthDialogOpen(true);
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

  const relatedProducts =
    relatedProductsQuery.data?.products.edges.map((edge) => edge.node) ?? [];
  const reviews = productReviewsQuery.data?.productReviews ?? [];

  const sortedReviews = [...reviews].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;
  const roundedAverageRating = Math.round(averageRating);

  return (
    <>
      <Sticky>
        <Highlight />
        <ClientOnlyNavbar />
      </Sticky>
      <Layout>
        <div className="mx-auto w-full max-w-screen px-4 sm:px-6 lg:px-10 py-8">
          {isProductLoading && (
            <div className="flex justify-center py-16">
              <Spinner className="h-16" />
            </div>
          )}

          {!isProductLoading && !product && (
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

          {!isProductLoading && product && (
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
                      sizes="(min-width: 1024px) 42vw, (min-width: 640px) 80vw, 92vw"
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
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          isInStock
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {isInStock ? 'In stock' : 'Out of stock'}
                      </span>
                      <span className="text-xs text-gray-400">
                        {product.pieces ?? 0} pieces available
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-white p-5">
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs uppercase tracking-wide text-gray-400">
                          Status
                        </span>
                        <span className="font-semibold text-gray-900">
                          {capitalize(product.status ?? 'active')}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs uppercase tracking-wide text-gray-400">
                          SKU
                        </span>
                        <span className="font-semibold text-gray-900">
                          {product._id}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs uppercase tracking-wide text-gray-400">
                          Points
                        </span>
                        <span className="font-semibold text-gray-900">
                          {numberFormatter.format(product.points ?? 0)}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs uppercase tracking-wide text-gray-400">
                          Discount
                        </span>
                        <span className="font-semibold text-gray-900">
                          {product.discount ?? 0}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button
                      size="lg"
                      className="rounded-2xl px-6"
                      onClick={handleAddToCart}
                      disabled={!isInStock || adding}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {adding ? 'Adding...' : 'Add to Cart'}
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-2xl px-6"
                      onClick={() => router.push('/cart')}
                    >
                      View Cart
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <p className="text-xl font-semibold text-gray-900">
                      Customer Reviews
                    </p>
                    <p className="text-sm text-gray-500">
                      {reviews.length} review{reviews.length === 1 ? '' : 's'}
                    </p>
                  </div>

                  {productReviewsQuery.loading && (
                    <div className="flex justify-center py-10">
                      <Spinner className="h-10" />
                    </div>
                  )}

                  {!productReviewsQuery.loading && reviews.length === 0 && (
                    <div className="mt-4 rounded-2xl border border-gray-100 bg-gray-50 p-5 text-sm text-gray-500">
                      No reviews yet for this product.
                    </div>
                  )}

                  {!productReviewsQuery.loading && reviews.length > 0 && (
                    <div className="mt-5 grid gap-4 lg:grid-cols-[220px_1fr]">
                      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                        <p className="text-3xl font-semibold text-gray-900">
                          {averageRating.toFixed(1)}
                        </p>
                        <div className="mt-2 flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <Star
                              key={value}
                              className={
                                value <= roundedAverageRating
                                  ? 'h-5 w-5 fill-cyan-400 text-cyan-400'
                                  : 'h-5 w-5 text-gray-300'
                              }
                            />
                          ))}
                        </div>
                        <p className="mt-2 text-xs text-gray-500">
                          Based on {reviews.length} verified purchase review
                          {reviews.length === 1 ? '' : 's'}
                        </p>
                      </div>

                      <div className="flex flex-col gap-3">
                        {sortedReviews.map((review) => {
                          const message = review.message?.trim() ?? '';
                          const formattedDate =
                            formatDate(review.createdAt, 'MMM dd, yyyy') ||
                            'Recent';

                          return (
                            <div
                              key={review._id}
                              className="rounded-2xl border border-gray-100 bg-white p-4"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((value) => (
                                    <Star
                                      key={value}
                                      className={
                                        value <= review.rating
                                          ? 'h-4 w-4 fill-cyan-400 text-cyan-400'
                                          : 'h-4 w-4 text-gray-300'
                                      }
                                    />
                                  ))}
                                </div>
                                <div className="flex items-center gap-2">
                                  {review.orderId && (
                                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                                      Verified purchase
                                    </span>
                                  )}
                                  <span className="text-xs text-gray-400">
                                    {formattedDate}
                                  </span>
                                </div>
                              </div>
                              <p className="mt-2 text-sm text-gray-700">
                                {message.length > 0
                                  ? message
                                  : 'No written feedback.'}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xl font-semibold text-gray-900">
                    Related Products
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-cyan-700"
                    onClick={() => router.push('/')}
                  >
                    Explore more
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
                  {relatedProducts.map((item) => (
                    <Cards
                      key={item._id}
                      __typename="Product"
                      _id={item._id}
                      name={item.name}
                      price={item.price}
                      discount={item.discount}
                      thumbnail={item.thumbnail}
                      points={item.points}
                      category={item.category ?? []}
                      status={item.status}
                      pieces={item.pieces}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>
      <Footer />
    </>
  );
}
