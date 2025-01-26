'use client';
import { Text } from '@chakra-ui/react';
import { Button } from '@portal/global';
import { Layout } from '@portal/layout';
import { ColorModeButton } from '@portal/theme';
export default function Index() {
  return (
    <Layout>
      HELLO apps
      <ColorModeButton />
      <Text>Hello 123</Text>
      <Button colorTheme="primary" btnSize={'md'} visual={'solid'}>
        Hello 1
      </Button>
    </Layout>
  );
}
