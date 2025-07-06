import { Flex } from '@chakra-ui/react';
import { useProductsQuery } from '@graphql/products';
import { FunctionComponent } from 'react';
import { Cards } from './Cards';
import Container from './Container';

interface HighPointProps {}

export const HighPoint: FunctionComponent<HighPointProps> = () => {
  const { data } = useProductsQuery();
  return (
    <Container
      title="High-Point Products"
      subTitle="Earn Big Points with These Products"
    >
      <Flex flexWrap={'wrap'} gap="18px">
        {data?.products.edges.map((d, idx) => {
          return <Cards key={idx} {...d.node} />;
        })}
      </Flex>
    </Container>
  );
};
