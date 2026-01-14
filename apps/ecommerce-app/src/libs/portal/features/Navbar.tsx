import { Flex, HStack, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { FunctionComponent } from 'react';
import {
  Button,
  CartIcon,
  ColorModeButton,
  DebounceInput,
  SearchIcon,
  Show,
  useGlobalStore,
  UserIcon,
} from '../../global/src';
import { useSelfQuery } from '../../global/src/graphql/generated';
import { AuthForm } from './AuthForm';
interface NavbarProps {
  logoSrc?: string;
}

export const Navbar: FunctionComponent<NavbarProps> = ({ logoSrc }) => {
  const globalStore = useGlobalStore((state) => state.authenticate);
  const { data } = useSelfQuery({
    skip: !globalStore.isAuthenticated,
  });
  return (
    <Flex
      className="max-w-screen"
      py="36px"
      mt="42px"
      justify={'space-between'}
      flexWrap={'wrap'}
      alignItems={'center'}
    >
      <Image
        src={'/LogoBlack.png'}
        alt="brand"
        style={{ height: '32px', width: '133px' }}
        width={133}
        height={32}
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
      <Flex
        divideX="1.5px"
        divideColor={'colors.primary.700'}
        divideStyle="ridge"
        color="colors.primary.700"
        fontWeight={600}
      >
        <Show
          when={!globalStore.isAuthenticated}
          fallback={
            <p className="px-5 flex items-center">{`Welcome back, ${data?.self?.emailAddress}!`}</p>
          }
        >
          <HStack as="button" cursor={'pointer'} role="button" px="20px">
            <UserIcon />

            <AuthForm />
          </HStack>
        </Show>
        <HStack as="button" cursor={'pointer'} role="button" px="20px">
          <CartIcon />
          <Text sizes={'paragraph-sm'}>Cart</Text>
        </HStack>
        <ColorModeButton />
      </Flex>
    </Flex>
  );
};
