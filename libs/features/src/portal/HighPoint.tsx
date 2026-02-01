import { FunctionComponent } from 'react';
import { Cards } from '../../../ui/components/Cards';
import { Container } from '../../../ui/components/Container';
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
      <div className="flex flex-wrap gap-[18px]">
        {data?.highPointProducts.edges.map((d, idx) => {
          return <Cards key={idx} {...d.node} isHighPoint />;
        })}
      </div>
    </Container>
  );
};
