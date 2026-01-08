import * as React from 'react';

function useCallbackRef<Args extends unknown[], Return>(
  callback: ((...args: Args) => Return) | undefined,
  deps: React.DependencyList = []
) {
  const callbackRef = React.useRef<typeof callback>(() => {
    throw new Error('Cannot call an event handler while rendering.');
  });

  React.useInsertionEffect(() => {
    callbackRef.current = callback;
  });

  return React.useCallback(
    (...args: Args) => callbackRef.current?.(...args),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps
  );
}

interface UseControllableStateProps<T> {
  value?: T;
  onChange?: (value: T) => void;
  defaultValue?: T | (() => T);
}

export function useControllableState<T>(
  props: UseControllableStateProps<T>
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const { value: userDefinedValue, defaultValue, onChange } = props;

  const onChangeProp = useCallbackRef(onChange);
  const shouldUpdateProp = useCallbackRef((prev, next) => prev !== next);

  const [uncontrolledState, setUncontrolledState] = React.useState(
    defaultValue as T
  );
  const controlled = userDefinedValue !== undefined;
  const value = controlled ? userDefinedValue : uncontrolledState;

  const setValue = useCallbackRef(
    (next: React.SetStateAction<T>) => {
      const setter = next as (prevState?: T) => T;
      const nextValue = typeof next === 'function' ? setter(value) : next;

      if (!shouldUpdateProp(value, nextValue)) return;

      if (!controlled) setUncontrolledState(nextValue);

      onChangeProp(nextValue);
    },
    [controlled, onChangeProp, value, shouldUpdateProp]
  );

  return [value, setValue];
}
