import { Flex, Text } from '@chakra-ui/react';

import { FunctionComponent } from 'react';
import { LuArrowDown } from 'react-icons/lu';
import { Button } from '~/components/Button';
import { Cards } from '~/components/Cards';
import { Container } from '~/components/Container';
import { useProductsQuery } from '~/graphql/generated';
import { useLicenseContext } from '~/providers/LicenseProvider/LicenseContext';

interface JustForYouProps {}

export const JustForYou: FunctionComponent<JustForYouProps> = () => {
  const context = useLicenseContext();
  const { data } = useProductsQuery({
    skip: !context.isLicensed,
  });
  return (
    <Container title="Just For You">
      <Flex flexWrap={'wrap'} gap="18px">
        {data?.products.edges.map((d, idx) => {
          return <Cards key={idx} {...d.node} />;
        })}
      </Flex>

      <Flex w="full" justify={'center'} mt="40px" alignItems={'center'}>
        <Button
          variant="ghost"
          className="flex items-center gap-3 font-semibold text-cyan-700 hover:text-cyan-600"
        >
          <Text sizes={'paragraph-lg'}> See More</Text>
          <LuArrowDown />
        </Button>
      </Flex>
    </Container>
  );
};
