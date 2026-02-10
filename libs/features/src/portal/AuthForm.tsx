'use client';
import { X } from 'lucide-react';
import { useState } from 'react';

import { useGlobalStore } from '~/hooks/useGlobalStore';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

import { Dialog } from '../../../ui/components/Dialog';

export function AuthForm() {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const globalStore = useGlobalStore((state) => state);

  if (globalStore.authenticate.isAuthenticated) return null;
  return (
    <Dialog.Root open={globalStore.signIn.isSignIn} closeOnInteractOutside>
      <Dialog.Trigger>
        <span
          className="text-base font-medium cursor-pointer text-blue-600 "
          onClick={() => globalStore.signIn.setIsSignIn(true)}
        >
          Register / Log In
        </span>
      </Dialog.Trigger>

      <Dialog.Backdrop />
      <Dialog.Positioner className="px-4 py-6 sm:px-8 sm:py-12 flex items-center justify-center">
        <Dialog.Content className="rounded-xl lg:p-4  border border-gray-200 bg-white relative w-[92vw] max-w-[520px] min-w-0">
          <Dialog.CloseTrigger
            onClick={() => globalStore.signIn.setIsSignIn(false)}
            aria-label="Close dialog"
          >
            <X className="p-1 size-6 sm:size-7 cursor-pointer text-cyan-500 absolute -top-2 -right-2 rounded-md" />
          </Dialog.CloseTrigger>
          {/* <Dialog.Header className="flex flex-col items-center gap-2">
            <Image
              src={'/LogoBlack.png'}
              alt="logo"
              className="mx-auto w-[140px] sm:w-[200px] h-10 sm:h-12"
              width={200}
              height={48}
            />
            <span className="text-base sm:text-2xl font-semibold text-gray-900 text-center">
              <Show when={authMode === 'login'} fallback="Create Your Account">
                Sign In to Your Account
              </Show>
            </span>
          </Dialog.Header> */}
          <Dialog.Body>
            {authMode === 'login' && (
              <LoginForm onToggleToSignup={() => setAuthMode('register')} />
            )}
            {authMode === 'register' && (
              <SignupForm onToggleToLogin={() => setAuthMode('login')} />
            )}
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
