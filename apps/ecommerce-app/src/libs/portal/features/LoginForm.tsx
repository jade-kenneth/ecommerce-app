import { Flex, Text } from '@chakra-ui/react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { FaFacebook, FaGoogle, FaRegEyeSlash } from 'react-icons/fa';
import z from 'zod';
import {
  Button,
  Field,
  Input,
  toaster,
  useGlobalStore,
} from '../../global/src';
import { authenticate } from '../../global/src/auth/service';
import { Checkbox } from '../../global/src/components/ui/Checkbox';
import { AccountType } from '../../global/src/graphql/generated';

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
      icon: <FaFacebook className="!relative !w-5 !h-5" />,
      label: 'Facebook',
    },
    {
      icon: <FaGoogle className="!relative !w-5 !h-5" />,
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
    <form onSubmit={onSubmit}>
      <Field.Root>
        <Field.Label>
          <Text
            sizes="paragraph-sm"
            color={'colors.carbon.100'}
            fontWeight={700}
          >
            Email Address
          </Text>
        </Field.Label>

        <Controller
          control={form.control}
          name="emailAddress"
          render={({ field, fieldState }) => {
            return (
              <Field.Root invalid={!!fieldState.invalid}>
                <Input
                  placeholder="Enter your email"
                  rounded="32px"
                  {...field}
                />
                <Field.ErrorText>{fieldState.error?.message}</Field.ErrorText>
              </Field.Root>
            );
          }}
        />
      </Field.Root>
      <Field.Root className="mt-6">
        <Text sizes="paragraph-sm" color={'colors.carbon.100'} fontWeight={700}>
          Password
        </Text>
        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => {
            return (
              <Field.Root invalid={!!fieldState.invalid}>
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
                  {...field}
                />

                <Field.ErrorText>{fieldState.error?.message}</Field.ErrorText>
              </Field.Root>
            );
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
        type="submit"
      >
        Sign in
      </Button>

      <p className="w-fit mx-auto mt-4">
        Don't have an account yet?{' '}
        <span
          className="text-primary-700-value text-paragraph-sm font-semibold cursor-pointer"
          onClick={() => onToggleToSignup?.()}
        >
          Register here
        </span>
      </p>
      <p className="mx-auto w-fit mt-4">Or sign in using</p>
      <div className="flex w-[296px] mx-auto mt-4 items-start gap-3 relative ">
        {socialButtons.map((button, index) => (
          <button
            key={index}
            type="button"
            className="flex gap-3 items-center justify-center  px-3.5 py-2.5 relative flex-1 grow bg-white-25 rounded-[32px] overflow-hidden border border-solid border-carbon-800 shadow-shadows-shadow-xs cursor-pointer"
            aria-label={`Sign up with ${button.label}`}
          >
            {button.icon}
            <span className="inline-flex items-center justify-center pr-[var(--3-spacing-spacing-xxs)] pl-[var(--3-spacing-spacing-xxs)] py-0 relative flex-[0_0_auto]">
              <span className="relative w-fit mt-[-1.00px] font-paragraph-sm-semibold font-[number:var(--paragraph-sm-semibold-font-weight)] text-carbon-400 text-[length:var(--paragraph-sm-semibold-font-size)] tracking-[var(--paragraph-sm-semibold-letter-spacing)] leading-[var(--paragraph-sm-semibold-line-height)] whitespace-nowrap [font-style:var(--paragraph-sm-semibold-font-style)]">
                {button.label}
              </span>
            </span>
          </button>
        ))}
      </div>
    </form>
  );
};
