import { store } from '~/store';
import * as service from './service.core';
export const __validateLicense = async (code: string) => {
  try {
    const license = await service.validateLicense(code);

    await store.set({
      licenseCode: code,
    });

    return license;
  } catch (error) {
    return { expirationDate: '' };
  }
};
