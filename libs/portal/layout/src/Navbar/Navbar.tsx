import { Flex, HStack, Text } from '@chakra-ui/react';
import {
  Button,
  CartIcon,
  ColorModeButton,
  Input,
  logo,
  SearchIcon,
  UserIcon,
} from '@global';
import Image from 'next/image';
import { FunctionComponent } from 'react';
import { Login } from './Login';
interface NavbarProps {
  logoSrc?: string;
}

export const Navbar: FunctionComponent<NavbarProps> = ({ logoSrc = logo }) => {
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
        src={logoSrc}
        alt="brand"
        style={{ height: '32px', width: '133px' }}
      />
      <Input
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
        <HStack as="button" cursor={'pointer'} role="button" px="20px">
          <UserIcon />

          <Login>
            {({ onOpen }) => {
              return (
                <Text sizes={'paragraph-sm'} onClick={onOpen}>
                  Register / Log In
                </Text>
              );
            }}
          </Login>
        </HStack>
        <HStack as="button" cursor={'pointer'} role="button" px="20px">
          <CartIcon />
          <Text sizes={'paragraph-sm'}>Cart</Text>
        </HStack>
        <ColorModeButton />
      </Flex>
    </Flex>
  );
};
