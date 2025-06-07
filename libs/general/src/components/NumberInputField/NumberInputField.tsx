import { useNumberInput, UseNumberInputProps } from '@ark-ui/react';
import { useControllableState } from '@utils';
import { twMerge } from 'tailwind-merge';
import { NumberInput } from '../ui/NumberInput';

interface NumberInputFieldProps extends UseNumberInputProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}
export const NumberInputField = ({
  label,
  className,
  placeholder,
  ...props
}: NumberInputFieldProps) => {
  const [value, setValue] = useControllableState({
    onChange: props.onChange,
    value: props.value,
  });

  const numberInput = useNumberInput({
    ...props,
    value: value,
    onValueChange: (newValue) => {
      setValue(newValue.value);
    },
  });
  return (
    <NumberInput.RootProvider
      value={numberInput}
      className={twMerge('flex flex-col', className)}
    >
      <NumberInput.Label>{label}</NumberInput.Label>
      <NumberInput.Input placeholder={placeholder} />
    </NumberInput.RootProvider>
  );
};
