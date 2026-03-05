'use client';

import { useQuery } from '@apollo/client/react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Spinner } from '~/components';
import { Cards, categoryItems } from '~/features/portal';
import { PRODUCTS_QUERY } from '~/graphql/Product';
import { CategoryType } from '~/graphql/generated';

interface CategoryPageClientProps {
  categoryType: CategoryType;
  categoryName: string;
}

export default function CategoryPageClient({
  categoryType,
  categoryName,
}: CategoryPageClientProps) {
  const router = useRouter();
  const categoryMeta = categoryItems.find((item) => item.type === categoryType);
  const query = useQuery(PRODUCTS_QUERY, {
    variables: {
      first: 100,
      filter: {
        category: {
          in: [categoryType],
        },
      },
    },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: false,
  });

  const products =
    (query.data?.products.edges ?? query.previousData?.products.edges ?? [])
      .map((edge) => edge.node)
      .filter((product) => product.category?.includes(categoryType)) ?? [];
  const isInitialLoading = query.loading && products.length === 0;

  return (
    <div className="mx-auto w-full max-w-screen px-4 sm:px-6 lg:px-10 py-8 flex flex-col gap-6">
      <section className="rounded-3xl border border-cyan-100 bg-gradient-to-r from-cyan-50 via-white to-white p-5 sm:p-7">
        <p className="text-xs sm:text-sm text-gray-500">
          <Link href="/" className="hover:text-cyan-700 transition-colors">
            Home
          </Link>{' '}
          / <span className="font-semibold text-cyan-700">{categoryName}</span>
        </p>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {categoryMeta && (
              <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-cyan-100 bg-white sm:h-16 sm:w-16">
                <Image
                  src={categoryMeta.src}
                  alt={`${categoryMeta.name} icon`}
                  fill
                  className="object-contain p-2"
                  sizes="64px"
                />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
                {categoryName}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Browse products under this category.
              </p>
            </div>
          </div>

          {!isInitialLoading && (
            <div className="inline-flex items-center rounded-full bg-cyan-700 px-4 py-2 text-sm font-semibold text-white">
              {products.length} product{products.length === 1 ? '' : 's'}
            </div>
          )}
        </div>
      </section>

      <section className="flex flex-wrap gap-2">
        {categoryItems.map((item) => {
          const isActive = item.type === categoryType;

          return (
            <Link
              key={item.type}
              href={`/category/${item.slug}`}
              aria-current={isActive ? 'page' : undefined}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                isActive
                  ? 'bg-cyan-700 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-cyan-200 hover:text-cyan-700'
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </section>

      {isInitialLoading && (
        <div className="flex justify-center py-16">
          <Spinner className="h-16" />
        </div>
      )}

      {!isInitialLoading && products.length === 0 && (
        <div className="rounded-3xl border border-gray-100 bg-white p-8 text-center">
          <p className="text-lg font-semibold text-gray-900">
            No products in this category yet
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Try another category or browse all products from the home page.
          </p>
          <Button
            className="mt-4 rounded-[32px] bg-cyan-700 text-white px-6 py-2"
            onClick={() => {
              router.push('/');
            }}
          >
            Back to Home
          </Button>
        </div>
      )}

      {!isInitialLoading && products.length > 0 && (
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
          {products.map((product) => (
            <Cards key={product._id} {...product} />
          ))}
        </section>
      )}
    </div>
  );
}
