'use client';

import { differenceInSeconds, intervalToDuration } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { useGlobalStore } from '~/hooks/useGlobalStore';
import { useLicenseContext } from '~/providers/LicenseProvider/LicenseContext';
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
  const seconds = duration.seconds ?? 0;

  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  }

  return `${minutes}:${pad(seconds)}`;
};

export const LicenseTimer = () => {
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const license = useLicenseContext();
  const rating = useGlobalStore((state) => state.rating);

  useEffect(() => {
    const tick = () => {
      setNow(Date.now());
      const nextExpiry = readLicenseExpiry();
      setExpiresAt((prev) => (prev === nextExpiry ? prev : nextExpiry));
    };

    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const remainingSeconds = useMemo(() => {
    if (!expiresAt) return null;
    return Math.max(0, differenceInSeconds(expiresAt, now));
  }, [expiresAt, now]);

  useEffect(() => {
    if (!expiresAt || remainingSeconds !== 0) return;
    if (typeof window === 'undefined') return;
    localStorage.removeItem(LICENSE_CODE_LOCAL_STORAGE_KEY);
    rating.setIsOpen(true);
    setExpiresAt(null);
  }, [expiresAt, license, remainingSeconds, rating]);

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
