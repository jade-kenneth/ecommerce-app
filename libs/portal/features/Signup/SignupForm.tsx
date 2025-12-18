import { Text } from '@chakra-ui/react';
import { Button, Field, Input, toaster } from '@global';

import { useCreateMemberAccountMutation } from '@graphql/generated';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FaEye, FaFacebook, FaGoogle, FaRegEyeSlash } from 'react-icons/fa';
import z from 'zod';

interface SignupFormProps {
  onToggleToLogin?: () => void;
}

const schema = z
  .object({
    emailAddress: z.string().email({ message: 'Invalid email address' }),
    mobileNumber: z
      .string()
      .min(10, { message: 'Mobile number must be at least 10 digits' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' }),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPassword'],
        message: 'Passwords do not match',
      });
    }
  });

export const SignupForm = ({ onToggleToLogin }: SignupFormProps) => {
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

  const [state, setState] = useState<{
    showPassword: boolean;
    showConfirmPassword: boolean;
  }>({
    showPassword: false,
    showConfirmPassword: false,
  });
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      emailAddress: '',
      mobileNumber: '',
      password: '',
      confirmPassword: '',
    },
  });
  const [mutate] = useCreateMemberAccountMutation();

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await mutate({
        variables: {
          input: {
            emailAddress: data.emailAddress,
            mobileNumber: data.mobileNumber,
            password: data.password,
          },
        },
      });
      form.reset();
      toaster.success({ description: 'Account created successfully' });
    } catch (error) {
      toaster.error({ description: 'Failed to create account' });
    }
  });

  return (
    <div className="flex items-center gap-2.5 relative bg-white-25 rounded-xl">
      <form
        onSubmit={onSubmit}
        className="flex-col items-start gap-12 flex relative  w-full"
      >
        <div className="flex flex-col gap-6 relative  w-full">
          <Field.Root invalid={!!form.formState.errors.emailAddress}>
            <Field.Label>
              <Text
                sizes="paragraph-sm"
                color={'colors.carbon.100'}
                fontWeight={700}
              >
                Email
              </Text>
            </Field.Label>
            <Controller
              control={form.control}
              name="emailAddress"
              render={({ field }) => (
                <Input
                  placeholder="Enter your email"
                  rounded="32px"
                  {...field}
                />
              )}
            />
            <Field.ErrorText>
              {form.formState.errors.emailAddress?.message}
            </Field.ErrorText>
          </Field.Root>
          <Field.Root invalid={!!form.formState.errors.mobileNumber}>
            <Field.Label>
              <Text
                sizes="paragraph-sm"
                color={'colors.carbon.100'}
                fontWeight={700}
              >
                Mobile number
              </Text>
            </Field.Label>
            <Controller
              control={form.control}
              name="mobileNumber"
              render={({ field }) => (
                <Input
                  placeholder="Enter your mobile number"
                  rounded="32px"
                  {...field}
                />
              )}
            />
            <Field.ErrorText>
              {form.formState.errors.mobileNumber?.message}
            </Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!form.formState.errors.password}>
            <Field.Label>
              <Text
                sizes="paragraph-sm"
                color={'colors.carbon.100'}
                fontWeight={700}
              >
                Password
              </Text>
            </Field.Label>
            <Controller
              control={form.control}
              name="password"
              render={({ field }) => {
                return (
                  <Input
                    placeholder="Enter your password"
                    rounded="32px"
                    type={state.showPassword ? 'text' : 'password'}
                    {...field}
                    inputGroupProps={{
                      endElement: state.showPassword ? (
                        <FaRegEyeSlash
                          cursor={'pointer'}
                          onClick={() =>
                            setState({
                              ...state,
                              showPassword: !state.showPassword,
                            })
                          }
                          style={{
                            height: '20px',
                            width: '20px',
                          }}
                          aria-label={
                            state.showPassword
                              ? 'Hide password'
                              : 'Show password'
                          }
                        />
                      ) : (
                        <FaEye
                          cursor={'pointer'}
                          onClick={() =>
                            setState({
                              ...state,
                              showPassword: !state.showPassword,
                            })
                          }
                          style={{
                            height: '20px',
                            width: '20px',
                          }}
                          aria-label={
                            state.showPassword
                              ? 'Hide password'
                              : 'Show password'
                          }
                        />
                      ),
                    }}
                  />
                );
              }}
            />
            <Field.ErrorText>
              {form.formState.errors.password?.message}
            </Field.ErrorText>
          </Field.Root>
          <Field.Root invalid={!!form.formState.errors.confirmPassword}>
            <Field.Label>
              <Text
                sizes="paragraph-sm"
                color={'colors.carbon.100'}
                fontWeight={700}
              >
                Confirm Password
              </Text>
            </Field.Label>
            <Controller
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <Input
                  placeholder="Confirm your password"
                  rounded="32px"
                  type={state.showConfirmPassword ? 'text' : 'password'}
                  {...field}
                  inputGroupProps={{
                    endElement: state.showConfirmPassword ? (
                      <FaRegEyeSlash
                        cursor={'pointer'}
                        onClick={() =>
                          setState({
                            ...state,
                            showConfirmPassword: !state.showConfirmPassword,
                          })
                        }
                        style={{
                          height: '20px',
                          width: '20px',
                        }}
                        aria-label={
                          state.showConfirmPassword
                            ? 'Hide password'
                            : 'Show password'
                        }
                      />
                    ) : (
                      <FaEye
                        cursor={'pointer'}
                        onClick={() =>
                          setState({
                            ...state,
                            showConfirmPassword: !state.showConfirmPassword,
                          })
                        }
                        style={{
                          height: '20px',
                          width: '20px',
                        }}
                        aria-label={
                          state.showConfirmPassword
                            ? 'Hide password'
                            : 'Show password'
                        }
                      />
                    ),
                  }}
                />
              )}
            />
            <Field.ErrorText>
              {form.formState.errors.confirmPassword?.message}
            </Field.ErrorText>
          </Field.Root>
        </div>
        <div className="flex flex-col items-center gap-6 relative self-stretch w-full flex-[0_0_auto]">
          <Button
            w={'full'}
            className="bg-primary-700-value"
            borderRadius={'50px'}
            mt={6}
            type="submit"
          >
            Create Account
          </Button>

          <div className="inline-flex items-center justify-center gap-2 relative flex-[0_0_auto]">
            <p className="relative w-fit mt-[-1.00px] font-paragraph-sm-regular font-[number:var(--paragraph-sm-regular-font-weight)] text-carbon-400 text-[length:var(--paragraph-sm-regular-font-size)] text-center tracking-[var(--paragraph-sm-regular-letter-spacing)] leading-[var(--paragraph-sm-regular-line-height)] whitespace-nowrap [font-style:var(--paragraph-sm-regular-font-style)]">
              Already have an account?
            </p>
            <a
              href="#"
              className="inline-flex gap-[var(--3-spacing-spacing-sm)] items-center justify-center relative flex-[0_0_auto] rounded-[32px] overflow-hidden"
              onClick={() => onToggleToLogin?.()}
            >
              <span className="text-primary-700-value text-paragraph-sm font-semibold relative w-fit mt-[-1.00px] font-paragraph-sm-semibold  text-brand-cyan-green700 text-[length:var(--paragraph-sm-semibold-font-size)] tracking-[var(--paragraph-sm-semibold-letter-spacing)] leading-[var(--paragraph-sm-semibold-line-height)] whitespace-nowrap [font-style:var(--paragraph-sm-semibold-font-style)]">
                Sign In here
              </span>
            </a>
          </div>
          <p className="relative w-fit font-paragraph-sm-regular font-[number:var(--paragraph-sm-regular-font-weight)] text-carbon-400 text-[length:var(--paragraph-sm-regular-font-size)] text-center tracking-[var(--paragraph-sm-regular-letter-spacing)] leading-[var(--paragraph-sm-regular-line-height)] whitespace-nowrap [font-style:var(--paragraph-sm-regular-font-style)]">
            Or create an account using
          </p>
          <div className="flex w-[296px] items-start gap-3 relative flex-[0_0_auto]">
            {socialButtons.map((button, index) => (
              <button
                key={index}
                type="button"
                className="flex gap-3 items-center justify-center px-3.5 py-2.5 relative flex-1 grow bg-white-25 rounded-[32px] overflow-hidden border border-solid border-carbon-800 shadow-shadows-shadow-xs cursor-pointer"
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
        </div>
      </form>
    </div>
  );
};
