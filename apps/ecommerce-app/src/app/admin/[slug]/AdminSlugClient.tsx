'use client';

import { Dashboard } from './Dashboard';
import { ManageInventory } from './ManageInventory';
import { ManageOrders } from './ManageOrders';
import { Settings } from './Settings';

interface AdminSlugClientProps {
  slug: string;
}

export default function AdminSlugClient({ slug }: AdminSlugClientProps) {
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
