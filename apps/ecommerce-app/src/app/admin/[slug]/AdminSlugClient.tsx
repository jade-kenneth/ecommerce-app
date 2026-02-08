'use client';

import { Dashboard } from './Dashboard';
import { ManageInventory } from './ManageInventory';
import { ManageOrders } from './ManageOrders';
import { Settings } from './Settings';

interface AdminSlugClientProps {
  slug: string;
}

export default function AdminSlugClient({ slug }: AdminSlugClientProps) {
  // if (password !== TEMPORARY_SITE_PASSWORD) {
  //   return (
  //     <div className="w-full h-full flex items-center bg-white/80 justify-center">
  //       <p className="text-lg font-medium">You are unauthorized</p>
  //     </div>
  //   );
  // }

  switch (slug) {
    case 'inventory':
      return <ManageInventory />;
    case 'settings':
      return <Settings />;
    case 'dashboard':
      return <Dashboard />;
    case 'orders':
      return <ManageOrders />;
    default:
      return <p>HMMMM what are you looking for?</p>;
  }
}
