import { Flex, Grid, GridItem, Text } from '@chakra-ui/react';
import Image, { StaticImageData } from 'next/image';
import { FunctionComponent } from 'react';
import { Container } from '~/components/Container';

//TODO

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
      <Grid
        gridRowGap={'58px'}
        gridColumnGap={'18px'}
        flexWrap={'wrap'}
        templateColumns="repeat(auto-fit,  minmax(181px, 1fr))"
        autoRows={'220px'}
      >
        {items.map(({ name, src, size }) => {
          return (
            <GridItem key={name} display={'flex'} alignItems={'center'}>
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
  imgSrc?: string | StaticImageData;
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
        boxShadow: 'md',
      }}
    >
      <Flex zIndex={2} flex={0.8} w="full" align={'center'} justify={'center'}>
        <Image
          src={imgSrc as string}
          alt="carousel-image"
          width={size}
          height={size}
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
