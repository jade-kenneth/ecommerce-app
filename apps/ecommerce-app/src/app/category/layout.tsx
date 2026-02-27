import CategoryShell from './CategoryShell';

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CategoryShell>{children}</CategoryShell>;
}

