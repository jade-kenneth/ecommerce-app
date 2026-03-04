import type { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import Script from 'next/script';
import { apolloClient } from '~/config/client';
import {
  ProductCoreDataFragment,
  ProductReviewsDocument,
  ProductReviewsQuery,
  ProductReviewsQueryVariables,
  ProductsDocument,
  ProductsQuery,
  ProductsQueryVariables,
} from '~/graphql/generated';
import ProductDetailsClient from './ProductDetailsClient';

type ProductIdParam = { productId: string };
type ProductPageData = {
  product: ProductCoreDataFragment | null;
  reviews: ProductReviewsQuery['productReviews'];
  relatedProducts: ProductCoreDataFragment[];
};

const PRODUCT_PAGE_REVALIDATE_SECONDS = 300;
const STATIC_PARAMS_PAGE_SIZE = 100;
const STATIC_PARAMS_MAX_PAGES = 10;
export const revalidate = 300;

async function queryProducts(
  variables: ProductsQueryVariables,
): Promise<ProductsQuery['products'] | null> {
  try {
    const result = await apolloClient.query<
      ProductsQuery,
      ProductsQueryVariables
    >({
      query: ProductsDocument,
      variables,
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    });

    return result.data?.products ?? null;
  } catch (e) {
    console.error('Failed to fetch products for product page:', e);
    return null;
  }
}

async function queryProductReviews(
  productId: string,
): Promise<ProductReviewsQuery['productReviews']> {
  try {
    const result = await apolloClient.query<
      ProductReviewsQuery,
      ProductReviewsQueryVariables
    >({
      query: ProductReviewsDocument,
      variables: { productId },
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    });

    return result.data?.productReviews ?? [];
  } catch (e) {
    console.error('Failed to fetch product reviews for product page:', e);
    return [];
  }
}

const getProductPageData = unstable_cache(
  async (productId: string): Promise<ProductPageData> => {
    const productConnection = await queryProducts({
      first: 1,
      filter: {
        _id: {
          equal: productId,
        },
      },
    });

    const product = productConnection?.edges?.[0]?.node ?? null;

    if (!product) {
      return {
        product: null,
        reviews: [],
        relatedProducts: [],
      };
    }

    const [reviews, relatedConnection] = await Promise.all([
      queryProductReviews(productId),
      product.category?.length
        ? queryProducts({
            first: 5,
            filter: {
              category: {
                in: product.category,
              },
              _id: {
                notEqual: productId,
              },
            },
          })
        : Promise.resolve(null),
    ]);

    return {
      product,
      reviews,
      relatedProducts: relatedConnection?.edges?.map(({ node }) => node) ?? [],
    };
  },
  ['product-page-data'],
  { revalidate: PRODUCT_PAGE_REVALIDATE_SECONDS },
);

const getStaticProductIds = unstable_cache(
  async (): Promise<string[]> => {
    const ids: string[] = [];
    let after: ProductsQueryVariables['after'];
    let pageCount = 0;
    let hasNextPage = true;

    while (hasNextPage && pageCount < STATIC_PARAMS_MAX_PAGES) {
      const productsConnection = await queryProducts({
        first: STATIC_PARAMS_PAGE_SIZE,
        ...(after ? { after } : {}),
      });

      const edges = productsConnection?.edges ?? [];
      if (!edges.length) break;

      ids.push(...edges.map((edge) => edge.node._id));

      const endCursor = productsConnection?.pageInfo?.endCursor ?? null;
      hasNextPage = Boolean(
        productsConnection?.pageInfo?.hasNextPage && endCursor,
      );
      after = endCursor ?? undefined;
      pageCount += 1;
    }

    return Array.from(new Set(ids));
  },
  ['product-page-static-params'],
  { revalidate: PRODUCT_PAGE_REVALIDATE_SECONDS },
);

export async function generateStaticParams(): Promise<ProductIdParam[]> {
  const productIds = await getStaticProductIds();
  return productIds.map((productId) => ({ productId }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<ProductIdParam>;
}): Promise<Metadata> {
  const { productId } = await params;
  const { product } = await getProductPageData(productId);

  const title = product?.name
    ? `${product.name} | Amy`
    : 'Product Details | Amy';
  const description = `View product details, pricing, and availability for item ${productId} on Amy.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/product/${productId}`,
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
    openGraph: product?.thumbnail
      ? {
          title,
          description,
          images: [{ url: product.thumbnail }],
        }
      : undefined,
  };
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<ProductIdParam>;
}) {
  const { productId } = await params;

  const { product, reviews, relatedProducts } =
    await getProductPageData(productId);

  const structuredData = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: [product.thumbnail],
        description:
          'View product details, pricing, and availability for this item on Amy Store.',

        brand: {
          '@type': 'Brand',
          name: 'Amy Store',
        },
        offers: {
          '@type': 'Offer',
          url: `/product/${productId}`,
          priceCurrency: 'PHP',
          price: String(product.price),
          availability:
            product.pieces <= 0
              ? 'https://schema.org/OutOfStock'
              : 'https://schema.org/InStock',
          itemCondition: 'https://schema.org/NewCondition',
        },
      }
    : null;

  return (
    <>
      {structuredData ? (
        <Script
          id="product-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      ) : null}

      <ProductDetailsClient
        product={product}
        reviews={reviews}
        relatedProducts={relatedProducts}
      />
    </>
  );
}
