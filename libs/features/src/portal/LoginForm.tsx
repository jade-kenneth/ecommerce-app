import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeClosed } from 'lucide-react';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import z from 'zod';
import { AccountType } from '~/graphql/generated';
import { useGlobalStore } from '~/hooks/useGlobalStore';
import { authenticate } from '~/providers/AuthProvider';
import { Button } from '../../../ui/components/Button';
import { Input } from '../../../ui/components/Input';
import { toaster } from '../../../ui/components/ToastContainer';
import { Checkbox } from '../../../ui/components/ui/Checkbox';
import { Field } from '../../../ui/components/ui/Field';

interface LoginFormProps {
  onToggleToSignup?: () => void;
}

const definition = z.object({
  emailAddress: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const LoginForm = ({ onToggleToSignup }: LoginFormProps) => {
  const socialButtons = [
    {
      icon: <FaFacebook className="relative w-5 h-5" />,
      label: 'Facebook',
    },
    {
      icon: <FaGoogle className="relative w-5 h-5" />,
      label: 'Google',
    },
  ];

  const form = useForm({
    resolver: zodResolver(definition),
  });
  const globalStore = useGlobalStore((state) => state.authenticate);
  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await authenticate({
        emailAddress: data.emailAddress,
        password: data.password,
        role: AccountType.Member,
      });
      toaster.success({ description: 'Successfully logged in!' });
      globalStore.setIsAuthenticated(true);
    } catch (error) {
      toaster.error({ description: 'Failed to log in. Please try again.' });
    }
  });

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
                {...field}
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
              {(() => {
                const [showPassword, setShowPassword] = React.useState(false);
                return (
                  <>
                    <Input
                      className="rounded-[32px]"
                      inputProps={{
                        type: showPassword ? 'text' : 'password',
                        placeholder: 'Enter your password',
                      }}
                      rightAddon={
                        showPassword ? (
                          <EyeClosed
                            className="w-5 h-5 cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                          />
                        ) : (
                          <Eye
                            className="w-5 h-5 cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                          />
                        )
                      }
                      {...field}
                    />
                    <Field.ErrorText>
                      {fieldState.error?.message}
                    </Field.ErrorText>
                  </>
                );
              })()}
            </Field.Root>
          )}
        />
      </Field.Root>
      <div className="flex justify-between mt-4 sm:mt-5">
        <Checkbox.Root>
          <Checkbox.HiddenInput />
          <Checkbox.Control />
          <Checkbox.Label>Remember me</Checkbox.Label>
        </Checkbox.Root>
        <span className="text-primary-700 text-sm font-semibold cursor-pointer">
          Forgot your Password?
        </span>
      </div>

      <Button
        type="submit"
        className="w-full rounded-[50px] text-white mt-5 sm:mt-6"
      >
        Sign in
      </Button>

      <p className="w-fit mx-auto mt-3 sm:mt-4">
        Don&apos;t have an account yet?{' '}
        <span
          className="text-cyan-700 text-paragraph-sm font-semibold cursor-pointer"
          onClick={() => onToggleToSignup?.()}
        >
          Register here
        </span>
      </p>
      <p className="mx-auto w-fit mt-3 sm:mt-4">Or sign in using</p>
      <div className="flex w-full max-w-[296px] mx-auto mt-3 sm:mt-4 items-start gap-3 relative">
        {socialButtons.map((button, index) => (
          <button
            key={index}
            type="button"
            className="flex gap-3 items-center justify-center px-3.5 py-2.5 relative flex-1 grow bg-white-25 rounded-[32px] overflow-hidden border border-solid border-carbon-800 shadow-xs cursor-pointer"
            aria-label={`Sign up with ${button.label}`}
          >
            {button.icon}
            <span className="inline-flex items-center justify-center px-2 py-0 relative flex-[0_0_auto]">
              <span className="relative w-fit font-semibold text-carbon-400 text-sm whitespace-nowrap">
                {button.label}
              </span>
            </span>
          </button>
        ))}
      </div>
    </form>
  );
};
