'use client';
import { chakra, Flex, HStack, Icon, Text } from '@chakra-ui/react';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { IconType } from 'react-icons';
import { CiSettings } from 'react-icons/ci';
import { FaHome } from 'react-icons/fa';
import { IoStorefrontOutline } from 'react-icons/io5';

export default function Sidebar() {
  const router = useRouter();
  return (
    <Flex
      direction={'column'}
      bg="colors.primary.700"
      minHeight="100dvh"
      h="100%"
      as="nav"
      role="menu"
      gap={'4px'}
      px="1rem"
      pt="32px"
    >
      <Image
        src={'/LogoWhite.png'}
        alt="logo"
        className="mb-6 w-[133.35px] h-[32px] cursor-pointer"
        onClick={() => router.push('/')}
        width={133.35}
        height={32}
      />

      <NavItem icon={FaHome} path="dashboard" label="Dashboard" />
      <NavItem
        icon={IoStorefrontOutline}
        path="manage-products"
        isActive
        label="Manage Products"
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
