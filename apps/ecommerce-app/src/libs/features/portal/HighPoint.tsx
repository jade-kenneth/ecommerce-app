import { Flex } from '@chakra-ui/react';

import { FunctionComponent } from 'react';
import { Cards } from '~/components/Cards';
import { Container } from '~/components/Container';
import { useHighPointProductsQuery } from '~/graphql/generated';
import { useLicenseContext } from '~/providers/LicenseProvider/LicenseContext';

interface HighPointProps {}

export const HighPoint: FunctionComponent<HighPointProps> = () => {
  const context = useLicenseContext();
  const { data } = useHighPointProductsQuery({
    skip: !context.isLicensed,
  });
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
