import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  categoryItems,
  categorySlugToType,
  categoryTypeToSlug,
} from '~/features/portal/Categories';
import { CategoryType } from '~/graphql/generated';
import { capitalize } from '~/utils/capitalize';
import CategoryPageClient from './CategoryPageClient';

type CategoryPageParams = {
  category: string;
};

const CATEGORY_TYPES = Object.values(CategoryType) as CategoryType[];

function getCategoryName(type: CategoryType) {
  return capitalize(type, {
    delimiter: capitalize.delimiters.UNDERSCORE,
  });
}

export function generateStaticParams(): CategoryPageParams[] {
  return CATEGORY_TYPES.map((type) => ({
    category: categoryTypeToSlug(type),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<CategoryPageParams>;
}): Promise<Metadata> {
  const { category } = await params;
  const categoryType = categorySlugToType(category);

  if (!categoryType) {
    return {
      title: 'Category Not Found | Amy Store',
      description: 'The selected category does not exist on Amy Store.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const categoryName = getCategoryName(categoryType);
  const categoryAsset = categoryItems.find(
    (item) => item.type === categoryType,
  );
  const title = `${categoryName} | Amy Store`;
  const description = `Shop ${categoryName.toLowerCase()} products on Amy Store.`;
  const canonical = `/category/${categoryTypeToSlug(categoryType)}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    icons: {
      icon: '/Logo.png',
      shortcut: '/Logo.png',
      apple: '/Logo.png',
    },
    openGraph: {
      title,
      description,
      images: categoryAsset ? [{ url: categoryAsset.src }] : undefined,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<CategoryPageParams>;
}) {
  const { category } = await params;
  const categoryType = categorySlugToType(category);

  if (!categoryType) {
    notFound();
  }

  return (
    <CategoryPageClient
      categoryType={categoryType}
      categoryName={getCategoryName(categoryType)}
    />
  );
}
