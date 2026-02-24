import type { Metadata } from 'next';
import ProductDetailsClient from './ProductDetailsClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ productId: string }>;
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
  params: Promise<{ productId: string }>;
}) {
  const resolvedParams = await params;

  return <ProductDetailsClient productId={resolvedParams.productId} />;
}
