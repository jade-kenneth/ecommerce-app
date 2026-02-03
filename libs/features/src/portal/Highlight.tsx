import { MedalIcon } from '~/icons/MedalIcon';
import { PhoneIcon } from '~/icons/PhoneIcon';
import { TruckIcon } from '~/icons/TruckIcon';

interface HighlightProps {
  storeName?: string;
  contact?: string;
  disabled?: boolean;
}

export const Highlight = ({
  contact = '09123453476',
  storeName = 'Welcome to AmyStore',
  disabled = false,
}: HighlightProps) => {
  return (
    <div className="w-full bg-cyan-700 text-cyan-950">
      <div className="max-w-screen flex flex-col gap-2 py-2 sm:flex-row sm:items-center sm:justify-between sm:py-3">
        <div>
          <p className="text-xs sm:text-sm text-white font-bold">
            {storeName}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm sm:gap-0 sm:divide-x sm:divide-cyan-600">
          <div className="flex items-center gap-2 sm:px-4">
            <MedalIcon
              className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]"
              pathProps={{ fill: 'white' }}
            />
            <p className="text-white font-medium">
              Earn Points with Every Purchase
            </p>
          </div>
          <div className="flex items-center gap-2 sm:px-4">
            <TruckIcon
              className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]"
              pathProps={{ fill: 'white' }}
            />
            <p className="font-medium text-white">We Also Deliver</p>
          </div>
          <div className="flex items-center gap-2 sm:px-4">
            <PhoneIcon
              className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]"
              pathProps={{ fill: 'white' }}
            />
            <p className="font-medium text-white">
              Contact Us at {contact}
            </p>
          </div>
        </div>
      </div>
      {/* {false && <ColorModeButton />} */}
    </div>
  );
};
