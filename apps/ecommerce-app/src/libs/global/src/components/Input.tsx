'use client';
import {
  Input as ChakraInput,
  InputProps as ChakraInputProps,
  useControllableState,
} from '@chakra-ui/react';
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

export const Input = ({
  inputGroupProps,
  onChange: onChangeProps,
  value: valueProp,
  ...props
}: IInputProps) => {
  const [value, setValue] = useControllableState({
    value: valueProp,
    onChange: onChangeProps,
  });

  return (
    <InputGroup w="full" {...inputGroupProps}>
      <ChakraInput
        value={value}
        fontSize="14px"
        onChange={(e) => {
          setValue(e.target.value);
        }}
        {...props}
      />
    </InputGroup>
  );
};
