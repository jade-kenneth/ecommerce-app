import { FunctionComponent } from 'react';
import { Badge } from '~/components/Primitives/Badge';

interface FrequentlySearchedProps {}

export const FrequentlySearched: FunctionComponent<
  FrequentlySearchedProps
> = () => {
  return (
    <div className="flex py-3 sm:py-4 border-b border-[#EAEAEA]">
      <div className="max-w-screen flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <span className="text-xs sm:text-sm text-gray-500">
          Frequently searched:
        </span>
        <div className="flex flex-wrap gap-2 sm:gap-3">
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
                className="rounded-full bg-cyan-50 border text-cyan-700 text-xs sm:text-sm"
              >
                <Badge.Label>{searched}</Badge.Label>
              </Badge.Root>
            );
          })}
        </div>
      </div>
    </div>
  );
};
