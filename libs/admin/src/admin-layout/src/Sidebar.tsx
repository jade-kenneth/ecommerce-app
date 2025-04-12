import { Box, Flex, HStack, Icon, Text } from '@chakra-ui/react';
import { logo } from '@global';
import Image from 'next/image';
import { IconType } from 'react-icons';
export default function Sidebar() {
  return (
    <Flex
      direction={'column'}
      bg="colors.primary.700"
      w="280px"
      h="100vh"
      px="1rem"
      pt="32px"
    >
      <Image src={logo} alt="logo" style={{ marginBottom: '24px' }} />
    </Flex>
  );
}

interface NavItemProps {
  label: string;
  icon: IconType;
  isActive?: boolean;
  onClick?: () => void;
  href?: string;
}

export function NavItem({
  label,
  icon,
  isActive = false,
  onClick,
  href = '#',
}: NavItemProps) {
  return (
    <Box
      as={'a'}
      role="menuitem"
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
      bg={isActive ? useColorModeValue('gray.200', 'gray.600') : 'transparent'}
      borderRadius="md"
      px={4}
      py={2}
      cursor="pointer"
      display="block"
    >
      <HStack gap={3}>
        <Icon as={icon} fontSize="lg" />
        <Text>{label}</Text>
      </HStack>
    </Box>
  );
}
