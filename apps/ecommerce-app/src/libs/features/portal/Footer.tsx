import { Box, Flex, HStack, Text } from '@chakra-ui/react';
import Image from 'next/image';

export const Footer = () => {
  return (
    <Flex
      p="80px"
      mt="100px"
      direction={'column'}
      color="white"
      bg="colors.primary.700"
    >
      <Flex
        mb="40px"
        className="max-w-screen"
        justify={'space-between'}
        w="full"
      >
        <Flex direction={'column'}>
          <Image src={'/LogoWhite.png'} alt="logo" width={150} height={150} />

          <Text mt="34px" fontWeight={700} mb="20px" sizes={'paragraph-xl'}>
            Contact Us
          </Text>
          <Flex align={'start'} fontWeight={600} mb="20px" gap="11px">
            <Image src={'/fb.svg'} alt="logo" width={20} height={20} />
            <Flex direction={'column'}>
              <Text sizes={'paragraph-md'}>Facebook App</Text>
              <Text sizes={'paragraph-md'}>Kenneth Mejia Jumawan</Text>
            </Flex>
          </Flex>
          <Flex align={'start'} fontWeight={600} gap="11px">
            <Image src={'/phone.svg'} alt="logo" width={20} height={20} />
            <Flex direction={'column'}>
              <Text sizes={'paragraph-md'}>Call Us</Text>
              <Text sizes={'paragraph-md'}>+639 52 480 3589</Text>
            </Flex>
          </Flex>
        </Flex>

        <Box>
          <Text mb="16px" sizes={'paragraph-xl'}>
            Most Popular Categories
          </Text>

          <HStack
            py="20px"
            borderTopColor={'colors.primary.400'}
            borderTopWidth={'3px'}
            gap={'20px'}
          >
            <Box as={'ul'} listStyle={'inside'}>
              <li>Snacks</li>
              <li>Beverages</li>
              <li>Canned Goods</li>
              <li>Instant Food</li>
              <li>Rice</li>
              <li>Cooking Essentials</li>
            </Box>
            <Box as={'ul'} listStyle={'inside'}>
              <li>Fresh Produce</li>
              <li>Personal Care</li>
              <li>Household Items</li>
              <li>Sweets & Candies</li>
              <li>Health & Wellness</li>
              <li>Daily Dishes</li>
            </Box>
          </HStack>
        </Box>
        <Box>
          <Text mb="16px" sizes={'paragraph-xl'}>
            Customer Service
          </Text>

          <HStack
            py="20px"
            borderTopColor={'colors.primary.400'}
            borderTopWidth={'3px'}
            gap={'20px'}
          >
            <Box as={'ul'} listStyle={'inside'}>
              <li>About Us</li>
              <li>Terms & Conditions</li>
              <li>FAQ</li>
              <li>Privacy Policy</li>
            </Box>
          </HStack>
        </Box>

        <Flex direction={'column'} gap={'20px'}>
          <Text sizes={'paragraph-xl'}>Payment Method</Text>
          <Image src={'/gcash.png'} width={180} height={180} alt="payment-1" />
          <Image src={'/cash.png'} width={180} height={180} alt="payment-2" />
        </Flex>
      </Flex>

      <Flex
        align={'center'}
        className="max-w-screen"
        borderTopColor={'rgba(255, 255, 255, 0.2)'}
        borderTopWidth={'1px'}
        justify={'center'}
      >
        <Text mt="32px">
          © {new Date().getFullYear()} AmyStore. All rights reserved.
        </Text>
      </Flex>
    </Flex>
  );
};
