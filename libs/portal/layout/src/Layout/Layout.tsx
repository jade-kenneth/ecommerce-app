import { useSession } from '@portal/auth';
import { PropsWithChildren } from 'react';

export const Layout = (props: PropsWithChildren) => {
  const { session, maintenance } = useSession();

  if (maintenance.onMaintenance) return <h2>maintenance mode</h2>;
  if (session.status === 'unauthenticated') return null;
  if (session.status === 'loading') return <h2>loading</h2>;

  return <div>{props.children}</div>;
};
