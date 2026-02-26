import axios, { type AxiosResponse } from 'axios';
import type { Metadata } from 'next';
import Script from 'next/script';
import { ProductCoreDataFragment } from '~/graphql/generated';
import ProductDetailsClient from './ProductDetailsClient';

type ProductIdParam = { productId: string };

interface Paginated<T> {
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
  edges: Array<{
    node: T;
  }>;
}

type ProductQueryResponse = {
  data?: {
    products?: Paginated<ProductCoreDataFragment> | null;
  };
  errors?: Array<{ message?: string }>;
};

const PRODUCT_IDS_QUERY = `
  query ProductStaticParams($first: Int, $after: Cursor) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          ... on Product {
            _id
            name
            thumbnail
            price
            pieces
          }
        }
      }
    }
  }
`;

async function fetchProduct(productId: string) {
  const portalApi = process.env.NEXT_PUBLIC_PORTAL_API;
  if (!portalApi) return null;

  try {
    const { data }: AxiosResponse<ProductQueryResponse> = await axios.post(
      portalApi,
      {
        query: PRODUCT_IDS_QUERY,
        variables: { filter: { _id: productId }, first: 1 },
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 8000,
      },
    );

    const product = data?.data?.products?.edges[0]?.node ?? null;

    return product;
  } catch (e) {
    console.error('Failed to fetch product for JSON-LD:', e);
    return null;
  }
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
      canonical: `https://yourdomain.com/products/${productId}`,
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
          url: `https://yourdomain.com/products/${productId}`,
          priceCurrency: 'PHP',
          price: String(product.price),
          availability:
            product.pieces < 0
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
