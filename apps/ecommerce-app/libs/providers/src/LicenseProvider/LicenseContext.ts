import { createContext } from '~/utils/createContext';
import { useLicense } from './useLicense';

export const [LicenseContext, useLicenseContext] =
  createContext<ReturnType<typeof useLicense>>();
