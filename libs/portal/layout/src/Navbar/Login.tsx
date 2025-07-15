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
import { Button, Input, logoBlack } from '@global';
import Image from 'next/image';
import { FaFacebook, FaRegEyeSlash } from 'react-icons/fa';
interface LoginProps {
  children?: (value: UseDisclosureProps) => React.ReactNode;
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
                          height: '20px',
                          width: '20px',
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

              <Button
                w={'full'}
                className="bg-primary-700-value"
                borderRadius={'50px'}
                mt={6}
              >
                Sign in
              </Button>

              <p className="w-fit mx-auto mt-4">
                Don't have an account yet?{' '}
                <span className="text-primary-700-value text-paragraph-sm font-semibold">
                  Register here
                </span>
              </p>
              <p className="mx-auto w-fit mt-4">Or sign in using</p>
              <div className="flex items-center  justify-center gap-4 my-4">
                <FaFacebook className="text-[#3C5A99] w-[28px] h-[28px]" />
                <Image
                  src={'/google.png'}
                  alt="google"
                  width={28}
                  height={28}
                />
              </div>
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
