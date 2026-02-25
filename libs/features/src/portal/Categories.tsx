import Image, { StaticImageData } from 'next/image';
import { FunctionComponent } from 'react';
import { Container } from '../../../ui/components/Container';

interface CategoriesProps {}

export const categoryItems = [
  { name: 'Snacks', src: '/snacks.png', size: 100 },
  { name: 'Beverages', src: '/beverages.png', size: 100 },
  { name: 'Canned Goods', src: '/canned.png', size: 100 },
  { name: 'Instant Food', src: '/instant.png', size: 140 },
  { name: 'Rice', src: '/rice.png', size: 100 },
  { name: 'Cooking Essentials', src: '/cooking.png', size: 100 },
  { name: 'Fresh Produce', src: '/fresh.png', size: 150 },
  { name: 'Personal Care', src: '/personal.png', size: 150 },
  { name: 'Household Items ', src: '/household.png', size: 150 },
  { name: 'Sweets & Candies', src: '/sweets.png', size: 150 },
  { name: 'Health & Wellness', src: '/health.png', size: 150 },
  { name: 'Daily Dishes', src: '/dishes.png', size: 150 },
];

export const Categories: FunctionComponent<CategoriesProps> = () => {
  const items = categoryItems;

  return (
    <Container>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
        {items.map(({ name, src, size }) => {
          return (
            <div key={name} className="flex items-center">
              <Card name={name} imgSrc={src} size={size} />
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
    <div className="w-full h-full min-h-[160px] sm:min-h-[200px] flex flex-col items-center justify-between gap-3 rounded-2xl border border-carbon-950 bg-white shadow-md p-4 sm:p-5">
      <div className="flex-1 w-full flex items-center justify-center">
        <Image
          src={imgSrc as string}
          alt="carousel-image"
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
