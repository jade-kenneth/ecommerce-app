'use client';
import {
  Input as ChakraInput,
  InputProps as ChakraInputProps,
  useControllableState,
} from '@chakra-ui/react';
import { forwardRef, useState } from 'react';
import { useDebounceCallback } from 'usehooks-ts';
import { InputGroup, InputGroupProps } from './chakra__prebuilts';

/**
 * YOU CAN USE ASSIGN INTERFACE INSTEAD OF OMITTING SAME PROPS
 *
 * EXAMPLE
 *
 * type Assign<Target extends GenericObject,Source extends GenericObject> = Pretty<Omit<Target, keyof Source> & Source>;
 *
 *
 */

interface IInputProps extends Omit<ChakraInputProps, 'onChange' | 'value'> {
  inputGroupProps?: Omit<InputGroupProps, 'children'>;
  onChange?: (value: string) => void;
  value?: string;
  hasDebounce?: boolean;
  debounceDelay?: number;
}

export const Input = forwardRef<HTMLInputElement, IInputProps>(
  (
    {
      inputGroupProps,
      onChange: onChangeProps,
      debounceDelay = 250,
      hasDebounce = true,
      value: valueProp,
      ...props
    },
    ref
  ) => {
    const [value, setValue] = useControllableState({
      value: valueProp,
      onChange: onChangeProps,
    });

    const debounceSetValue = useDebounceCallback(setValue, debounceDelay);

    const [internalValue, setInternalValue] = useState(value);

    return (
      <InputGroup w="full" {...inputGroupProps}>
        <ChakraInput
          value={internalValue}
          ref={ref}
          fontSize="14px"
          onChange={(e) => {
            hasDebounce
              ? debounceSetValue(e.target.value)
              : setValue(e.target.value);
            setInternalValue(e.target.value);
          }}
          {...props}
        />
      </InputGroup>
    );
  }
);
