import { Flex, HStack, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FunctionComponent } from 'react';
import { CiSettings } from 'react-icons/ci';
import { twMerge } from 'tailwind-merge';

import { Button } from '~/components/Button';
import { DebounceInput } from '~/components/DebounceInput';
import { Show } from '~/components/Show';
import { useSelfQuery } from '~/graphql/generated';
import { useGlobalStore } from '~/hooks/useGlobalStore';
import { CartIcon } from '~/icons/CartIcon';
import { SearchIcon } from '~/icons/SearchIcon';
import { UserIcon } from '~/icons/UserIcon';
import { useLicenseContext } from '~/providers/LicenseProvider/LicenseContext';
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
    <Flex
      className="max-w-screen"
      py="36px"
      justify={'space-between'}
      flexWrap={'wrap'}
      alignItems={'center'}
      aria-hidden={!globalStore.authenticate.isAuthenticated}
      aria-disabled={!globalStore.authenticate.isAuthenticated}
      aria-readonly={!globalStore.authenticate.isAuthenticated}
    >
      <Image
        src={'/LogoBlack.png'}
        alt="brand"
        style={{ height: '32px', width: '133px' }}
        width={133}
        height={32}
        onClick={() => router.push('/')}
      />
      <DebounceInput
        rounded={'32px'}
        h="48px"
        hasDebounce
        placeholder="Search snacks, essentials, and more..."
        w="35.0625rem"
        onChange={(val) => console.log(val, 'valval')}
        color="colors.primary.500"
        border="colors.carbon.950"
        py="14px"
        pl="24px"
        bg="colors.primary.25"
        inputGroupProps={{
          w: 'fit-content',
          endElementProps: {
            p: 'unset',
          },
          endElement: (
            <Button
              display={'flex'}
              alignItems={'center'}
              w="96px"
              gap="5px"
              m="6px"
              btnSize={'sm'}
              bg="colors.primary.700"
              rounded="32px"
            >
              <SearchIcon />
              <Text fontWeight={600} sizes="paragraph-sm">
                Search
              </Text>
            </Button>
          ),
        }}
      />
      <div className="flex gap-2 items-center">
        <Flex
          divideX="1.5px"
          divideColor={'colors.primary.700'}
          divideStyle="ridge"
          fontWeight={600}
        >
          <Show
            when={!globalStore.authenticate.isAuthenticated}
            fallback={
              <p className="px-5 flex items-center">{`Hi, ${data?.self?.emailAddress}!`}</p>
            }
          >
            <HStack cursor={'pointer'} px="20px">
              <UserIcon />

              <AuthForm />
            </HStack>
          </Show>
          <HStack cursor={'pointer'} px="20px">
            <button
              className="flex gap-2 relative cursor-pointer"
              onClick={() => router.push('/cart')}
            >
              <p
                className={twMerge(
                  'w-[20px] text-xs font-medium text-white flex items-center justify-center absolute -top-2 -right-5 h-[20px] rounded-full bg-[red]',
                )}
              >
                {cartContext.state.itemsCount}
              </p>
              <CartIcon />

              <Text sizes={'paragraph-sm'}>Cart</Text>
            </button>
          </HStack>

          {/* <ColorModeButton /> */}
        </Flex>
        <CiSettings className="text-primary-700-value size-5" />
      </div>
    </Flex>
  );
};
