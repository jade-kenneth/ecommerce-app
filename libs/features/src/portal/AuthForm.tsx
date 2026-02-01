'use client';
import Image from 'next/image';
import { useState } from 'react';
import { IoMdClose } from 'react-icons/io';

import { Show } from '../../../ui/components/Show';
import { useGlobalStore } from '~/hooks/useGlobalStore';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

import { Dialog } from '../../../ui/components/Dialog'; // Adjust the import path as needed

export function AuthForm() {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const globalStore = useGlobalStore((state) => state);
  if (globalStore.authenticate.isAuthenticated) return null;
  return (
    <Dialog.Root open={globalStore.signIn.isSignIn} lazyMount>
      <Dialog.Trigger>
        <span
          className="text-base font-medium cursor-pointer text-blue-600 "
          onClick={() => globalStore.signIn.setIsSignIn(true)}
        >
          Register / Log In
        </span>
      </Dialog.Trigger>

      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content className="rounded-xl p-7 border border-gray-200 bg-white relative">
          <Dialog.Header className="flex flex-col items-center mt-5">
            <Image
              src={'/LogoBlack.png'}
              alt="logo"
              className="mx-auto w-[200px] h-12"
              width={200}
              height={48}
            />
            <span className="text-2xl font-semibold text-gray-900 mt-5 mb-3">
              <Show when={authMode === 'login'} fallback="Create Your Account">
                Sign In to Your Account
              </Show>
            </span>
            <span className="text-center text-gray-500 text-lg">
              <Show
                when={authMode === 'login'}
                fallback="Welcome to AmyStore! Join now for easy checkout and special offers!"
              >
                Welcome back to AmyStore! Please enter your email address and
                password to access your account.
              </Show>
            </span>
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
            <IoMdClose className="bg-cyan-500 p-1 size-6 absolute -top-9 -right-9 cursor-pointer text-white rounded-md" />
          </Dialog.CloseTrigger>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
