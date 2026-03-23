import axios from 'axios';
import { License } from './service';
import { TURNSTILE_TOKEN_HEADER } from '~/utils/turnstile';

export const validateLicense = async (
  code: string,
  turnstileToken: string,
): Promise<{ data: License }> => {
  try {
    return await axios.post(
      'validate/license',
      { code },
      {
        baseURL: process.env.NEXT_PUBLIC_BASE_URL_PORTAL_API,
        headers: {
          'Content-Type': 'application/json',
          [TURNSTILE_TOKEN_HEADER]: turnstileToken,
        },
      }
    );
  } catch (err) {
    return Promise.reject(err);
  }
};
