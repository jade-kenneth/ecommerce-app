import axios, { type AxiosResponse } from 'axios';
import type { Metadata } from 'next';
import ProductDetailsClient from './ProductDetailsClient';

type ProductIdParam = {
  productId: string;
};

const OFFLINE_FALLBACK_PRODUCT_PARAMS: ProductIdParam[] = [
  { productId: 'offline-placeholder' },
];

type ProductIdsQueryResponse = {
  data?: {
    products?: {
      edges?: Array<{
        node?: {
          _id?: string | null;
        } | null;
      }>;
      pageInfo?: {
        hasNextPage?: boolean | null;
        endCursor?: string | null;
      } | null;
    } | null;
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
          _id
        }
      }
    }
  }
`;

function getOfflineFallbackProductStaticParams(
  reason: string,
): ProductIdParam[] {
  console.warn(
    `Using offline fallback product static params (${reason}). Static export will not include the full product catalog without API access.`,
  );

  return OFFLINE_FALLBACK_PRODUCT_PARAMS;
}

async function fetchProductStaticParams(): Promise<ProductIdParam[]> {
  const portalApi = process.env.NEXT_PUBLIC_PORTAL_API;

  if (!portalApi) {
    return getOfflineFallbackProductStaticParams(
      'missing NEXT_PUBLIC_PORTAL_API',
    );
  }

  const params: ProductIdParam[] = [];
  let after: string | null = null;
  let hasNextPage = true;

  try {
    while (hasNextPage) {
      const apiResponse: AxiosResponse<ProductIdsQueryResponse> =
        await axios.post(
          portalApi,
          {
            query: PRODUCT_IDS_QUERY,
            variables: {
              first: 200,
              after,
            },
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 5000,
          },
        );

      const products = apiResponse.data?.data?.products;
      const edges = products?.edges ?? [];

      params.push(
        ...edges
          .map((edge) => edge?.node?._id)
          .filter((id): id is string => typeof id === 'string' && id.length > 0)
          .map((productId) => ({ productId })),
      );

      const pageInfo = products?.pageInfo;
      hasNextPage = Boolean(pageInfo?.hasNextPage);
      after = pageInfo?.endCursor ?? null;

      if (!after && hasNextPage) {
        // Defensive break for malformed pagination responses.
        break;
      }
    }
  } catch (error) {
    console.error('Failed to generate static params for products:', error);
    return getOfflineFallbackProductStaticParams('API request failed');
  }

  if (params.length === 0) {
    return getOfflineFallbackProductStaticParams('empty product ID result');
  }

  return params;
}

export async function generateStaticParams(): Promise<ProductIdParam[]> {
  return fetchProductStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<ProductIdParam>;
}): Promise<Metadata> {
  const resolvedParams = await params;

  return {
    title: 'Product Details',
    description: `View product details, pricing, and availability for item ${resolvedParams.productId} on Amy.`,
  };
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<ProductIdParam>;
}) {
  const resolvedParams = await params;

  return <ProductDetailsClient productId={resolvedParams.productId} />;
}
