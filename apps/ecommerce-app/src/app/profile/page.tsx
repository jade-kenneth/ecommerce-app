import type { Metadata } from 'next';

import ProfilePageClient from './ProfilePageClient';

export const metadata: Metadata = {
  title: 'Profile',
  description:
    'Manage your account details, addresses, linked login methods, and preferences on Amy.',
};

export default function ProfilePage() {
  return <ProfilePageClient />;
}
