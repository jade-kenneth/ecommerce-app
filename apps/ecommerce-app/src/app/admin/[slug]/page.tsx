'use client';
import { useParams } from 'next/navigation';

import { use } from 'react';
import { TEMPORARY_SITE_PASSWORD } from '~/constants';
import { Dashboard } from './Dashboard';
import { ManageProducts } from './ManageProducts';
import { Settings } from './Settings';

export default function Page(props: {
  searchParams: Promise<{ password?: string }>;
}) {
  const params = useParams();
  const { slug } = params;

  const password = use(props.searchParams).password;

  if (password !== TEMPORARY_SITE_PASSWORD) {
    return (
      <div className="w-full h-full flex items-center bg-white/80 justify-center">
        <p className="text-lg font-medium">You are unauthorized</p>
      </div>
    );
  }
  switch (slug) {
    case 'manage-products':
      return <ManageProducts />;
    case 'settings':
      return <Settings />;
    case 'dashboard':
      return <Dashboard />;

    default:
      return <p>HMMMM what are you looking for?</p>;
  }
}
