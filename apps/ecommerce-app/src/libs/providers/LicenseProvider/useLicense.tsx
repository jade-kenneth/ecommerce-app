'use client';
import { isAfter } from 'date-fns';
import { useEffect, useReducer } from 'react';
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

  async function validateLicense() {
    try {
      const { licenseCode } = await store.get();
      const data = await getLicense(licenseCode || '');

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
      setState({
        isLicensed: false,
        loading: false,
      });
    }
  }
  useEffect(() => {
    validateLicense();
    document.addEventListener('visibilitychange', validateLicense);

    return () => {
      document.removeEventListener('visibilitychange', validateLicense);
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
