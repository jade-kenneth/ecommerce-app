import { Flex, Text } from '@chakra-ui/react';

import { FunctionComponent } from 'react';
import { LuArrowDown } from 'react-icons/lu';
import { Button } from '../../global/src';
import { Cards } from '../../global/src/components/Cards';
import Container from '../../global/src/components/Container';
import { useProductsQuery } from '../../global/src/graphql/generated';

interface JustForYouProps {}

export const JustForYou: FunctionComponent<JustForYouProps> = () => {
  const { data } = useProductsQuery();
  return (
    <Container title="Just For You">
      <Flex flexWrap={'wrap'} gap="18px">
        {data?.products.edges.map((d, idx) => {
          return <Cards key={idx} {...d.node} />;
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
