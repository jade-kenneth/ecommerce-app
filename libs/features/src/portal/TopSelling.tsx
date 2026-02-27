import { useProductsQuery } from '~/graphql/generated';
import { useLicenseContext } from '~/providers/LicenseProvider/LicenseContext';
import { Cards } from '../../../ui/components/Cards';
import { Container } from '../../../ui/components/Container';

export const TopSelling = () => {
  const context = useLicenseContext();
  const { data } = useProductsQuery({
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
