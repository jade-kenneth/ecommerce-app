import { Flex, Grid, GridItem, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { FunctionComponent } from 'react';
import {
  beverages,
  canned,
  cooking,
  dishes,
  fresh,
  health,
  household,
  instant,
  personal,
  rice,
  snacks,
  sweets,
} from '../images';
import Container from './Container';
interface CategoriesProps {}

export const Categories: FunctionComponent<CategoriesProps> = () => {
  const items = [
    { name: 'Snacks', src: snacks },
    { name: 'Beverages', src: beverages },
    { name: 'Canned Goods', src: canned },
    { name: 'Instant Food', src: instant, size: 140 },
    { name: 'Rice', src: rice },
    { name: 'Cooking </br> Essentials', src: cooking },
    { name: 'Fresh </br> Produce', src: fresh, size: 150 },
    { name: 'Personal </br> Care', src: personal, size: 150 },
    { name: 'Household </br> Items ', src: household, size: 150 },
    { name: '<p">Sweets & </br>Candies</p>', src: sweets, size: 150 },
    { name: 'Health & </br> Wellness', src: health, size: 150 },
    { name: 'Daily Dishes', src: dishes, size: 150 },
  ];

  return (
    <Container>
      <Grid
        gridRowGap={'58px'}
        gridColumnGap={'18px'}
        flexWrap={'wrap'}
        templateColumns="repeat(auto-fit,  minmax(181px, 1fr))"
        autoRows={'220px'}
      >
        {items.map(({ name, src, size }) => {
          return (
            <GridItem display={'flex'} alignItems={'center'}>
              <Card name={name} imgSrc={src} size={size} />
            </GridItem>
          );
        })}
      </Grid>
    </Container>
  );
};

interface CardProps {
  name: string;
  imgSrc?: string;
  size?: number;
}
export const Card = ({ imgSrc, name, size }: CardProps) => {
  return (
    <Flex
      w="11.3125rem"
      h="full"
      align={'center'}
      justify={'center'}
      gap="6px"
      direction={'column'}
      position={'relative'}
      _before={{
        content: '""',
        position: 'absolute',
        top: '50px',
        width: '181px',
        height: '189px',
        backgroundColor: 'white',
        borderColor: 'colors.carbon.950',
        borderWidth: '1px',
        zIndex: 1,
        borderRadius: '16px',
      }}
    >
      <Flex zIndex={2} flex={0.8} w="full" align={'center'} justify={'center'}>
        <Image
          src={imgSrc as string}
          objectFit="contain"
          alt="carousel-image"
          width={size ?? '100'}
          height={size ?? '100'}
        />
      </Flex>

      <Text
        flex={0.2}
        zIndex={2}
        sizes={'paragraph-xl'}
        color={'colors.carbon.100'}
        textAlign={'center'}
        fontWeight={500}
        dangerouslySetInnerHTML={{ __html: name }}
      />
    </Flex>
  );
};
