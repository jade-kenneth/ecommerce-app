import axios, { type AxiosResponse } from 'axios';
import { print } from 'graphql';
import gql from 'graphql-tag';
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

const PRODUCTS_QUERY = gql`
  query ProductsForProductPage(
    $first: Int
    $after: Cursor
    $filter: ProductsFilterInput
  ) {
    products(first: $first, after: $after, filter: $filter) {
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

async function fetchProducts(options?: {
  productId?: string;
  first?: number;
}): Promise<ProductCoreDataFragment[]> {
  const portalApi = process.env.NEXT_PUBLIC_PORTAL_API!;
  const { productId, first = 1 } = options ?? {};

  try {
    const { data }: AxiosResponse<ProductQueryResponse> = await axios.post(
      portalApi,
      {
        query: print(PRODUCTS_QUERY),
        variables: {
          first,
          ...(productId
            ? {
                filter: { _id: { equal: productId } },
              }
            : {}),
        },
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 8000,
      },
    );

    return data?.data?.products?.edges.map(({ node }) => node) ?? [];
  } catch (e) {
    console.error('Failed to fetch products for product page metadata:', e);
    return [];
  }
}

async function fetchProduct(productId?: string) {
  const [product] = await fetchProducts({ productId, first: 1 });
  return product ?? null;
}

export async function generateStaticParams(): Promise<ProductIdParam[]> {
  const products = await fetchProducts({ first: 5 });
  return products.map((product) => ({ productId: product._id }));
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
