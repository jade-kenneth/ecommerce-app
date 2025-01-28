import { Box, Flex, HStack, Text } from '@chakra-ui/react';
import { MedalIcon, PhoneIcon, TruckIcon } from '@portal/global';
import { ColorModeButton } from '@portal/theme';
import { FunctionComponent } from 'react';

interface HighlightsProps {
  storeName?: string;
  contact?: string;
}

export const Highlights: FunctionComponent<HighlightsProps> = ({
  contact = '09123453476',
  storeName = 'Welcome to AmyStore',
}) => {
  return (
    <Flex
      height={'44px'}
      py="12px"
      w="full"
      bg="colors.primary.700"
      position={'fixed'}
      alignItems={'center'}
      color="colors.primary.950"
      top={0}
    >
      <Flex className="max-w-screen" justify={'space-between'}>
        <Box>
          <Text sizes="paragraph-sm" fontWeight={700}>
            {storeName}
          </Text>
        </Box>
        <Flex
          divideX="1px"
          divideColor={'colors.primary.950'}
          divideStyle="ridge"
        >
          <HStack px="16px">
            <MedalIcon svgProps={{ w: '18px', h: '18px' }} />
            <Text fontWeight={500} sizes={'paragraph-sm'}>
              Earn Points with Every Purchase
            </Text>
          </HStack>
          <HStack px="16px">
            <TruckIcon svgProps={{ w: '18px', h: '18px' }} />
            <Text fontWeight={500} sizes={'paragraph-sm'}>
              We Also Deliver
            </Text>
          </HStack>
          <HStack px="16px">
            <PhoneIcon svgProps={{ width: '18px', height: '18px' }} />
            <Text fontWeight={500} sizes={'paragraph-sm'}>
              Contact Us at {contact}
            </Text>
          </HStack>
        </Flex>
      </Flex>
      {false && <ColorModeButton />}
    </Flex>
  );
};
