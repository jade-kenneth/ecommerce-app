import axios from 'axios';
interface ValidateLicenseResponse {
  expirationDate: string;
}
export const validateLicense = async (
  code: string
): Promise<ValidateLicenseResponse> => {
  try {
    return await axios.post<string, ValidateLicenseResponse>(
      '/validate-license',
      { code },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (err) {
    return { expirationDate: '' };
  }
};
