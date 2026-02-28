type Dict = Record<string, unknown>;

function splitProps<T extends Dict, K extends keyof T>(
  props: T,
  keys: readonly K[],
): [Pick<T, K>, Omit<T, K>] {
  const rest = {} as Omit<T, K>;
  const result = {} as Pick<T, K>;

  const keySet = new Set<keyof T>(keys);

  for (const key in props) {
    const typedKey = key as keyof T;
    const value = props[typedKey];

    if (keySet.has(typedKey)) {
      (result as Record<keyof T, unknown>)[typedKey] = value;
    } else {
      (rest as Record<keyof T, unknown>)[typedKey] = value;
    }
  }

  return [result, rest];
}

export function createSplitProps<T extends Dict>(keys: (keyof T)[]) {
  return function split<Props extends T>(props: Props) {
    return splitProps(props, keys as (keyof Props & keyof T)[]) as [
      T,
      Omit<Props, keyof T>,
    ];
  };
}
