import { Box, Flex, HStack, Text } from '@chakra-ui/react';

import { MedalIcon } from '~/icons/MedalIcon';
import { PhoneIcon } from '~/icons/PhoneIcon';
import { TruckIcon } from '~/icons/TruckIcon';
import { useSession } from '~/providers/AuthProvider';

interface HighlightProps {
  storeName?: string;
  contact?: string;
  disabled?: boolean;
}

export const Highlight = ({
  contact = '09123453476',
  storeName = 'Welcome to AmyStore',
  disabled = false,
}: HighlightProps) => {
  const session = useSession();

  return (
    <Flex
      height={'44px'}
      width="full"
      py="12px"
      w="full"
      bg="colors.primary.700"
      alignItems={'center'}
      color="colors.primary.950"
    >
      <Flex className="max-w-screen" justify={'space-between'}>
        <Box>
          <Text sizes="paragraph-sm" color={'white'} fontWeight={700}>
            {storeName}
          </Text>
        </Box>
        <Flex
          divideX="1px"
          divideColor={'colors.primary.600'}
          divideStyle="ridge"
        >
          <HStack px="16px">
            <MedalIcon
              svgProps={{ w: '18px', h: '18px' }}
              path={{ fill: 'white' }}
            />
            <Text color={'white'} fontWeight={500} sizes={'paragraph-sm'}>
              Earn Points with Every Purchase
            </Text>
          </HStack>
          <HStack px="16px">
            <TruckIcon
              svgProps={{ w: '18px', h: '18px' }}
              path={{ fill: 'white' }}
            />
            <Text fontWeight={500} color={'white'} sizes={'paragraph-sm'}>
              We Also Deliver
            </Text>
          </HStack>
          <HStack px="16px">
            <PhoneIcon
              svgProps={{ width: '18px', height: '18px' }}
              path={{ fill: 'white' }}
            />
            <Text fontWeight={500} color={'white'} sizes={'paragraph-sm'}>
              Contact Us at {contact}
            </Text>
          </HStack>
        </Flex>
      </Flex>
      {/* {false && <ColorModeButton />} */}
    </Flex>
  );
};
