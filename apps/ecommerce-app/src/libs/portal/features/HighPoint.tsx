import { Flex } from '@chakra-ui/react';

import { FunctionComponent } from 'react';
import { Cards } from '../../global/src/components/Cards';
import Container from '../../global/src/components/Container';
import { useHighPointProductsQuery } from '../../global/src/graphql/generated';

interface HighPointProps {}

export const HighPoint: FunctionComponent<HighPointProps> = () => {
  const { data } = useHighPointProductsQuery();
  return (
    <Container
      title="High-Point Products"
      subTitle="Earn Big Points with These Products"
    >
      <Flex flexWrap={'wrap'} gap="18px">
        {data?.highPointProducts.edges.map((d, idx) => {
          return <Cards key={idx} {...d.node} isHighPoint />;
        })}
      </Flex>
    </Container>
  );
};
