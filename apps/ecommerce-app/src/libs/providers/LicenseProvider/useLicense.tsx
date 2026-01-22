'use client';
import { isAfter } from 'date-fns';
import { isEmpty } from 'lodash';
import { useEffect, useReducer } from 'react';
import { store } from '~/store';
import { __validateLicense } from './service';
interface UseLicenseOptions {
  excludePaths?: string[];
}

interface LicenseState {
  isLicensed: boolean;

  loading?: boolean;
}

export const useLicense = (options: UseLicenseOptions) => {
  const [state, setState] = useReducer(
    (prev: LicenseState, next: Partial<LicenseState>) => ({ ...prev, ...next }),
    {
      isLicensed: false,
      loading: false,
    }
  );
  const validateLicense = async (code?: string): Promise<boolean> => {
    const { licenseCode } = await store.get();

    const currentLicenseCode = code || licenseCode || '';

    setState({
      isLicensed: false,
      loading: true,
    });

    try {
      const license = await __validateLicense(currentLicenseCode);

      if (!isEmpty(license.expirationDate)) {
        setState({
          isLicensed: isAfter(new Date(), new Date(license.expirationDate)),
          loading: false,
        });
        return true;
      } else {
        setState({
          isLicensed: false,
          loading: false,
        });
        return false;
      }
    } catch (err) {
      setState({
        isLicensed: false,
        loading: false,
      });
      return false;
    }
  };
  useEffect(() => {
    validateLicense();
    document.addEventListener('visibilitychange', () => validateLicense);

    return () => {
      document.removeEventListener('visibilitychange', () => validateLicense);
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
