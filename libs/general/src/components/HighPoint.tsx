import { Flex } from '@chakra-ui/react';
import { FunctionComponent } from 'react';
import { beverages, personal } from '../images';
import { Cards } from './Cards';
import Container from './Container';
import { CardProps } from './types';

interface HighPointProps {}

export const HighPoint: FunctionComponent<HighPointProps> = () => {
  const items: CardProps[] = [
    {
      name: 'Nova Cheddar Chips 78g',
      isTop: false,
      offPercent: 12.5,
      rewards: 12,
      price: 35,
      sold: 2500,
      rating: 3,
      isHighPoint: true,
      imgSrc: beverages,
    },
    {
      name: 'Nova Cheddar Chips 78g',
      isTop: false,
      offPercent: 2.5,
      rewards: 12,
      price: 80,
      sold: 2500,
      rating: 3,
      isHighPoint: true,
      imgSrc: personal,
    },
    {
      name: 'Nova Cheddar Chips 78g',
      isTop: false,
      offPercent: 2.5,
      rewards: 12,
      price: 80,
      sold: 2500,
      rating: 3,
      isHighPoint: true,
      imgSrc: personal,
    },
    {
      name: 'Nova Cheddar Chips 78g',
      isTop: false,
      offPercent: 2.5,
      rewards: 12,
      price: 80,
      sold: 2500,
      rating: 3,
      isHighPoint: true,
      imgSrc: personal,
    },
    {
      name: 'Nova Cheddar Chips 78g',
      isTop: false,
      offPercent: 2.5,
      rewards: 12,
      price: 80,
      sold: 2500,
      rating: 1,
      isHighPoint: true,
      imgSrc: personal,
    },
    {
      name: 'Nova Cheddar Chips 78g',
      isTop: false,
      offPercent: 2.5,
      rewards: 12,
      price: 80,
      sold: 2500,
      rating: 4,
      isHighPoint: true,
      imgSrc: personal,
    },
    {
      name: 'Nova Cheddar Chips 78g',
      isTop: false,
      offPercent: 2.5,
      rewards: 12,
      price: 80,
      sold: 2500,
      rating: 5,
      isHighPoint: true,
      imgSrc: personal,
    },
    {
      name: 'Nova Cheddar Chips 78g',
      isTop: false,
      offPercent: 2.5,
      rewards: 12,
      price: 80,
      sold: 2500,
      rating: 2,
      isHighPoint: true,
      imgSrc: personal,
    },
  ];
  return (
    <Container
      title="High-Point Products"
      subTitle="Earn Big Points with These Products"
    >
      <Flex flexWrap={'wrap'} gap="18px">
        {items.map((d) => {
          return <Cards {...d} />;
        })}
      </Flex>
    </Container>
  );
};
