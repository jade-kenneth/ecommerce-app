import { ReactNode } from 'react';
import { callIfFn } from '~/utils/callIfFn';

export interface ShowProps {
  when: boolean | null | undefined | (() => boolean | null | undefined);
  fallback?: ReactNode;
  children: ReactNode;
}

export function Show(props: ShowProps) {
  const condition = callIfFn(props.when);
  return condition ? props.children : props.fallback;
}
