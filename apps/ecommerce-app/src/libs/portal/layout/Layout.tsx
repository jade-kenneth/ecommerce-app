import { Box } from '@chakra-ui/react';

import { PropsWithChildren } from 'react';
import { ColorModeProvider } from '../../global/src';

export const Layout = (props: PropsWithChildren) => {
  return (
    <Box minWidth={'1280px'}>
      <ColorModeProvider>{props.children}</ColorModeProvider>
    </Box>
  );
};
