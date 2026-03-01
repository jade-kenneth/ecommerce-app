import { useHighPointProductsQuery } from '~/graphql/generated';
import { useLicenseContext } from '~/providers/LicenseProvider/LicenseContext';
import { FunctionComponent } from 'react';
import { Cards } from '~/components/Cards';
import { Container } from '~/components/Container';

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
      <div className="grid grid-cols-[repeat(auto-fill,minmax(194px,1fr))] gap-4 sm:gap-5">
        {data?.highPointProducts.edges.map((d, idx) => {
          return <Cards key={idx} {...d.node} isHighPoint />;
        })}
      </div>
    </Container>
  );
};
