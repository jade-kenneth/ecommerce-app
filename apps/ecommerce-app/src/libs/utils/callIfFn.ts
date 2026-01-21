import { isFunction } from 'lodash';

export function callIfFn<Return, Arg>(
  valueOrReturnsValue: ((...args: Arg[]) => Return) | Return,
  ...args: Arg[]
) {
  return isFunction(valueOrReturnsValue)
    ? valueOrReturnsValue(...args)
    : valueOrReturnsValue;
}
