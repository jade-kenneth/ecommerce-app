'use client';

import { useState } from 'react';
import { useDebounceCallback } from 'usehooks-ts';

import { twMerge } from 'tailwind-merge';
import { useControllableState } from '../../hooks/useControllableState';
import { Field } from './ui/Field';

/**
 * YOU CAN USE ASSIGN INTERFACE INSTEAD OF OMITTING SAME PROPS
 *
 * EXAMPLE
 *
 * type Assign<Target extends GenericObject,Source extends GenericObject> = Pretty<Omit<Target, keyof Source> & Source>;
 *
 *
 */

interface IInputProps
  extends Omit<React.ComponentProps<typeof Field.Root>, 'value' | 'onChange'> {
  hasDebounce?: boolean;
  debounceDelay?: number;
  rightAddon?: React.ReactNode;
  leftAddon?: React.ReactNode;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export const DebounceInput = ({
  onChange: onChangeProps,
  debounceDelay = 250,
  rightAddon,
  leftAddon,

  value: valueProp,
  ...props
}: IInputProps) => {
  const [value, setValue] = useControllableState({
    value: valueProp,
    onChange: onChangeProps,
  });

  const debounceSetValue = useDebounceCallback(setValue, debounceDelay);

  const [internalValue, setInternalValue] = useState(value);

  return (
    <Field.Root
      className={twMerge(
        'flex items-center border-carbon-950 rounded-full border-[1px] overflow-hidden',
        props.className,
      )}
    >
      <Field.Input
        value={internalValue}
        className="border-none"
        placeholder={props.placeholder}
        onChange={(value) => {
          debounceSetValue(value.target.value);
          setInternalValue(value.target.value);
        }}
      />
      {rightAddon ? rightAddon : null}
      {leftAddon ? leftAddon : null}
    </Field.Root>
  );
};
