import { zodResolver } from '@hookform/resolvers/zod';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { Eye, EyeClosed } from 'lucide-react';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FaGoogle } from 'react-icons/fa';
import z from 'zod';

import { Button } from '~/components/Button';
import { Input } from '~/components/Input';
import { Field } from '~/components/Primitives/Field';
import { toaster } from '~/components/ToastContainer';
import { AccountType } from '~/graphql/generated';
import { useGlobalStore } from '~/hooks/useGlobalStore';
import {
  authenticate,
  fetchGoogleUserInfo,
  loginWithGoogle,
} from '~/providers/AuthProvider';

interface LoginFormProps {
  onToggleToSignup?: () => void;
}

const definition = z.object({
  emailAddress: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

type GoogleSignInButtonProps = {
  disabled: boolean;
  onAccessToken: (accessToken: string) => Promise<void>;
};

const GoogleSignInButton = ({
  disabled,
  onAccessToken,
}: GoogleSignInButtonProps) => {
  const loginGoogle = useGoogleLogin({
    flow: 'implicit',
    scope: 'openid email profile',
    onSuccess: ({ access_token: accessToken }) => {
      if (!accessToken) {
        toaster.error({
          description: 'Google sign-in did not return an access token.',
        });
        return;
      }

      onAccessToken(accessToken);
    },
    onError: () => {
      toaster.error({
        description: 'Google sign-in was canceled or failed.',
      });
    },
  });

  return (
    <button
      type="button"
      onClick={() => loginGoogle()}
      disabled={disabled}
      className="flex h-[40px] w-full items-center justify-center gap-3 rounded-[32px] border border-solid border-carbon-800 bg-white-25 px-3.5 py-2.5 text-sm font-semibold text-carbon-400 shadow-xs disabled:cursor-not-allowed disabled:opacity-60"
      aria-label="Sign in with Google"
    >
      <FaGoogle className="relative h-5 w-5" />
      <span>{disabled ? 'Signing in...' : 'Sign in with Google'}</span>
    </button>
  );
};

export const LoginForm = ({ onToggleToSignup }: LoginFormProps) => {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID;

  const form = useForm({
    resolver: zodResolver(definition),
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);

  const setIsAuthenticated = useGlobalStore(
    (state) => state.authenticate.setIsAuthenticated,
  );
  const setUser = useGlobalStore((state) => state.authenticate.setUser);

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await authenticate({
        emailAddress: data.emailAddress,
        password: data.password,
        role: AccountType.Member,
      });

      toaster.success({ description: 'Successfully logged in!' });
      setIsAuthenticated(true);
      setUser({ email: data.emailAddress });
    } catch {
      toaster.error({ description: 'Failed to log in. Please try again.' });
    }
  });

  const onGoogleLogin = React.useCallback(
    async (accessToken: string) => {
      setIsGoogleLoading(true);
      try {
        const payload = await fetchGoogleUserInfo(accessToken);

        await loginWithGoogle({
          id: payload.sub,
          emailAddress: payload.email,
          displayName: payload.name,
          avatarUrl: payload.picture,
        });

        setIsAuthenticated(true);
        setUser({ email: payload.email });
        toaster.success({ description: 'Successfully logged in!' });
      } catch {
        toaster.error({
          duration: 3000,
          description:
            'Google account is already linked to another account or not linked at all.',
        });
      } finally {
        setIsGoogleLoading(false);
      }
    },
    [setIsAuthenticated, setUser],
  );

  return (
    <form onSubmit={onSubmit} className="p-1 sm:p-2">
      <Field.Root>
        <Field.Label>
          <span className="text-sm font-bold text-carbon-100">
            Email Address
          </span>
        </Field.Label>
        <Controller
          control={form.control}
          name="emailAddress"
          render={({ field, fieldState }) => (
            <Field.Root invalid={!!fieldState.invalid}>
              <Input
                inputProps={{
                  type: 'email',
                  placeholder: 'Enter your email address',
                }}
                className="rounded-[32px]"
                value={field.value || ''}
                onChange={(e) => field.onChange(e)}
              />
              <Field.ErrorText>{fieldState.error?.message}</Field.ErrorText>
            </Field.Root>
          )}
        />
      </Field.Root>
      <Field.Root className="mt-4 sm:mt-6">
        <span className="text-sm font-bold text-carbon-100">Password</span>
        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Field.Root invalid={!!fieldState.invalid}>
              <>
                <Input
                  className="rounded-[32px]"
                  inputProps={{
                    type: showPassword ? 'text' : 'password',
                    placeholder: 'Enter your password',
                  }}
                  rightAddon={
                    <button
                      type="button"
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                      className="inline-flex items-center justify-center rounded-full p-1 text-carbon-400 transition-colors hover:text-carbon-100"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <EyeClosed className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  }
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e)}
                />
                <Field.ErrorText>{fieldState.error?.message}</Field.ErrorText>
              </>
            </Field.Root>
          )}
        />
      </Field.Root>
      {/* <div className="flex justify-between mt-4 sm:mt-5">
        <Checkbox.Root>
          <Checkbox.HiddenInput />
          <Checkbox.Control />
          <Checkbox.Label>Remember me</Checkbox.Label>
        </Checkbox.Root>
        <span className="text-primary-700 text-sm font-semibold cursor-pointer">
          Forgot your Password?
        </span>
      </div> */}

      <Button
        type="submit"
        className="w-full rounded-[50px] text-white mt-5 sm:mt-6 h-[40px]"
      >
        Sign in
      </Button>

      <p className="w-full text-center font-normal mx-auto mt-3 sm:mt-4 text-sm">
        No account yet?{' '}
        {/* <a
          className="text-cyan-700 text-paragraph-sm font-semibold cursor-pointer"
          target="_blank"
          href="https://www.facebook.com/jeidosenpaitsx/"
        >
          {' '}
          Ask Admin
        </a> */}
        <span
          className="text-cyan-700 text-paragraph-sm font-semibold cursor-pointer"
          onClick={() => onToggleToSignup?.()}
        >
          Register here
        </span>
      </p>

      {googleClientId ? (
        <>
          <p className="mx-auto mt-3 w-fit text-sm sm:mt-4">Or sign in using</p>
          <div className="mx-auto mt-3 w-full max-w-[296px] sm:mt-4">
            <GoogleOAuthProvider clientId={googleClientId}>
              <GoogleSignInButton
                disabled={isGoogleLoading}
                onAccessToken={onGoogleLogin}
              />
            </GoogleOAuthProvider>
          </div>
        </>
      ) : null}
    </form>
  );
};
