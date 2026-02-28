import axios from 'axios';
import { License } from './service';

export const validateLicense = async (
  code: string
): Promise<{ data: License }> => {
  try {
    return await axios.post(
      'validate/license',
      { code },
      {
        baseURL: process.env.NEXT_PUBLIC_BASE_URL_PORTAL_API,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (err) {
    return Promise.reject(err);
  }
};
