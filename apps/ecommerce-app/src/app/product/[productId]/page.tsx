import ProductDetailsClient from './ProductDetailsClient';

type ProductPageParams = {
  productId: string;
};

const PRODUCT_IDS_QUERY = `
  query ProductIds($first: Int, $after: Cursor) {
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

export async function generateStaticParams(): Promise<ProductPageParams[]> {
  const endpoint = process.env.NEXT_PUBLIC_PORTAL_API;
  if (!endpoint) {
    console.warn(
      'NEXT_PUBLIC_PORTAL_API is not set. Skipping product pre-rendering.',
    );
    return [];
  }

  const params: ProductPageParams[] = [];
  let after: string | null = null;
  const pageSize = 100;
  const maxPages = 20;

  try {
    for (let page = 0; page < maxPages; page += 1) {
      const response: Response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: PRODUCT_IDS_QUERY,
          variables: { first: pageSize, after },
        }),
        cache: 'no-store',
      });

      if (!response.ok) {
        console.warn(
          `Failed to fetch products for static params: ${response.status}`,
        );
        break;
      }

      const payload = await response.json();
      const edges = payload?.data?.products?.edges ?? [];
      for (const edge of edges) {
        const id = edge?.node?._id;
        if (id) {
          params.push({ productId: id });
        }
      }

      const pageInfo = payload?.data?.products?.pageInfo;
      if (!pageInfo?.hasNextPage || !pageInfo?.endCursor) {
        break;
      }

      after = pageInfo.endCursor;
    }
  } catch (error) {
    console.warn('Failed to pre-render products.', error);
  }

  if (params.length === 0) {
    const fallbackId =
      process.env.NEXT_PUBLIC_FALLBACK_PRODUCT_ID ?? 'placeholder';
    console.warn(
      `No products found for static export. Using fallback productId "${fallbackId}".`,
    );
    return [{ productId: fallbackId }];
  }

  return params;
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<ProductPageParams>;
}) {
  const { productId } = await params;
  return <ProductDetailsClient productId={productId} />;
}
