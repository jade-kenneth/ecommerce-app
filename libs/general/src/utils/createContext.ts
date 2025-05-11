import * as React from 'react';

interface CreateContextOptions {
  name?: string;
  hookName?: string;
  providerName?: string;
  strict?: boolean;
}

type CreateContextReturn<T> = [React.Provider<T>, () => T, React.Context<T>];

export function createContext<T>(options: CreateContextOptions = {}) {
  const {
    name,
    strict = true,
    hookName = 'useContext',
    providerName = 'Provider',
  } = options;

  const Context = React.createContext<T | undefined>(undefined);

  Context.displayName = name;

  function useContext() {
    const context = React.useContext(Context);

    if (!context && strict) {
      const error = new Error();

      error.name = 'ContextError';
      error.message = `${hookName} returned 'undefined'. Seems you forgot to wrap component within ${providerName}`;

      Error.captureStackTrace?.(error, useContext);

      throw error;
    }

    return context;
  }

  return [Context.Provider, useContext, Context] as CreateContextReturn<T>;
}
