import AdminSlugClient from './AdminSlugClient';

type AdminSlugParams = {
  slug: string;
};

const ADMIN_SLUGS: AdminSlugParams[] = [
  { slug: 'dashboard' },
  { slug: 'inventory' },
  { slug: 'orders' },
  { slug: 'settings' },
];

export default async function AdminSlugPage({
  params,
}: {
  params: Promise<AdminSlugParams>;
}) {
  const { slug } = await params;
  return <AdminSlugClient slug={slug} />;
}
