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
      <div className="flex-wrap flex gap-[18px]">
        {data?.products.edges.map((d, idx) => {
          return <Cards key={idx} {...d.node} isTopSold />;
        })}
      </div>
    </Container>
  );
};
