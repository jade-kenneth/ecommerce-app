import Image, { StaticImageData } from 'next/image';
import { FunctionComponent } from 'react';
import { Container } from '../../../ui/components/Container';

interface CategoriesProps {}

export const Categories: FunctionComponent<CategoriesProps> = () => {
  const items = [
    { name: 'Snacks', src: '/snacks.png', size: 100 },
    { name: 'Beverages', src: '/beverages.png', size: 100 },
    { name: 'Canned Goods', src: '/canned.png', size: 100 },
    { name: 'Instant Food', src: '/instant.png', size: 140 },
    { name: 'Rice', src: '/rice.png', size: 100 },
    { name: 'Cooking </br> Essentials', src: '/cooking.png', size: 100 },
    { name: 'Fresh </br> Produce', src: '/fresh.png', size: 150 },
    { name: 'Personal </br> Care', src: '/personal.png', size: 150 },
    { name: 'Household </br> Items ', src: '/household.png', size: 150 },
    { name: '<p">Sweets & </br>Candies</p>', src: '/sweets.png', size: 150 },
    { name: 'Health & </br> Wellness', src: '/health.png', size: 150 },
    { name: 'Daily Dishes', src: '/dishes.png', size: 150 },
  ];

  return (
    <Container>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(181px,1fr))] auto-rows-[220px] gap-x-[18px] gap-y-[58px] flex-wrap">
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
    <div className="w-[11.3125rem] h-full flex items-center justify-center gap-1.5 flex-col relative before:content-[''] before:absolute before:top-[50px] before:w-[181px] before:h-[189px] before:bg-white before:border before:border-carbon-950 before:z-[1] before:rounded-2xl before:shadow-md">
      <div className="z-[2] flex-[0.8] w-full flex items-center justify-center">
        <Image
          src={imgSrc as string}
          alt="carousel-image"
          width={size}
          height={size}
        />
      </div>

      <span
        className="flex-[0.2] z-[2] text-xl text-carbon-100 text-center font-medium"
        dangerouslySetInnerHTML={{ __html: name }}
      />
    </div>
  );
};
