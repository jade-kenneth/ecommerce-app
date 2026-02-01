'use client';

import { twMerge } from 'tailwind-merge';
import { useControllableState } from '~/utils/hooks/useControllableState';
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
  rightAddon?: React.ReactNode;
  leftAddon?: React.ReactNode;
  value?: string;
  onChange?: (value: string) => void;
  inputProps?: React.ComponentProps<typeof Field.Input>;
}

export const Input = ({
  onChange: onChangeProps,
  value: valueProp,
  rightAddon,
  leftAddon,
  inputProps,
  ...props
}: IInputProps) => {
  const [value, setValue] = useControllableState({
    value: valueProp,
    onChange: onChangeProps,
  });

  return (
    <Field.Root
      className={twMerge(
        'flex items-center border-carbon-950 rounded-full border-[1px] overflow-hidden',
        props.className,
      )}
    >
      <Field.Input
        {...inputProps}
        className={twMerge('border-none text-sm', inputProps?.className)}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
      <div className="mr-3">
        {rightAddon ? rightAddon : null}
        {leftAddon ? leftAddon : null}
      </div>
    </Field.Root>
  );
};
