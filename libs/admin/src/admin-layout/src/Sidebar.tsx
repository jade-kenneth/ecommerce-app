import { chakra, Flex, HStack, Icon, Text } from '@chakra-ui/react';
import { logoWhite } from '@global';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { IconType } from 'react-icons';
import { CiSettings } from 'react-icons/ci';
import { FaHome } from 'react-icons/fa';
import { IoStorefrontOutline } from 'react-icons/io5';
export default function Sidebar() {
  return (
    <Flex
      direction={'column'}
      bg="colors.primary.700"
      w="280px"
      h="100vh"
      as="nav"
      role="menu"
      gap={'4px'}
      px="1rem"
      pt="32px"
    >
      <Image
        src={logoWhite}
        alt="logo"
        style={{ marginBottom: '24px', width: '133.35px', height: '32px' }}
      />

      <NavItem icon={FaHome} path="dashboard" label="Dashboard" />
      <NavItem
        icon={IoStorefrontOutline}
        path="manage-products"
        isActive
        label="Manage Producs"
      />
      <NavItem icon={CiSettings} path="settings" label="Settings" />
    </Flex>
  );
}

interface NavItemProps {
  label: string;
  icon: IconType;
  isActive?: boolean;
  onClick?: () => void;
  path?: string;
}

export function NavItem({
  label,
  icon,
  isActive,
  onClick,
  path = '#',
}: NavItemProps) {
  const router = useRouter();
  const params = useParams();

  const active = params?.slug ? params.slug === path : isActive;

  return (
    <chakra.div
      as={'a'}
      role="menuitem"
      color="white"
      h={'40px'}
      onClick={() => {
        onClick?.();
        router.push(`/admin/${path}`);
      }}
      data-selected={active}
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
    </chakra.div>
  );
}
