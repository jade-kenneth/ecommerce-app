import { Flex, Text } from '@chakra-ui/react';
import { FunctionComponent } from 'react';
import { LuArrowDown } from 'react-icons/lu';
import { beverages, snacks } from '../images';
import { Button } from './Button';
import { Cards } from './Cards';
import Container from './Container';
import { CardProps } from './types';

interface JustForYouProps {}

export const JustForYou: FunctionComponent<JustForYouProps> = () => {
  const items: CardProps[] = [
    {
      name: 'Nova Cheddar Chips 78g',
      isTop: false,
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
      isTop: false,
      offPercent: 2.5,
      rewards: 12,
      price: 80,
      sold: 2500,
      rating: 3,
      isHighPoint: false,
      imgSrc: snacks,
    },
    {
      name: 'Nova Cheddar Chips 78g',
      isTop: false,
      offPercent: 2.5,
      rewards: 12,
      price: 80,
      sold: 2500,
      rating: 3,
      isHighPoint: false,
      imgSrc: snacks,
    },
    {
      name: 'Nova Cheddar Chips 78g',
      isTop: false,
      offPercent: 2.5,
      rewards: 12,
      price: 80,
      sold: 2500,
      rating: 3,
      isHighPoint: false,
      imgSrc: snacks,
    },
    {
      name: 'Nova Cheddar Chips 78g',
      isTop: false,
      offPercent: 2.5,
      rewards: 12,
      price: 80,
      sold: 2500,
      rating: 3,
      isHighPoint: false,
      imgSrc: snacks,
    },
    {
      name: 'Nova Cheddar Chips 78g',
      isTop: false,
      offPercent: 2.5,
      rewards: 12,
      price: 80,
      sold: 2500,
      rating: 3,
      isHighPoint: false,
      imgSrc: snacks,
    },
    {
      name: 'Nova Cheddar Chips 78g',
      isTop: false,
      offPercent: 2.5,
      rewards: 12,
      price: 80,
      sold: 2500,
      rating: 3,
      isHighPoint: false,
      imgSrc: snacks,
    },
    {
      name: 'Nova Cheddar Chips 78g',
      isTop: false,
      offPercent: 2.5,
      rewards: 12,
      price: 80,
      sold: 2500,
      rating: 3,
      isHighPoint: false,
      imgSrc: snacks,
    },
    {
      name: 'Nova Cheddar Chips 78g',
      isTop: false,
      offPercent: 2.5,
      rewards: 12,
      price: 80,
      sold: 2500,
      rating: 3,
      isHighPoint: false,
      imgSrc: snacks,
    },
  ];
  return (
    <Container title="Just For You">
      <Flex flexWrap={'wrap'} gap="18px">
        {items.map((d) => {
          return <Cards {...d} />;
        })}
      </Flex>

      <Flex w="full" justify={'center'} mt="40px" alignItems={'center'}>
        <Button
          visual={'ghost'}
          display={'flex'}
          alignItems={'center'}
          gap="12px"
          fontWeight={600}
        >
          <Text sizes={'paragraph-lg'}> See More</Text>
          <LuArrowDown />
        </Button>
      </Flex>
    </Container>
  );
};
