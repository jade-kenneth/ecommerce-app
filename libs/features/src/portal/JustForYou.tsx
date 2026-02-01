import { ArrowDown } from 'lucide-react';
import { FunctionComponent } from 'react';
import { Button } from '../../../ui/components/Button';
import { Cards } from '../../../ui/components/Cards';
import { Container } from '../../../ui/components/Container';
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
      <div className="flex flex-wrap gap-4.5">
        {data?.products.edges.map((d, idx) => {
          return <Cards key={idx} {...d.node} />;
        })}
      </div>

      <div className="w-full flex justify-center mt-10 items-center">
        <Button
          variant="ghost"
          className="flex items-center gap-3 font-semibold text-cyan-700 hover:text-cyan-600"
        >
          <span className="text-lg">See More</span>
          <ArrowDown />
        </Button>
      </div>
    </Container>
  );
};
