import { useQuery } from '@apollo/client/react';
import { Container } from '~/components';
import { PRODUCTS_QUERY } from '~/graphql/Product';
import { useLicenseContext } from '~/providers/LicenseProvider/LicenseContext';
import { Cards } from './components/Cards';

export const TopSelling = () => {
  const context = useLicenseContext();
  const { data } = useQuery(PRODUCTS_QUERY, {
    skip: !context.isLicensed,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });

  return (
    <Container title="Top Selling Products">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(194px,1fr))] gap-4 sm:gap-5">
        {data?.products.edges.map((d, idx) => {
          return <Cards key={idx} {...d.node} isTopSold />;
        })}
      </div>
    </Container>
  );
};
