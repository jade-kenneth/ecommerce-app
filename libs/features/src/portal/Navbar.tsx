import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FunctionComponent } from 'react';
import { CiSettings } from 'react-icons/ci';
import { twMerge } from 'tailwind-merge';

import { Search } from 'lucide-react';
import { useSelfQuery } from '~/graphql/generated';
import { useGlobalStore } from '~/hooks/useGlobalStore';
import { CartIcon } from '~/icons/CartIcon';
import { UserIcon } from '~/icons/UserIcon';
import { useLicenseContext } from '~/providers/LicenseProvider/LicenseContext';
import { Button } from '../../../ui/components/Button';
import { DebounceInput } from '../../../ui/components/DebounceInput';
import { Show } from '../../../ui/components/Show';
import { AuthForm } from './AuthForm';
import { useCartContext } from './Cart/CartContext';

interface NavbarProps {
  logoSrc?: string;
}

export const Navbar: FunctionComponent<NavbarProps> = ({ logoSrc }) => {
  const globalStore = useGlobalStore((state) => state);
  const licenseContext = useLicenseContext();
  const { data } = useSelfQuery({
    skip:
      !globalStore.authenticate.isAuthenticated || !licenseContext.isLicensed,
  });
  const router = useRouter();

  const cartContext = useCartContext();
  return (
    <div
      className={twMerge(
        'max-w-screen py-9 w-full flex justify-between flex-wrap items-center',
        !globalStore.authenticate.isAuthenticated &&
          'aria-hidden aria-disabled aria-readonly',
      )}
      aria-hidden={!globalStore.authenticate.isAuthenticated}
      aria-disabled={!globalStore.authenticate.isAuthenticated}
      aria-readonly={!globalStore.authenticate.isAuthenticated}
    >
      <Image
        src={'/LogoBlack.png'}
        alt="brand"
        style={{ height: '32px', width: '133px', cursor: 'pointer' }}
        width={133}
        height={32}
        onClick={() => router.push('/')}
      />
      <DebounceInput
        hasDebounce
        placeholder="Search snacks, essentials, and more..."
        onChange={(val) => console.log(val, 'valval')}
        className="rounded-[32px] h-12 w-[35.0625rem] bg-primary-25 text-primary-500"
        rightAddon={
          <Button className="flex items-center w-auto h-[40px] mr-1 gap-[5px] rounded-[32px]">
            <Search className="w-4 h-4" />
            <span className="font-semibold text-sm">Search</span>
          </Button>
        }
      />
      <div className="flex gap-2 items-center">
        <div className="flex font-semibold divide-x-[1.5px] divide-primary-700 divide-solid">
          <Show
            when={!globalStore.authenticate.isAuthenticated}
            fallback={
              <p className="px-5 flex items-center">{`Hi, ${data?.self?.emailAddress}!`}</p>
            }
          >
            <div className="flex flex-row items-center cursor-pointer gap-3 px-5">
              <UserIcon />
              <AuthForm />
            </div>
          </Show>
          <div className="flex flex-row items-center cursor-pointer px-5">
            <button
              className="flex gap-2 relative cursor-pointer"
              onClick={() => router.push('/cart')}
            >
              <span
                className={twMerge(
                  'w-[20px] text-xs font-medium text-white flex items-center justify-center absolute -top-2 -right-5 h-[20px] rounded-full bg-[red]',
                )}
              >
                {cartContext.state.itemsCount}
              </span>
              <CartIcon />
              <span className="text-sm">Cart</span>
            </button>
          </div>
        </div>
        <CiSettings className="text-cyan-700 w-6 h-6" />
      </div>
    </div>
  );
};
