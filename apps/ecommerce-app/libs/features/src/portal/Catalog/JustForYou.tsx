import { FunctionComponent } from 'react';
import { useQuery } from '@apollo/client/react';
import { PRODUCTS_QUERY } from '~/graphql/Product';
import { useLicenseContext } from '~/providers/LicenseProvider/LicenseContext';
import { Cards } from './components/Cards';
import { Container } from '~/components/Container';

interface JustForYouProps {}

export const JustForYou: FunctionComponent<JustForYouProps> = () => {
  const context = useLicenseContext();
  const { data } = useQuery(PRODUCTS_QUERY, {
    skip: !context.isLicensed,
  });
  return (
    <Container title="Just For You">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(194px,1fr))] gap-4 sm:gap-5">
        {data?.products.edges.map((d, idx) => {
          return <Cards key={idx} {...d.node} />;
        })}
      </div>

      {/* <div className="w-full flex justify-center mt-8 sm:mt-10 items-center">
        <Button
          variant="ghost"
          className="flex items-center gap-3 font-semibold text-cyan-700 hover:text-cyan-600 text-sm sm:text-base"
        >
          <span className="text-base sm:text-lg">See More</span>
          <ArrowDown />
        </Button>
      </div> */}
    </Container>
  );
};
