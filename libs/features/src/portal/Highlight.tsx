import { MedalIcon } from '~/icons/MedalIcon';
import { PhoneIcon } from '~/icons/PhoneIcon';
import { TruckIcon } from '~/icons/TruckIcon';
import { useSession } from '~/providers/AuthProvider';

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
  const session = useSession();

  return (
    <div className="flex h-[44px] w-full py-3 bg-cyan-700 items-center text-cyan-950">
      <div className="flex max-w-screen justify-between w-full">
        <div>
          <p className="text-sm text-white font-bold">{storeName}</p>
        </div>
        <div className="flex divide-x divide-cyan-600">
          <div className="flex items-center gap-2 px-4">
            <MedalIcon
              className="w-[18px] h-[18px]"
              pathProps={{ fill: 'white' }}
            />
            <p className="text-white font-medium text-sm">
              Earn Points with Every Purchase
            </p>
          </div>
          <div className="flex items-center gap-2 px-4">
            <TruckIcon
              className="w-[18px] h-[18px]"
              pathProps={{ fill: 'white' }}
            />
            <p className="font-medium text-white text-sm">We Also Deliver</p>
          </div>
          <div className="flex items-center gap-2 px-4">
            <PhoneIcon
              className="w-[18px] h-[18px]"
              pathProps={{ fill: 'white' }}
            />
            <p className="font-medium text-white text-sm">
              Contact Us at {contact}
            </p>
          </div>
        </div>
      </div>
      {/* {false && <ColorModeButton />} */}
    </div>
  );
};
