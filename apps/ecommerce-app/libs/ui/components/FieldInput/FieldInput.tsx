import { useField, UseFieldProps } from '@ark-ui/react';

import { useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { useDebounceCallback } from 'usehooks-ts';

import { useControllableState } from '~/hooks/useControllableState';
import { Field } from '../ui/Field';

interface InputProps extends UseFieldProps {
  placeholder?: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}
export const FieldInput = ({
  onChange,
  placeholder,
  value: inputValue,
  label,
  className,
  ...props
}: InputProps) => {
  const [value, setValue] = useControllableState({
    onChange: onChange,
    value: inputValue,
  });

  const ref = useRef<HTMLInputElement>(null);

  const setDebouncedValue = useDebounceCallback((newValue: string) => {
    setValue(newValue);
  }, 300);
  const field = useField(props);

  useEffect(() => {
    if (ref.current) {
      ref.current.value = value;
    }
  }, [value]);

  return (
    <Field.RootProvider
      value={field}
      className={twMerge('flex flex-col gap-1', className)}
    >
      <Field.Label>{label}</Field.Label>
      <Field.Input
        ref={ref}
        placeholder={placeholder}
        onChange={(e) => {
          setDebouncedValue(e.target.value);
        }}
      />
    </Field.RootProvider>
  );
};
