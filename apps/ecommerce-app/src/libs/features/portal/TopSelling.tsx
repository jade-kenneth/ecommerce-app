import { Flex } from '@chakra-ui/react';
import { Cards } from '~/components/Cards';
import { Container } from '~/components/Container';
import { useProductsQuery } from '~/graphql/generated';

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
