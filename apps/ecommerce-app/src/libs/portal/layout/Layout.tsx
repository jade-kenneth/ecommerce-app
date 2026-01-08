import { Box } from '@chakra-ui/react';

import { PropsWithChildren } from 'react';
import { ColorModeProvider } from '../../global/src';
import { useSession } from '../../global/src/auth';

export const Layout = (props: PropsWithChildren) => {
  const { session, maintenance } = useSession();

  if (maintenance.onMaintenance) return <h2>maintenance mode</h2>;
  if (session.status === 'unauthenticated') return null;
  // if (session.status === 'loading') return <h2>loading</h2>;

  return (
    <Box minWidth={'1280px'}>
      <ColorModeProvider>{props.children}</ColorModeProvider>
    </Box>
  );
};
