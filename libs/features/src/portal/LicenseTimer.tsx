'use client';

import { differenceInSeconds, intervalToDuration } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { useGlobalStore } from '~/hooks/useGlobalStore';
import { LICENSE_CODE_LOCAL_STORAGE_KEY } from '~/utils/constant';

type LicenseStoragePayload = {
  __v?: string;
  __t?: number;
};

const readLicenseExpiry = (): number | null => {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(LICENSE_CODE_LOCAL_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as LicenseStoragePayload;
    if (typeof parsed.__t === 'number') return parsed.__t;
  } catch {
    return null;
  }

  return null;
};

const formatRemaining = (now: number, expiresAt: number) => {
  const duration = intervalToDuration({ start: now, end: expiresAt });
  const pad = (value: number) => value.toString().padStart(2, '0');
  const hours = duration.hours ?? 0;
  const minutes = duration.minutes ?? 0;

  if (hours > 0) {
    return `${hours}:${pad(minutes)}h`;
  }

  if (minutes > 0) {
    return `${minutes}m`;
  }

  return '<1m';
};

export const LicenseTimer = () => {
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const rating = useGlobalStore((state) => state.rating);
  const syncExpiryFromStorage = () => {
    setExpiresAt(readLicenseExpiry());
  };

  useEffect(() => {
    const syncNowAndExpiry = () => {
      setNow(Date.now());
      syncExpiryFromStorage();
    };

    syncNowAndExpiry();

    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') return;
      syncNowAndExpiry();
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== LICENSE_CODE_LOCAL_STORAGE_KEY) return;
      syncNowAndExpiry();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('storage', handleStorage);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const remainingSeconds = useMemo(() => {
    if (!expiresAt) return null;
    return Math.max(0, differenceInSeconds(expiresAt, now));
  }, [expiresAt, now]);

  useEffect(() => {
    if (!expiresAt) return;

    const tick = () => setNow(Date.now());

    tick();

    const intervalMs =
      (remainingSeconds ?? 0) > 3600
        ? 60_000
        : (remainingSeconds ?? 0) > 300
          ? 15_000
          : 1_000;

    const interval = window.setInterval(tick, intervalMs);
    return () => window.clearInterval(interval);
  }, [expiresAt, remainingSeconds]);

  useEffect(() => {
    if (!expiresAt || remainingSeconds !== 0) return;
    if (typeof window === 'undefined') return;
    localStorage.removeItem(LICENSE_CODE_LOCAL_STORAGE_KEY);
    rating.setIsOpen(true);
    setExpiresAt(null);
  }, [expiresAt, remainingSeconds, rating]);

  if (!expiresAt || remainingSeconds === null) return null;

  const isExpired = remainingSeconds === 0;

  return (
    <div className=" z-20">
      <div
        className={
          isExpired
            ? 'rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 shadow-sm'
            : 'rounded-full border border-cyan-100 bg-white/90 px-3 py-1 text-xs font-semibold text-cyan-700 shadow-sm backdrop-blur'
        }
        aria-live="polite"
      >
        {isExpired
          ? 'License expired'
          : `License expires in ${formatRemaining(now, expiresAt)}`}
      </div>
    </div>
  );
};
