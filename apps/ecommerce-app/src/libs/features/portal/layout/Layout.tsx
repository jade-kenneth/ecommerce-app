import { Box } from '@chakra-ui/react';

import { PropsWithChildren } from 'react';
import { ColorModeProvider } from '~/components/chakra__prebuilts';

export const Layout = (props: PropsWithChildren) => {
  return (
    <Box minWidth={'1280px'}>
      <ColorModeProvider>{props.children}</ColorModeProvider>
    </Box>
  );
};
