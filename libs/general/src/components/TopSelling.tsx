import { Flex } from '@chakra-ui/react';
import { beverages, snacks } from '../images';
import { Cards } from './Cards';
import Container from './Container';
import { CardProps } from './types';

export const TopSelling = () => {
  const items: CardProps[] = [
    {
      name: 'Nova Cheddar Chips 78g',
      isTop: true,
      offPercent: 12.5,
      rewards: 12,
      price: 35,
      sold: 2500,
      rating: 3,
      isHighPoint: false,
      imgSrc: snacks,
    },
    {
      name: 'Nova Cheddar Chips 78g',
      isTop: true,
      offPercent: 12.5,
      rewards: 12,
      price: 35,
      sold: 2500,
      rating: 3,
      isHighPoint: false,
      imgSrc: beverages,
    },
    {
      name: 'Nova Cheddar Chips 78g',
      isTop: true,
      offPercent: 12.5,
      rewards: 12,
      price: 35,
      sold: 2500,
      rating: 3,
      isHighPoint: false,
      imgSrc: beverages,
    },
    {
      name: 'Nova Cheddar Chips 78g',
      isTop: true,
      offPercent: 12.5,
      rewards: 12,
      price: 35,
      sold: 2500,
      rating: 3,
      isHighPoint: false,
      imgSrc: beverages,
    },
    {
      name: 'Nova Cheddar Chips 78g',
      isTop: true,
      offPercent: 12.5,
      rewards: 12,
      price: 35,
      sold: 2500,
      rating: 3,
      isHighPoint: false,
      imgSrc: beverages,
    },
    {
      name: 'Nova Cheddar Chips 78g',
      isTop: true,
      offPercent: 12.5,
      rewards: 12,
      price: 35,
      sold: 2500,
      rating: 3,
      isHighPoint: false,
      imgSrc: beverages,
    },
    {
      name: 'Nova Cheddar Chips 78g',
      isTop: true,
      offPercent: 12.5,
      rewards: 12,
      price: 35,
      sold: 2500,
      rating: 3,
      isHighPoint: false,
      imgSrc: beverages,
    },
    {
      name: 'Nova Cheddar Chips 78g',
      isTop: true,
      offPercent: 12.5,
      rewards: 12,
      price: 35,
      sold: 2500,
      rating: 3,
      isHighPoint: false,
      imgSrc: beverages,
    },
    {
      name: 'Nova Cheddar Chips 78g',
      isTop: true,
      offPercent: 12.5,
      rewards: 12,
      price: 35,
      sold: 2500,
      rating: 3,
      isHighPoint: false,
      imgSrc: beverages,
    },
    {
      name: 'Nova Cheddar Chips 78g',
      isTop: true,
      offPercent: 12.5,
      rewards: 12,
      price: 35,
      sold: 2500,
      rating: 3,
      isHighPoint: false,
      imgSrc: beverages,
    },
  ];
  return (
    <Container title="Top Selling Products">
      <Flex flexWrap={'wrap'} gap="18px">
        {items.map((d) => {
          return <Cards {...d} />;
        })}
      </Flex>
    </Container>
  );
};
