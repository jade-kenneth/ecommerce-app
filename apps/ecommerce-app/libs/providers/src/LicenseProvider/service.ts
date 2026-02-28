import { store } from 'libs/data-access/src/store/store';

import { LicenseInput } from 'libs/graphql/src/generated';
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
