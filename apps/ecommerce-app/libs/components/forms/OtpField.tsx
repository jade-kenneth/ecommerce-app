import { useControllableState } from '~/hooks/useControllableState';
import { PinInput } from '../Primitives/PinInput';

export interface OtpFieldProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  className?: string;
}

export function OtpField(props: OtpFieldProps) {
  const [value, setValue] = useControllableState({
    value: props.value,
    defaultValue: props.defaultValue ?? '',
    onChange: props.onChange,
  });

  const arrayValue = Array.from({ length: 9 }, () => '').map(
    (v, idx) => value.charAt(idx) || v,
  );

  return (
    <PinInput.Root
      type="alphanumeric"
      otp
      count={9}
      value={arrayValue}
      onValueChange={(details) => {
        setValue(details.valueAsString);
      }}
      invalid={props.invalid}
      required={props.required}
      readOnly={props.readOnly}
      disabled={props.disabled}
      placeholder="-"
      className={props.className}
    >
      <PinInput.Control className="flex h-[30px]">
        <PinInput.Input index={0} />
        <PinInput.Input index={1} />
        <PinInput.Input index={2} />
        <PinInput.Input index={3} />
        <PinInput.Input index={4} />
        <PinInput.Input index={5} />
        <PinInput.Input index={6} />
        <PinInput.Input index={7} />
        <PinInput.Input index={8} />
      </PinInput.Control>
      <PinInput.HiddenInput />
    </PinInput.Root>
  );
}
