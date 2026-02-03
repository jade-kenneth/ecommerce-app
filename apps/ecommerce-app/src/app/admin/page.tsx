'use client';

import { use } from 'react';
import { TEMPORARY_SITE_PASSWORD } from '~/utils/constant';
import { ManageProducts } from './[slug]/ManageProducts';

export default async function Index(props: {
  searchParams: Promise<{ password?: string }>;
}) {
  const password = use(props.searchParams).password;

  if (password !== TEMPORARY_SITE_PASSWORD) {
    return (
      <div className="w-full h-full flex items-center bg-white/80 justify-center">
        <p className="text-lg font-medium">You are unauthorized</p>
      </div>
    );
  }
  return <ManageProducts />;
}
