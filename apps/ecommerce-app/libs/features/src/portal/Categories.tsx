/** trigger */

import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import { FunctionComponent } from 'react';
import { Container } from '~/components/Container';
import { CategoryType } from '~/graphql/generated';
import { capitalize } from '~/utils/capitalize';

interface CategoriesProps {}

const CATEGORY_ASSETS: Record<CategoryType, { src: string; size: number }> = {
  [CategoryType.Beverages]: { src: '/beverages.png', size: 100 },
  [CategoryType.Canned]: { src: '/canned.png', size: 100 },
  [CategoryType.DailyDishes]: { src: '/dishes.png', size: 150 },
  [CategoryType.Essentials]: { src: '/cooking.png', size: 100 },
  [CategoryType.HealthWellness]: { src: '/health.png', size: 150 },
  [CategoryType.HouseholdItems]: { src: '/household.png', size: 150 },
  [CategoryType.Instant]: { src: '/instant.png', size: 140 },
  [CategoryType.PersonalCare]: { src: '/personal.png', size: 150 },
  [CategoryType.Rice]: { src: '/rice.png', size: 100 },
  [CategoryType.Snacks]: { src: '/snacks.png', size: 100 },
  [CategoryType.Sweets]: { src: '/sweets.png', size: 150 },
};

const CATEGORY_TYPES = Object.values(CategoryType) as CategoryType[];

export const categoryTypeToSlug = (type: CategoryType) =>
  type.toLowerCase().replaceAll('_', '-');

export const categorySlugToType = (slug: string) => {
  const normalizedSlug = slug.trim().toLowerCase();
  return (
    CATEGORY_TYPES.find(
      (type) => categoryTypeToSlug(type) === normalizedSlug,
    ) ?? null
  );
};

export const categoryItems = CATEGORY_TYPES.map((type) => ({
  type,
  slug: categoryTypeToSlug(type),
  name: capitalize(type, {
    delimiter: capitalize.delimiters.UNDERSCORE,
  }),
  ...CATEGORY_ASSETS[type],
}));

export const Categories: FunctionComponent<CategoriesProps> = () => {
  const items = categoryItems;

  return (
    <Container>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
        {items.map(({ type, slug, name, src, size }) => {
          return (
            <div key={type} className="flex items-center">
              <Link href={`/category/${slug}`} className="w-full h-full">
                <Card name={name} imgSrc={src} size={size} />
              </Link>
            </div>
          );
        })}
      </div>
    </Container>
  );
};

interface CardProps {
  name: string;
  imgSrc?: string | StaticImageData;
  size?: number;
}

export const Card = ({ imgSrc, name, size }: CardProps) => {
  return (
    <div className="w-full h-full min-h-[160px] sm:min-h-[200px] flex flex-col items-center justify-between gap-3 rounded-2xl border border-carbon-950 bg-white shadow-md p-4 sm:p-5 transform-gpu transition-transform duration-300 ease-out will-change-transform motion-reduce:transition-none motion-reduce:transform-none hover:scale-[1.03]">
      <div className="flex-1 w-full flex items-center justify-center">
        <Image
          src={imgSrc as string}
          alt={`${name} category`}
          width={size}
          height={size}
          className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-contain"
        />
      </div>

      <span className="text-sm sm:text-base lg:text-lg text-carbon-100 text-center font-medium">
        {name}
      </span>
    </div>
  );
};
