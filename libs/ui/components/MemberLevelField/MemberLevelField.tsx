import { isNull, isObject } from 'lodash';
import { CheckCircle2 } from 'lucide-react';

import { useControllableState } from '~/hooks/useControllableState';
import { NumberInputField } from '../NumberInputField';
import { Checkbox } from '../ui/Checkbox';

type MemberLevelInputMap = Record<string, string | null | undefined>;

type Value = {
  type?: 'per-level' | 'bet-amount';
  perLevel?: MemberLevelInputMap;
  betAmount?: MemberLevelInputMap;
};
interface MemberLevelFieldProps {
  valueProps?: Value;
  onValueChange?: (value: Value) => void;
}
export const MemberLevelField = ({
  onValueChange,
  valueProps,
}: MemberLevelFieldProps) => {
  const [value, setValue] = useControllableState({
    onChange: onValueChange,
    defaultValue: {
      type: hasAllDefinedValue(valueProps?.perLevel)
        ? 'per-level'
        : 'bet-amount',
      perLevel: valueProps?.perLevel ?? {},
      betAmount: valueProps?.betAmount ?? {},
    },
  });

  return (
    <div className="flex flex-col gap-2">
      <Checkbox.Root
        checked={value.type === 'per-level'}
        onCheckedChange={(
          details: { checked: boolean | 'indeterminate' },
        ) => {
          if (details.checked !== true) {
            setValue((prev) => ({ ...prev, type: 'bet-amount' }));
          } else {
            setValue((prev) => ({ ...prev, type: 'per-level' }));
          }
        }}
      >
        <Checkbox.Control>
          <Checkbox.Indicator asChild>
            <CheckCircle2 className="w-4 h-4" />
          </Checkbox.Indicator>
        </Checkbox.Control>
        <Checkbox.Label className="text-sm font-medium">
          Per Level
        </Checkbox.Label>
        <Checkbox.HiddenInput />
      </Checkbox.Root>
      {value.type === 'bet-amount' && <NumberInputField />}
      {value.type === 'per-level' && (
        <>
          {Object.entries(value.perLevel ?? {}).map(([key, levelValue]) => {
            return (
              <NumberInputField
                key={key}
                value={levelValue ?? undefined}
                onChange={(e) => {
                  setValue((prev) => ({
                    ...prev,
                    perLevel: { ...(prev.perLevel ?? {}), [key]: e },
                  }));
                }}
              />
            );
          })}
        </>
      )}
    </div>
  );
};
function hasAllDefinedValue(obj: unknown): boolean {
  if (obj === undefined) return false;
  if (!isNull(obj) && isObject(obj)) {
    return Object.values(obj as Record<string, unknown>).every((value) =>
      hasAllDefinedValue(value),
    );
  }
  return true;
}
