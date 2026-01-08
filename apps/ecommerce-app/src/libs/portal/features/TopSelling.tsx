import { Flex } from '@chakra-ui/react';
import { Cards } from '../../global/src/components/Cards';
import Container from '../../global/src/components/Container';
import { useProductsQuery } from '../../global/src/graphql/generated';

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
