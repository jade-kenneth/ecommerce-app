'use client';
import { isAfter } from 'date-fns';
import { useEffect, useReducer, useRef } from 'react';
import { store } from '~/store';
import { getLicense } from './service';
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
      const data = await getLicense(licenseCode || '');
      if (!isMountedRef.current) return;

      if (isAfter(new Date(data.expirationDate), new Date())) {
        setState({
          isLicensed: true,
          loading: false,
        });
      } else {
        setState({
          isLicensed: false,
          loading: false,
        });
      }
    } catch (err) {
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
    isLicensed: state.isLicensed,
    loading: state.loading,
    setLicense: setState,
    validateLicense,
    clearLicense,
  };
};
