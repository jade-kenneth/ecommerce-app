import { createContext } from 'libs/utils/createContext';
import { useLicense } from './useLicense';

export const [LicenseContext, useLicenseContext] =
  createContext<ReturnType<typeof useLicense>>();
