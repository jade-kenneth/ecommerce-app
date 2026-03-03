import type { Metadata } from 'next';
import Script from 'next/script';
import { apolloClient } from '~/config/client';
import {
  ProductCoreDataFragment,
  ProductsDocument,
  ProductsQuery,
  ProductsQueryVariables,
} from '~/graphql/generated';
import ProductDetailsClient from './ProductDetailsClient';

type ProductIdParam = { productId: string };

async function fetchProducts(options?: {
  productId?: string;
  first?: number;
}): Promise<ProductCoreDataFragment[]> {
  const { productId, first = 1 } = options ?? {};

  try {
    const result = await apolloClient.query<
      ProductsQuery,
      ProductsQueryVariables
    >({
      query: ProductsDocument,
      variables: {
        first,
        ...(productId
          ? {
              filter: { _id: { equal: productId } },
            }
          : {}),
      },
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    });

    const edges = result.data?.products?.edges;
    if (!edges) return [];
    return edges.map(({ node }) => node);
  } catch (e) {
    console.error('Failed to fetch products for product page metadata:', e);
    return [];
  }
}

async function fetchProduct(productId?: string) {
  const [product] = await fetchProducts({ productId, first: 1 });
  return product ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<ProductIdParam>;
}): Promise<Metadata> {
  const { productId } = await params;

  const product = await fetchProduct(productId);

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
      icon: '/Logo.png',
      shortcut: '/Logo.png',
      apple: '/Logo.png',
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

  const product = await fetchProduct(productId);

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

      <ProductDetailsClient productId={productId} />
    </>
  );
}
