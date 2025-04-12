'use client';
import { Flex } from '@chakra-ui/react';
import Header from './Header';
import Sidebar from './Sidebar';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Flex>
      <Sidebar />
      <Flex direction={'column'} w="full">
        <Header />
        {children}
      </Flex>
    </Flex>
  );
}
