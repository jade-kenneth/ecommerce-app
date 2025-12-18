import {
  CloseButton,
  Dialog,
  Portal,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { logoBlack, Show } from '@global';
import Image from 'next/image';
import { useState } from 'react';
import { LoginForm } from '../Login';
import { SignupForm } from '../Signup';
export function AuthForm() {
  const disclosure = useDisclosure();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  return (
    <Dialog.Root lazyMount>
      <Dialog.Trigger>
        <Text sizes={'paragraph-sm'} onClick={disclosure.onOpen}>
          Register / Log In
        </Text>
      </Dialog.Trigger>
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
                <Show
                  when={authMode === 'login'}
                  fallback="Create Your Account"
                >
                  Sign In to Your Account
                </Show>
              </Text>
              <Text
                sizes={'paragraph-lg'}
                textAlign={'center'}
                color={'colors.carbon.400'}
              >
                <Show
                  when={authMode === 'login'}
                  fallback="Welcome to AmyStore! Join now for easy checkout and special offers!"
                >
                  Welcome back to AmyStore! Please enter your email address and
                  password to access your account.
                </Show>
              </Text>
            </Dialog.Header>
            <Dialog.Body>
              {authMode === 'login' && (
                <LoginForm onToggleToSignup={() => setAuthMode('register')} />
              )}
              {authMode === 'register' && (
                <SignupForm onToggleToLogin={() => setAuthMode('login')} />
              )}
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
