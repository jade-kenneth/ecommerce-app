import { Flex } from '@chakra-ui/react';
import { useProductsQuery } from '@graphql/generated';
import { Cards } from './Cards';
import Container from './Container';

export const TopSelling = () => {
  const { data } = useProductsQuery();

  return (
    <Container title="Top Selling Products">
      <Flex flexWrap={'wrap'} gap="18px">
        {data?.products.edges.map((d, idx) => {
          return <Cards key={idx} {...d.node} isTopSold />;
        })}
      </Flex>
    </Container>
  );
};
