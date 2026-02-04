import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FunctionComponent } from 'react';
import { CiSettings } from 'react-icons/ci';
import { twMerge } from 'tailwind-merge';

import { Menu, Search, X } from 'lucide-react';
import { useSelfQuery } from '~/graphql/generated';
import { useGlobalStore } from '~/hooks/useGlobalStore';
import { CartIcon } from '~/icons/CartIcon';
import { UserIcon } from '~/icons/UserIcon';
import { useLicenseContext } from '~/providers/LicenseProvider/LicenseContext';
import { useDisclosure } from '~/utils/useDisclosure';
import { Button } from '../../../ui/components/Button';
import { DebounceInput } from '../../../ui/components/DebounceInput';
import { Dialog } from '../../../ui/components/Dialog';
import { Show } from '../../../ui/components/Show';
import { AuthForm } from './AuthForm';
import { useCartContext } from './Cart/CartContext';
import { categoryItems } from './Categories';

interface NavbarProps {
  logoSrc?: string;
}

export const Navbar: FunctionComponent<NavbarProps> = ({ logoSrc }) => {
  const globalStore = useGlobalStore((state) => state);
  const licenseContext = useLicenseContext();
  const menuDisclosure = useDisclosure();
  const { data } = useSelfQuery({
    skip:
      !globalStore.authenticate.isAuthenticated || !licenseContext.isLicensed,
  });
  const router = useRouter();

  const cartContext = useCartContext();
  const categoryLabels = categoryItems.map((item) =>
    item.name
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim(),
  );
  return (
    <div
      className={twMerge(
        'max-w-screen w-full flex flex-col gap-4 py-4 sm:py-6 lg:py-9 lg:grid lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-6',
        !globalStore.authenticate.isAuthenticated &&
          'aria-hidden aria-disabled aria-readonly',
      )}
      aria-hidden={!globalStore.authenticate.isAuthenticated}
      aria-disabled={!globalStore.authenticate.isAuthenticated}
      aria-readonly={!globalStore.authenticate.isAuthenticated}
    >
      <div className="order-1 lg:order-none flex items-center">
        <Image
          src={logoSrc ?? '/LogoBlack.png'}
          alt="brand"
          style={{ height: '32px', width: '133px', cursor: 'pointer' }}
          width={133}
          height={32}
          onClick={() => router.push('/')}
        />
      </div>
      <div className="order-3 lg:order-none w-full lg:w-auto">
        <DebounceInput
          hasDebounce
          placeholder="Search snacks, essentials, and more..."
          onChange={(val) => console.log(val, 'valval')}
          className="rounded-[32px] h-11 sm:h-12 w-full lg:w-[35.0625rem] bg-primary-25 text-primary-500"
          rightAddon={
            <Button className="flex items-center w-auto h-[36px] sm:h-[40px] mr-1 gap-[5px] rounded-[32px]">
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline font-semibold text-sm">
                Search
              </span>
            </Button>
          }
        />
      </div>
      <div className="order-2 lg:order-none flex flex-wrap items-center justify-between lg:justify-end gap-2">
        <div className="flex flex-wrap font-semibold divide-x-0 sm:divide-x-[1.5px] divide-primary-700 divide-solid">
          <Show
            when={!globalStore.authenticate.isAuthenticated}
            fallback={
              <p className="px-2 sm:px-5 flex items-center text-xs sm:text-sm max-w-[140px] sm:max-w-none truncate">
                {`Hi, ${data?.self?.emailAddress}!`}
              </p>
            }
          >
            <div className="flex flex-row items-center cursor-pointer gap-2 px-2 ">
              <UserIcon />
              <AuthForm />
            </div>
          </Show>
          <div className="flex flex-row items-center cursor-pointer px-2 sm:px-5">
            <button
              className="flex gap-2 relative cursor-pointer"
              onClick={() => router.push('/cart')}
            >
              <span
                className={twMerge(
                  'w-[18px] text-[10px] sm:w-[20px] sm:text-xs font-medium text-white flex items-center justify-center absolute -top-2 -right-2 sm:-right-5 h-[18px] sm:h-[20px] rounded-full bg-[red]',
                )}
              >
                {cartContext.state.itemsCount}
              </span>
              <CartIcon />
              <span className="hidden sm:inline text-sm">Cart</span>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CiSettings className="text-cyan-700 w-6 h-6" />
          <Dialog.Root
            open={menuDisclosure.open}
            onOpenChange={menuDisclosure.onToggle}
            closeOnEscape
            closeOnInteractOutside
          >
            <Dialog.Trigger asChild>
              <button
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full border border-carbon-900 text-carbon-25"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </Dialog.Trigger>
            <Dialog.Backdrop className="lg:hidden" />
            <Dialog.Positioner className="lg:hidden fixed inset-0 p-0">
              <Dialog.Content className="lg:hidden fixed inset-y-0 left-0 w-[88vw] max-w-[360px] min-w-0 rounded-none bg-white p-6 shadow-2xl overflow-y-auto">
                <div className="flex items-center justify-between">
                  <Image
                    src={logoSrc ?? '/LogoBlack.png'}
                    alt="brand"
                    className="h-8 w-auto"
                    width={133}
                    height={32}
                  />
                  <Dialog.CloseTrigger
                    className="static ml-auto flex items-center justify-center w-10 h-10 rounded-full border border-carbon-900 text-carbon-25"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </Dialog.CloseTrigger>
                </div>

                <div className="mt-6 space-y-6">
                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Quick Links
                    </p>
                    <button
                      className="w-full text-left text-base font-semibold text-carbon-25"
                      onClick={() => {
                        router.push('/');
                        menuDisclosure.onClose();
                      }}
                    >
                      Home
                    </button>
                    <button
                      className="w-full text-left text-base font-semibold text-carbon-25"
                      onClick={() => {
                        router.push('/cart');
                        menuDisclosure.onClose();
                      }}
                    >
                      Cart
                    </button>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Account
                    </p>
                    <Show
                      when={!globalStore.authenticate.isAuthenticated}
                      fallback={
                        <p className="text-sm text-gray-700">
                          {`Signed in as ${data?.self?.emailAddress ?? 'User'}`}
                        </p>
                      }
                    >
                      <div className="text-sm text-cyan-700">
                        <AuthForm />
                      </div>
                    </Show>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Categories
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {categoryLabels.map((label) => (
                        <div
                          key={label}
                          className="text-sm text-carbon-25 bg-gray-50 rounded-lg px-3 py-2"
                        >
                          {label}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Dialog.Content>
            </Dialog.Positioner>
          </Dialog.Root>
        </div>
      </div>
    </div>
  );
};
