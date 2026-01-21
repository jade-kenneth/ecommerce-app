import { Flex, Text } from '@chakra-ui/react';

import { FunctionComponent } from 'react';
import { LuArrowDown } from 'react-icons/lu';
import { Button } from '~/components/Button';
import { Cards } from '~/components/Cards';
import { Container } from '~/components/Container';
import { useProductsQuery } from '~/graphql/generated';

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
