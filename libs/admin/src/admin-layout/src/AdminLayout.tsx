'use client';
import { Flex } from '@chakra-ui/react';
import Header from './Header';
import Sidebar from './Sidebar';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Flex>
      <div className="w-[20%]">
        <Sidebar />
      </div>
      <div className="flex flex-col w-[80%]">
        <Header />
        {children}
      </div>
    </Flex>
  );
}
