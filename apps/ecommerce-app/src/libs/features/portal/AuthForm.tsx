'use client';
import { Dialog, Portal, Text, useDisclosure } from '@chakra-ui/react';

import Image from 'next/image';
import { useState } from 'react';

import { IoMdClose } from 'react-icons/io';

import { Show } from '~/components/Show';
import { useGlobalStore } from '~/hooks/useGlobalStore';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
export function AuthForm() {
  const disclosure = useDisclosure();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const globalStore = useGlobalStore((state) => state);
  if (globalStore.authenticate.isAuthenticated) return;
  return (
    <Dialog.Root lazyMount open={globalStore.signIn.isSignIn}>
      <Dialog.Trigger>
        <Text
          sizes={'paragraph-sm'}
          onClick={() => globalStore.signIn.setIsSignIn(true)}
        >
          Register / Log In
        </Text>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content className="rounded-xl p-7 border-[1px]">
            <Dialog.Header
              mt="20px"
              display={'flex'}
              flexDirection={'column'}
              alignItems={'center'}
            >
              <Image
                src={'/LogoBlack.png'}
                alt="logo"
                style={{
                  margin: 'auto',

                  width: '200px',
                  height: '48px',
                }}
                width={200}
                height={48}
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

            <Dialog.CloseTrigger
              onClick={() => globalStore.signIn.setIsSignIn(false)}
            >
              <IoMdClose className="bg-primary-500-value p-1 size-6 absolute -top-9 -right-9 cursor-pointer text-white rounded-md" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
