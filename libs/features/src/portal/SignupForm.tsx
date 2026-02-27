import { zodResolver } from '@hookform/resolvers/zod';
import { ObjectId } from 'bson';
import { Eye, EyeClosed } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import z from 'zod';
import {
  AccountType,
  useCreateMemberAccountMutation,
} from '~/graphql/generated';
import { useGlobalStore } from '~/hooks/useGlobalStore';
import { create_session } from '~/providers/AuthProvider';
import { Button } from '../../../ui/components/Button';
import { Input } from '../../../ui/components/Input';
import { toaster } from '../../../ui/components/ToastContainer';
import { Field } from '../../../ui/components/ui/Field';

interface SignupFormProps {
  onToggleToLogin?: () => void;
}

const schema = z
  .object({
    emailAddress: z.string().email({ message: 'Invalid email address' }),
    mobileNumber: z.string(),
    // .min(10, { message: 'Mobile number must be at least 10 digits' }),
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
  const setIsAuthenticated = useGlobalStore(
    (state) => state.authenticate.setIsAuthenticated,
  );
  const setUser = useGlobalStore((state) => state.authenticate.setUser);
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
  const [mutate, { loading }] = useCreateMemberAccountMutation();

  const onSubmit = form.handleSubmit(async (data) => {
    const _id = new ObjectId().toHexString();
    try {
      await mutate({
        variables: {
          input: {
            _id,
            emailAddress: data.emailAddress,
            mobileNumber: data.mobileNumber,
            password: data.password,
          },
        },
      });

      setTimeout(async () => {
        await create_session({ user: { _id, role: AccountType.Member } });
        setIsAuthenticated(true);
        setUser({
          email: data.emailAddress,
          userId: _id,
        });
        form.reset();
        toaster.success({ description: 'Account created successfully' });
      }, 3000);
    } catch (error) {
      toaster.error({ description: 'Failed to create account' });
    }
  });

  return (
    <div className="flex items-center gap-2.5 relative bg-white-25 rounded-xl">
      <form
        onSubmit={onSubmit}
        className="flex-col items-start gap-6 flex relative w-full"
      >
        <div className="flex flex-col gap-6 relative  w-full">
          <Field.Root invalid={!!form.formState.errors.emailAddress}>
            <Field.Label>
              <span className="text-sm font-bold text-carbon-100">Email</span>
            </Field.Label>
            <Controller
              control={form.control}
              name="emailAddress"
              render={({ field }) => (
                <Input
                  className="rounded-[32px]"
                  inputProps={{
                    type: 'email',
                    placeholder: 'Enter your email',
                  }}
                  {...field}
                />
              )}
            />
            <Field.ErrorText>
              {form.formState.errors.emailAddress?.message}
            </Field.ErrorText>
            <p className="text-[10px] mt-1 italic text-carbon-400">
              Please use a valid and active working email address to fully
              utilize all features.
            </p>
          </Field.Root>
          {/* <Field.Root invalid={!!form.formState.errors.mobileNumber}>
            <Field.Label>
              <span className="text-sm font-bold text-carbon-100">
                Mobile number
              </span>
            </Field.Label>
            <Controller
              control={form.control}
              name="mobileNumber"
              render={({ field }) => (
                <Input
                  className="rounded-[32px]"
                  inputProps={{
                    type: 'number',
                    placeholder: 'Enter your mobile number',
                  }}
                  {...field}
                />
              )}
            />
            <Field.ErrorText>
              {form.formState.errors.mobileNumber?.message}
            </Field.ErrorText>
          </Field.Root> */}

          <Field.Root invalid={!!form.formState.errors.password}>
            <Field.Label>
              <span className="text-sm font-bold text-carbon-100">
                Password
              </span>
            </Field.Label>
            <Controller
              control={form.control}
              name="password"
              render={({ field }) => {
                return (
                  <Input
                    className="rounded-[32px]"
                    inputProps={{
                      type: state.showPassword ? 'text' : 'password',
                      placeholder: 'Enter your password',
                    }}
                    rightAddon={
                      state.showPassword ? (
                        <EyeClosed
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
                          aria-label="Hide password"
                        />
                      ) : (
                        <Eye
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
                          aria-label="Show password"
                        />
                      )
                    }
                    {...field}
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
              <span className="text-sm font-bold text-carbon-100">
                Confirm Password
              </span>
            </Field.Label>
            <Controller
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <Input
                  className="rounded-[32px]"
                  inputProps={{
                    type: state.showConfirmPassword ? 'text' : 'password',
                    placeholder: 'Confirm your password',
                  }}
                  rightAddon={
                    state.showConfirmPassword ? (
                      <EyeClosed
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
                        aria-label="Hide password"
                      />
                    ) : (
                      <Eye
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
                        aria-label="Show password"
                      />
                    )
                  }
                  {...field}
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
            disabled={loading}
            className="w-full bg-cyan-700 rounded-[50px] h-[40px] "
            type="submit"
          >
            Create Account
          </Button>

          <div className="flex items-start  w-full  gap-2 relative">
            <p className="relative w-fit mt-[-1.00px] text-carbon-400 text-sm text-center tracking-wide leading-5 whitespace-nowrap">
              Already have an account?
            </p>
            <a
              href="#"
              className="inline-flex gap-2 items-center justify-center relative flex-[0_0_auto] rounded-[32px] overflow-hidden"
              onClick={() => onToggleToLogin?.()}
            >
              <span className="text-cyan-700 text-sm font-semibold relative w-fit mt-[-1.00px]">
                Sign In here
              </span>
            </a>
          </div>
          {/* <p className="relative w-fit text-carbon-400 text-sm text-center tracking-wide leading-5 whitespace-nowrap">
            Or create an account using
          </p>
          <div className="flex w-full max-w-[296px] items-start gap-3 relative flex-[0_0_auto]">
            {socialButtons.map((button, index) => (
              <button
                key={index}
                type="button"
                className="flex gap-3 items-center justify-center px-3.5 py-2.5 relative flex-1 grow bg-white-25 rounded-[32px] overflow-hidden border border-solid border-carbon-800 shadow-xs cursor-pointer"
                aria-label={`Sign up with ${button.label}`}
              >
                {button.icon}
                <span className="inline-flex items-center justify-center px-1 py-0 relative flex-[0_0_auto]">
                  <span className="relative w-fit mt-[-1.00px] font-semibold text-carbon-400 text-sm tracking-wide leading-5 whitespace-nowrap">
                    {button.label}s
                  </span>
                </span>
              </button>
            ))}
          </div> */}
        </div>
      </form>
    </div>
  );
};
