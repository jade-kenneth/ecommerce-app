'use client';

import { useSearchParams } from 'next/navigation';
import {
  PropsWithChildren,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { createContext } from '~/utils/createContext';

const FUTURE_FLAG = 'future';
const FUTURE_STORAGE_KEY = 'future';

type FeatureFlags = {
  future: boolean;
};

export type FeatureFlagContextValue = {
  enabled: boolean;
  flags: FeatureFlags;
  hydrated: boolean;
};

export const [FeatureFlagContext, useFeatureFlagContext] =
  createContext<FeatureFlagContextValue>({
    name: 'FeatureFlagContext',
    hookName: 'useFeatureFlagContext',
    providerName: 'FeatureFlagProvider',
  });

type QuerySyncBridgeProps = {
  onSync: (value: boolean) => void;
};

function FeatureFlagQuerySyncBridge(props: QuerySyncBridgeProps) {
  const { onSync } = props;
  const searchParams = useSearchParams();

  useEffect(() => {
    const value = searchParams.get(FUTURE_FLAG);

    if (value === 'true') {
      onSync(true);
      return;
    }

    if (value === 'false') {
      onSync(false);
    }
  }, [onSync, searchParams]);

  return null;
}

export function FeatureFlagProvider({ children }: PropsWithChildren) {
  const [isFutureEnabled, setIsFutureEnabled] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const persistFutureFlag = useCallback((enabled: boolean) => {
    window.localStorage.setItem(FUTURE_STORAGE_KEY, enabled ? 'true' : 'false');
    setIsFutureEnabled(enabled);
  }, []);

  useEffect(() => {
    const savedFlag = window.localStorage.getItem(FUTURE_STORAGE_KEY);

    setIsFutureEnabled(savedFlag === 'true');
    setHydrated(true);
  }, []);

  const toggleFutureFlag = useCallback(() => {
    persistFutureFlag(!isFutureEnabled);
  }, [isFutureEnabled, persistFutureFlag]);

  const context = useMemo(
    () => ({
      enabled: isFutureEnabled,
      flags: {
        future: isFutureEnabled,
      },
      hydrated,
    }),
    [hydrated, isFutureEnabled],
  );

  const shouldShowToggle = process.env.NEXT_PUBLIC_SHOW_FLAG_TOGGLE === 'true';
  return (
    <FeatureFlagContext value={context}>
      {children}
      <Suspense fallback={null}>
        <FeatureFlagQuerySyncBridge onSync={persistFutureFlag} />
      </Suspense>
      {shouldShowToggle ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[1090] flex justify-center">
          <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/95 px-3 py-2 shadow-lg backdrop-blur">
            <span className="text-xs font-medium text-gray-700">
              Future Flag
            </span>
            <button
              aria-label="Toggle future feature flag"
              aria-pressed={isFutureEnabled}
              className={`rounded-full px-3 py-1 text-xs font-semibold text-white transition ${
                isFutureEnabled
                  ? 'bg-cyan-600 hover:bg-cyan-700'
                  : 'bg-gray-500 hover:bg-gray-600'
              }`}
              disabled={!hydrated}
              onClick={toggleFutureFlag}
              type="button"
            >
              {isFutureEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>
      ) : null}
    </FeatureFlagContext>
  );
}
