'use client';
import { useEffect, useReducer, useRef } from 'react';
import { store } from '~/store';
interface UseLicenseOptions {
  excludePaths?: string[];
}

interface LicenseState {
  isLicensed?: boolean;

  loading?: boolean;
}

export const useLicense = (options: UseLicenseOptions) => {
  const [state, setState] = useReducer(
    (prev: LicenseState, next: Partial<LicenseState>) => ({ ...prev, ...next }),
    {
      isLicensed: true,
      loading: true,
    },
  );
  const isMountedRef = useRef(true);
  const isValidatingRef = useRef(false);

  async function validateLicense() {
    if (isValidatingRef.current) return;
    isValidatingRef.current = true;

    try {
      const { licenseCode } = await store.get();
      if (!isMountedRef.current) return;

      setState({
        isLicensed: Boolean(licenseCode),
        loading: false,
      });
    } catch {
      if (!isMountedRef.current) return;
      setState({
        isLicensed: false,
        loading: false,
      });
    } finally {
      isValidatingRef.current = false;
    }
  }
  useEffect(() => {
    isMountedRef.current = true;

    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') return;
      validateLicense();
    };

    validateLicense();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isMountedRef.current = false;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const clearLicense = () => {
    setState({
      isLicensed: false,
      loading: false,
    });
  };

  return {
    isLicensed: true,
    loading: state.loading,
    setLicense: setState,
    validateLicense,
    clearLicense,
  };
};
