import { Flex, Text } from '@chakra-ui/react';

import React from 'react';
import { FaFacebook, FaGoogle, FaRegEyeSlash } from 'react-icons/fa';
import { Button, Field, Input } from '../../global/src';
import { Checkbox } from '../../global/src/components/ui/Checkbox';

interface LoginFormProps {
  onToggleToSignup?: () => void;
}
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
  return (
    <React.Fragment>
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
      <Field.Root className="mt-6">
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
        <span
          className="text-primary-700-value text-paragraph-sm font-semibold"
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
    </React.Fragment>
  );
};
