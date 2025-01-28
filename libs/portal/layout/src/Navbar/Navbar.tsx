import { Flex } from '@chakra-ui/react';
import { logo } from '@portal/global';
import Image from 'next/image';
import { FunctionComponent } from 'react';
interface NavbarProps {}

export const Navbar: FunctionComponent<NavbarProps> = () => {
  return (
    <Flex
      className="max-w-screen"
      py="36px"
      mt="42px"
      justifyContent={'space-between'}
    >
      <Image src={logo} alt="brand" />
    </Flex>
  );
};
