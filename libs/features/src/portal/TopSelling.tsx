import { Cards } from '../../../ui/components/Cards';
import { Container } from '../../../ui/components/Container';
import { useProductsQuery } from '~/graphql/generated';
import { useLicenseContext } from '~/providers/LicenseProvider/LicenseContext';

export const TopSelling = () => {
  const context = useLicenseContext();
  const { data } = useProductsQuery({
    skip: !context.isLicensed,
  });

  return (
    <Container title="Top Selling Products">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
        {data?.products.edges.map((d, idx) => {
          return <Cards key={idx} {...d.node} isTopSold />;
        })}
      </div>
    </Container>
  );
};
