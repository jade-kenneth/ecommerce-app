import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FunctionComponent, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import {
  Menu as MenuIcon,
  Search,
  Settings,
  ShoppingBag,
  ShoppingCart,
  X,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import {
  useMyOrdersQuery,
  useSearchProductByNameQuery,
  useSelfQuery,
} from '~/graphql/generated';
import { useGlobalStore } from '~/hooks/useGlobalStore';
import { UserIcon } from '~/icons/UserIcon';
import { logout } from '~/providers/AuthProvider';
import { useLicenseContext } from '~/providers/LicenseProvider/LicenseContext';
import { numberFormatter } from '~/utils/numberFormatter';
import { useDisclosure } from '~/utils/useDisclosure';
import { Button } from '~/components/Button';
import { DebounceInput } from '~/components/DebounceInput';
import { Dialog } from '~/components/Dialog';
import { Popover } from '~/components/Popover';
import { Show } from '~/components/Show';
import { Menu } from '~/components/ui';
import { AuthForm } from './AuthForm';
import { useCartContext } from './Cart/CartContext';
import { categoryItems } from './Categories';

interface NavbarProps {
  logoSrc?: string;
}

export const Navbar: FunctionComponent<NavbarProps> = React.memo(
  ({ logoSrc }) => {
    const isAuthenticated = useGlobalStore(
      (state) => state.authenticate.isAuthenticated,
    );
    const setIsAuthenticated = useGlobalStore(
      (state) => state.authenticate.setIsAuthenticated,
    );
    const setAuthenticatedUser = useGlobalStore(
      (state) => state.authenticate.setUser,
    );
    const licenseContext = useLicenseContext();
    const menuDisclosure = useDisclosure();
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { data } = useSelfQuery({
      skip: !isAuthenticated || !licenseContext.isLicensed,
    });
    const router = useRouter();

    const cartContext = useCartContext();

    const categoryLabels = categoryItems.map((item) =>
      item.name
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim(),
    );
    const normalizedSearch = searchQuery.trim();
    const shouldSearch = normalizedSearch.length > 0;
    const productsQuery = useSearchProductByNameQuery({
      variables: {
        search: normalizedSearch,
        first: 6,
      },

      skip: !shouldSearch,
    });
    const searchResults = productsQuery.data?.searchProductByName ?? [];

    const ordersQuery = useMyOrdersQuery({
      skip: !isAuthenticated || !licenseContext.isLicensed,
    });

    useEffect(() => {
      if (!data?.self) return;

      setAuthenticatedUser({
        email: data.self.emailAddress,
        userId: data.self._id,
      });
    }, [data?.self, setAuthenticatedUser]);

    const ordersCount = ordersQuery.data?.myOrders?.length ?? 0;

    return (
      <div
        className={twMerge(
          'max-w-screen  w-full flex flex-col  gap-4 py-4 sm:py-6  lg:py-9 lg:grid lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-6',
        )}
      >
        <div className="order-1 hidden md:flex lg:order-none items-center">
          <Image
            src={logoSrc ?? '/LogoBlack.png'}
            alt="brand"
            style={{ cursor: 'pointer' }}
            width={180}
            height={64}
            className="h-12 w-auto object-contain sm:h-14 lg:h-10"
            onClick={() => router.push('/')}
          />
        </div>
        <div className="order-3 lg:order-none lg:w-fit w-full ">
          <Popover.Root
            open={isSearchOpen}
            onOpenChange={(details) => setIsSearchOpen(details.open)}
            autoFocus={false}
            closeOnInteractOutside={true}
            positioning={{ sameWidth: true }}
          >
            <Popover.Anchor>
              <DebounceInput
                hasDebounce
                debounceDelay={300}
                placeholder="Search..."
                value={''}
                onChange={(val) => {
                  setSearchQuery(val);
                  setIsSearchOpen(val.trim().length > 0);
                }}
                className="rounded-[32px] h-11 sm:h-12 w-full lg:w-[35.0625rem] bg-primary-25 text-primary-500"
                rightAddon={
                  <Button
                    size="sm"
                    className="flex items-center h-9 sm:h-10 mr-1 gap-2 rounded-full px-3 sm:px-4 text-sm leading-none"
                    aria-label="Search"
                  >
                    <Search className="h-4 w-4 shrink-0" />
                    <span className="hidden sm:inline font-semibold">
                      Search
                    </span>
                  </Button>
                }
              />
            </Popover.Anchor>

            <Popover.Positioner>
              <Popover.Content>
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <p className="text-xs text-gray-500">Search results</p>
                  {productsQuery.loading && (
                    <span className="text-xs text-gray-400">Searching…</span>
                  )}
                </div>
                <div className="flex flex-col gap-2 pt-2 max-h-72 overflow-y-auto">
                  {!productsQuery.loading &&
                    shouldSearch &&
                    searchResults.length === 0 && (
                      <div className="rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500">
                        No products found for &quot;{searchQuery}&quot;.
                      </div>
                    )}
                  {searchResults.map((item) => (
                    <Link href={`/product/${item._id}`} key={item._id}>
                      <button
                        type="button"
                        className="flex items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-cyan-50 transition-colors"
                        onClick={() => setIsSearchOpen(false)}
                      >
                        <div className="relative h-10 w-10 rounded-md overflow-hidden border border-gray-100 bg-gray-50">
                          <Image
                            src={item.thumbnail}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900 line-clamp-1">
                            {item.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {numberFormatter.format(item.price, {
                              locale: 'en-US',
                              currency: 'PHP',
                            })}
                          </span>
                        </div>
                      </button>
                    </Link>
                  ))}
                </div>
              </Popover.Content>
            </Popover.Positioner>
          </Popover.Root>
        </div>
        <div className="order-2 lg:order-none flex flex-wrap items-center justify-between lg:justify-end gap-2">
          <div className="flex items-center flex-wrap font-semibold ">
            <Show
              when={!isAuthenticated}
              fallback={
                <p className="px-2 sm:px-5   text-xs sm:text-sm max-w-[120px] sm:max-w-none line-clamp-1 truncate">
                  {`Hi, ${data?.self?.emailAddress ?? 'Guest'}!`}
                </p>
              }
            >
              <div className="flex flex-row items-center cursor-pointer gap-2 px-2 ">
                <UserIcon />
                <AuthForm />
              </div>
            </Show>
            <div className="flex  flex-row items-center cursor-pointer px-2 sm:px-5">
              <button
                className="flex gap-2 relative cursor-pointer"
                onClick={() => router.push('/cart')}
              >
                <span
                  className={twMerge(
                    'w-[18px] text-[10px] sm:w-[20px] sm:text-xs font-medium text-white flex items-center justify-center absolute -top-2 -right-2 sm:-right-5 h-[18px] sm:h-[20px] rounded-full bg-cyan-700',
                  )}
                >
                  {cartContext.state.itemsCount}
                </span>
                <ShoppingCart className="w-5 h-5" />
                <span className="hidden sm:inline text-sm">Cart</span>
              </button>
            </div>
            <div className="flex flex-row items-center cursor-pointer px-2 sm:px-5">
              <button
                className="flex gap-2 relative cursor-pointer"
                onClick={() => router.push('/orders')}
              >
                <span
                  className={twMerge(
                    'w-[18px] text-[10px] sm:w-[20px] sm:text-xs font-medium text-white flex items-center justify-center absolute -top-2 -right-2 sm:-right-5 h-[18px] sm:h-[20px] rounded-full bg-cyan-700',
                  )}
                >
                  {ordersCount}
                </span>
                <ShoppingBag className="w-5 h-5" />
                <span className="hidden sm:inline text-sm">Orders</span>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Show when={isAuthenticated}>
              <Menu.Root>
                <Menu.Trigger className="flex items-center justify-center w-10 h-10  text-cyan-700 hover:bg-cyan-50 transition-colors">
                  <Settings className="text-cyan-700 w-6 h-6" />
                </Menu.Trigger>
                <Menu.Positioner>
                  <Menu.Content>
                    <Menu.ItemGroup>
                      <Menu.Item
                        value="logout"
                        onClick={async () => {
                          await logout();
                          setIsAuthenticated(false);
                          setAuthenticatedUser({ email: '', userId: '' });
                          router.push('/');
                        }}
                      >
                        Logout
                      </Menu.Item>
                    </Menu.ItemGroup>
                  </Menu.Content>
                </Menu.Positioner>
              </Menu.Root>
            </Show>
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
                  <MenuIcon className="w-5 h-5" />
                </button>
              </Dialog.Trigger>
              <Dialog.Backdrop className="lg:hidden" />
              <Dialog.Positioner className="lg:hidden fixed inset-0 p-0">
                <Dialog.Content className="lg:hidden fixed inset-y-0 left-0 w-[88vw] max-w-[360px] min-w-0 rounded-none bg-white p-6 shadow-2xl overflow-y-auto">
                  <div className="flex items-center justify-between">
                    <Image
                      src={logoSrc ?? '/LogoBlack.png'}
                      alt="brand"
                      className="h-10 w-auto object-contain"
                      width={160}
                      height={48}
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
                      <button
                        className="w-full text-left text-base font-semibold text-carbon-25"
                        onClick={() => {
                          router.push('/orders');
                          menuDisclosure.onClose();
                        }}
                      >
                        Orders
                      </button>
                    </div>

                    <div className="space-y-3">
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        Account
                      </p>
                      <Show
                        when={!isAuthenticated}
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
  },
);
