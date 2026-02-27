import { createListCollection, useCombobox, useFilter } from '@ark-ui/react';
import { isFunction } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useDebounceCallback } from 'usehooks-ts';

import { useControllableState } from '~/hooks/useControllableState';
import { Combobox, ComboboxItem } from '../ui/Combobox';

type Option = ComboboxItem;
interface MultiComboboxFieldProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  label?: string;
  placeholder?: string;
  valueToOptions?:
    | Option[]
    | ((value: string[]) => Option[])
    | ((value: string[]) => Promise<Option[]>);
  options:
    | Option[]
    | ((search: string) => Option[])
    | ((search: string) => Promise<Option[]>);
  defaultValue?: string[];
}
export const MultiComboboxField = ({
  options,
  ...props
}: MultiComboboxFieldProps) => {
  const [items, setItems] = useState<Option[]>([]);
  const [value, setValue] = useControllableState({
    onChange: props.onChange,
    value: props.value,
    defaultValue: props.defaultValue || [],
  });

  const collection = useMemo(
    () =>
      createListCollection({
        items,
        itemToString: (item) => item.label,
        itemToValue: (item) => item.value,
      }),

    [items],
  );

  const getOptions = useMemo(() => {
    return isFunction(options) ? options : () => options;
  }, [options]);

  const { contains } = useFilter({ sensitivity: 'base' });

  const handleInputChange = useDebounceCallback(async (search: string) => {
    const newItems = await getOptions(search);
    setItems(newItems.filter((item) => contains(item.label, search)));
  }, 300);

  const combobox = useCombobox({
    collection,
    onInputValueChange: ({ inputValue }) => {
      handleInputChange(inputValue);
    },
    onValueChange(details) {
      setValue(details.value);
    },
    value,
    multiple: true,
  });

  useEffect(() => {
    handleInputChange('');
  }, []);

  return (
    <Combobox.RootProvider value={combobox} className="w-full">
      <Combobox.Label>{props.label}</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input placeholder={props.placeholder} />
        <Combobox.Trigger>
                {combobox.open ? <ChevronUp /> : <ChevronDown />}
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
      {props.defaultValue && (
        <SelectedValue
          value={props.defaultValue || []}
          valueToOptions={props.valueToOptions}
          onRemovedValue={(value) =>
            setValue((prev) => prev.filter((v) => v !== value))
          }
        />
      )}
      <SelectedValue
        value={value}
        valueToOptions={() =>
          combobox.collection.items.filter((item) => value.includes(item.value))
        }
        onRemovedValue={(value) =>
          setValue((prev) => prev.filter((v) => v !== value))
        }
      />
    </Combobox.RootProvider>
  );
};
interface SelectedValueProps {
  value: string[];
  onRemovedValue?: (value: string) => void;
  valueToOptions?:
    | Option[]
    | ((value: string[]) => Option[])
    | ((value: string[]) => Promise<Option[]>);
}
function SelectedValue({
  value,
  valueToOptions,
  onRemovedValue,
}: SelectedValueProps) {
  const [selected, setSelected] = useState<Option[]>([]);

  const loadSelectedOptions = useCallback(async () => {
    const fn = isFunction(valueToOptions)
      ? valueToOptions
      : () => valueToOptions || [];

    const options = await fn(value);
    setSelected(options);
  }, [value, valueToOptions]);

  useEffect(() => {
    loadSelectedOptions();
  }, [loadSelectedOptions]);
  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {selected?.map((select) => (
        <span
          key={select.label}
          className="bg-cyan-400 text-white px-2 py-1 rounded-full text-sm flex items-center gap-1"
        >
          {select?.label}
          <button
            type="button"
            onClick={() => onRemovedValue?.(select?.value)}
            className="ml-1 text-xs hover:text-white/80 focus:outline-none"
            aria-label={`Remove ${select?.label}`}
          >
            ✕
          </button>
        </span>
      ))}
    </div>
  );
}
