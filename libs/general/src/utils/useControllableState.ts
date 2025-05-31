import { useState } from 'react';

interface ControllableStateProps<T> {
  value?: T;
  onChange?: (value: T) => void;
}
export const useControllableState = <T>(props: ControllableStateProps<T>) => {
  const [value, setValue] = useState<T | undefined>(undefined);
  const isControlled = props.value !== undefined;

  const setControllableValue = (newValue: T) => {
    if (!isControlled) {
      setValue(newValue);
    }
    props.onChange?.(newValue);
  };

  const getControllableValue = () => {
    return props.value !== undefined ? props.value : value;
  };

  return [getControllableValue(), setControllableValue] as const;
};
