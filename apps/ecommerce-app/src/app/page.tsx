'use client';
import { Button, Text } from '@chakra-ui/react';
import { Layout } from '@portal/layout';
import { ColorModeButton } from '@portal/theme';
export default function Index() {
  return (
    <Layout>
      HELLO apps
      <ColorModeButton />
      <Text sizes={'heading-3'}>Hello 123 </Text>
      <Button customButton>Hello </Button>
    </Layout>
  );
}
