'use client';
import Header from './Header';
import Sidebar from './Sidebar';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <div className="w-[20%]">
        <Sidebar />
      </div>
      <div className="flex flex-col w-[80%]">
        <Header />
        {children}
      </div>
    </div>
  );
}
