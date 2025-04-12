import { Avatar, Flex, Icon, Text } from '@chakra-ui/react';
import { FaRegBell } from 'react-icons/fa';
import { TbDoorExit } from 'react-icons/tb';
export default function Header() {
  return (
    <Flex
      color="white"
      justifyContent={'space-between'}
      alignItems={'center'}
      bg="colors.primary.600"
      px="32px"
      py="20px"
    >
      <Text sizes={'paragraph-lg'} fontWeight={'medium'}>
        Welcome, Jadey! We're glad you're here!
      </Text>

      <Flex alignItems={'center'} gap="12px">
        <Icon as={FaRegBell} w={5} h={5} />
        <Avatar.Root size={'md'}>
          <Avatar.Fallback name="J D" />
          <Avatar.Image />
        </Avatar.Root>
        <Flex direction={'column'}>
          <Text sizes={'paragraph-sm'} fontWeight={'medium'}>
            Jadey Darunday
          </Text>
          <Text sizes={'paragraph-sm'}>jadeyd@gmail.com</Text>
        </Flex>
        <Icon as={TbDoorExit} w={5} h={5} />
      </Flex>
    </Flex>
  );
}
