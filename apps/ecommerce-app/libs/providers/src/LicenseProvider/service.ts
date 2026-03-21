import { store } from '~/store';

import { LicenseInput } from '~/graphql/generated';
import * as service from './service.core';

export type License = LicenseInput;
export const getLicense = async (code: string): Promise<License> => {
  try {
    const { data } = await service.validateLicense(code);

    await store.set({
      licenseCode: `${data.code}@${data.expirationDate}`,
    });

    return data;
  } catch {
    throw new Error('Invalid license');
  }
};
