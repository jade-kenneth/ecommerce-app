'use client';

import { useSearchParams } from 'next/navigation';
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { createContext } from '~/utils/createContext';

const FUTURE_FLAG = 'future';
const FUTURE_STORAGE_KEY = 'future';

export type FeatureFlagContextValue = {
  enabled: boolean;
};

export const [FeatureFlagContext, useFeatureFlagContext] =
  createContext<FeatureFlagContextValue>({
    name: 'FeatureFlagContext',
    hookName: 'useFeatureFlagContext',
    providerName: 'FeatureFlagProvider',
  });

export const FeatureFlagProvider = ({ children }: PropsWithChildren) => {
  const searchParams = useSearchParams();
  const [isFutureEnabled, setIsFutureEnabled] = useState(false);

  useEffect(() => {
    const savedFlag = window.localStorage.getItem(FUTURE_STORAGE_KEY);
    setIsFutureEnabled(savedFlag === 'true');
  }, []);

  useEffect(() => {
    const shouldEnableFuture = searchParams.get(FUTURE_FLAG) === 'true';
    const disableFutureFlag = searchParams.get(FUTURE_FLAG) === 'false';

    if (!shouldEnableFuture && !disableFutureFlag) {
      return;
    }
    if (shouldEnableFuture) {
      window.localStorage.setItem(FUTURE_STORAGE_KEY, 'true');
      setIsFutureEnabled(true);
    } else if (disableFutureFlag) {
      window.localStorage.setItem(FUTURE_STORAGE_KEY, 'false');
      setIsFutureEnabled(false);
    }
  }, [searchParams]);

  const updateFutureFlag = useCallback((enabled: boolean) => {
    window.localStorage.setItem(FUTURE_STORAGE_KEY, enabled ? 'true' : 'false');
    setIsFutureEnabled(enabled);
  }, []);

  const toggleFutureFlag = useCallback(() => {
    updateFutureFlag(!isFutureEnabled);
  }, [isFutureEnabled, updateFutureFlag]);

  const context = useMemo(
    () => ({
      enabled: isFutureEnabled,
    }),
    [isFutureEnabled],
  );

  return (
    <FeatureFlagContext value={context}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[1090] flex justify-center">
        <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/95 px-3 py-2 shadow-lg backdrop-blur">
          <span className="text-xs font-medium text-gray-700">Future Flag</span>
          <button
            aria-label="Toggle future feature flag"
            aria-pressed={isFutureEnabled}
            className={`rounded-full px-3 py-1 text-xs font-semibold text-white transition ${
              isFutureEnabled
                ? 'bg-cyan-600 hover:bg-cyan-700'
                : 'bg-gray-500 hover:bg-gray-600'
            }`}
            onClick={toggleFutureFlag}
            type="button"
          >
            {isFutureEnabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      </div>
    </FeatureFlagContext>
  );
};
