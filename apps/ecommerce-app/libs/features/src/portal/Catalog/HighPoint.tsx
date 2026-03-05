import { useQuery } from '@apollo/client/react';
import { FunctionComponent } from 'react';
import { Container } from '~/components';
import { HIGH_POINT_PRODUCTS_QUERY } from '~/graphql/Product';
import { useLicenseContext } from '~/providers/LicenseProvider/LicenseContext';
import { Cards } from './components/Cards';

interface HighPointProps {}

export const HighPoint: FunctionComponent<HighPointProps> = () => {
  const context = useLicenseContext();
  const { data } = useQuery(HIGH_POINT_PRODUCTS_QUERY, {
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
