import { createListCollection, useCombobox, useFilter } from '@ark-ui/react';
import { isFunction } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { PiCaretDown, PiCaretUp } from 'react-icons/pi';
import { useDebounceCallback } from 'usehooks-ts';
import { useControllableState } from '../../utils';
import { Combobox } from '../ui/Combobox';

interface Option {
  value: string;
  label: string;
}
interface ComboboxFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  options:
    | Option[]
    | ((search: string) => Option[])
    | ((search: string) => Promise<Option[]>);
}
export const ComboboxField = ({ options, ...props }: ComboboxFieldProps) => {
  const [items, setItems] = useState<Option[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [value, setValue] = useControllableState({
    onChange: props.onChange,
    value: props.value,
  });
  const collection = useMemo(
    () =>
      createListCollection({
        items,
        itemToString: (item) => item.label,
        itemToValue: (item) => item.value,
      }),

    [items]
  );

  const getOptions = useMemo(() => {
    return isFunction(options) ? options : () => options;
  }, [options]);

  const { contains } = useFilter({ sensitivity: 'base' });

  const handleInputChange = useDebounceCallback(async (search: string) => {
    const newItems = await getOptions(search);
    setItems(newItems.filter((item) => contains(item.label, search)));
  }, 300);

  const loadDefaultValue = async () => {
    const defaultValue = await getOptions(value);
    setInputValue(defaultValue.at(0)?.label ?? '');
  };

  const combobox = useCombobox({
    collection,
    onInputValueChange: ({ inputValue }) => {
      setInputValue(inputValue);
      handleInputChange(inputValue);
    },
    onValueChange: (details) => {
      setValue(details.value.at(0) ?? '');
    },
    value: value ? [value] : [],
    inputValue: inputValue,
  });

  useEffect(() => {
    handleInputChange('');
    loadDefaultValue();
  }, []);

  return (
    <Combobox.RootProvider value={combobox} className="w-full">
      <Combobox.Label>{props.label}</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input placeholder={props.placeholder} />

        <Combobox.Trigger>
          {combobox.open ? <PiCaretUp /> : <PiCaretDown />}
        </Combobox.Trigger>
      </Combobox.Control>

      <Combobox.Positioner>
        <Combobox.Content>
          {collection.items.map((item) => (
            <Combobox.Item key={item.label} item={item}>
              <Combobox.ItemText>{item.label}</Combobox.ItemText>
              <Combobox.ItemIndicator>✓</Combobox.ItemIndicator>
            </Combobox.Item>
          ))}
        </Combobox.Content>
      </Combobox.Positioner>
    </Combobox.RootProvider>
  );
};
