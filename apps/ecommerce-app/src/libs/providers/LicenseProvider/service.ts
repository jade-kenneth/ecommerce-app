import { LicenseInput } from 'src/libs/global/src/graphql/generated';
import { store } from '~/store';
import * as service from './service.core';

export type License = LicenseInput;
export const getLicense = async (code: string): Promise<License> => {
  try {
    const { data } = await service.validateLicense(code);

    await store.set({
      licenseCode: code,
    });

    return data;
  } catch (error) {
    throw new Error('Invalid license');
  }
};
