import {
  Checkbox,
  CloseButton,
  Dialog,
  Field,
  Flex,
  Portal,
  Text,
  useDisclosure,
  UseDisclosureProps,
} from '@chakra-ui/react';
import { Input, logoBlack } from '@global';
import Image from 'next/image';
import { FaRegEyeSlash } from 'react-icons/fa';
interface LoginProps {
  children?: (value: UseDisclosureProps) => void;
}
export function Login({ children }: LoginProps) {
  const disclosure = useDisclosure();
  return (
    <Dialog.Root lazyMount>
      <Dialog.Trigger>{children?.(disclosure)}</Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header
              mt="20px"
              display={'flex'}
              flexDirection={'column'}
              alignItems={'center'}
            >
              <Image
                src={logoBlack}
                alt="logo"
                style={{
                  margin: 'auto',

                  width: '200px',
                  height: '48px',
                }}
              />
              <Text
                sizes={'heading-5'}
                color={'colors.carbon.100'}
                mt="20px"
                mb="12px"
                fontWeight={'semibold'}
              >
                Sign In to Your Account
              </Text>
              <Text
                sizes={'paragraph-lg'}
                textAlign={'center'}
                color={'colors.carbon.400'}
              >
                Welcome back to AmyStore! Please enter your email address and
                password to access your account.
              </Text>
            </Dialog.Header>
            <Dialog.Body>
              <Field.Root>
                <Field.Label>
                  <Text
                    sizes="paragraph-sm"
                    color={'colors.carbon.100'}
                    fontWeight={700}
                  >
                    Email
                  </Text>
                </Field.Label>
                <Input placeholder="Enter your email" rounded="32px" />
              </Field.Root>
              <Field.Root mt="24px">
                <Field.Label>
                  <Text
                    sizes="paragraph-sm"
                    color={'colors.carbon.100'}
                    fontWeight={700}
                  >
                    Password
                  </Text>
                </Field.Label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  rounded="32px"
                  inputGroupProps={{
                    endElement: (
                      <FaRegEyeSlash
                        cursor={'pointer'}
                        style={{
                          height: '28px',
                          width: '28px',
                        }}
                      />
                    ),
                  }}
                />
              </Field.Root>
              <Flex justifyContent={'space-between'} mt="20px">
                <Checkbox.Root>
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                  <Checkbox.Label>Remember me</Checkbox.Label>
                </Checkbox.Root>
                <Text
                  color={'colors.primary.700'}
                  sizes="paragraph-sm"
                  fontWeight={600}
                >
                  Forgot your Password?
                </Text>
              </Flex>
            </Dialog.Body>

            <Dialog.CloseTrigger>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
