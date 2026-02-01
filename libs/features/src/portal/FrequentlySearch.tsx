import { FunctionComponent } from 'react';
import { Badge } from '~/components/ui/Badge';

interface FrequentlySearchedProps {}

export const FrequentlySearched: FunctionComponent<
  FrequentlySearchedProps
> = () => {
  return (
    <div className="flex py-4 border-b border-[#EAEAEA]">
      <div className="max-w-screen flex items-center flex-wrap gap-4">
        <span className="text-sm text-gray-500">Frequently searched: </span>
        {[
          'Snacks',
          'Soft drinks',
          'Instant noodles',
          'Canned goods',
          'Daily Dishes',
          'Seasonings',
          'Shop and hair care products',
          'Coffee and powdered milk',
        ].map((searched) => {
          return (
            <Badge.Root
              key={searched}
              className="rounded-full bg-cyan-50 border text-cyan-700"
            >
              <Badge.Label>{searched}</Badge.Label>
            </Badge.Root>
          );
        })}
      </div>
    </div>
  );
};
