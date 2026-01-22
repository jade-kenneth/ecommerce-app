import { Key, Shield } from 'lucide-react';
import { PropsWithChildren, useState } from 'react';
import { Button } from '~/components/Button';
import { Dialog } from '~/components/Dialog';
import { OtpField } from '~/components/OtpField';
import { useLicenseContext } from './LicenseContext';

export const LicenseDialog = (props: PropsWithChildren) => {
  const context = useLicenseContext();
  const [error, setError] = useState<string | null>(null);

  const handleActivate = async (value: string) => {
    const res = await context.validateLicense(value);
    if (res) context.setLicense({ isLicensed: true });
    else setError('License activation failed');
  };

  return (
    <Dialog.Root open={true}>
      <Dialog.Backdrop>{props.children}</Dialog.Backdrop>
      <Dialog.Positioner className="bg-white/80 flex justify-center items-center">
        <Dialog.Content className="flex justify-center items-center">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-lg p-12">
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 bg-primary-100-value rounded-full flex items-center justify-center mb-6">
                <Shield
                  size={40}
                  className="text-primary-600-value"
                  strokeWidth={1.5}
                />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                License Required
              </h1>
              <p className="text-lg text-gray-500">
                Enter your license code to access the site
              </p>
            </div>
            <div className="mb-5">
              <div className="mb-5">
                <OtpField
                  disabled={context.loading}
                  onChange={(value) => {
                    if (value.length === 9) {
                      handleActivate(value);
                    }
                  }}
                />
                <p className="text-error-600-value  font-semibold mt-2">
                  {error}
                </p>
              </div>
              <Button
                disabled={context.loading}
                className="w-full  text-white font-semibold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-colors text-lg"
              >
                <Key size={24} />
                {context.loading ? 'Validating License...' : 'Activate License'}
              </Button>
            </div>
            <div className="text-center mb-8">
              <p className="text-gray-600">
                Don&apos;t have a license?{' '}
                <a
                  href="#"
                  className="text-primary-600-value hover:text-primary-700-value font-medium"
                >
                  Contact admin
                </a>
              </p>
            </div>
            <div className="bg-carbon-950-value  rounded-md flex flex-col items-center py-5 justify-center mt-8 text-center">
              <p className="text-gray-500 text-sm mb-2">Demo License Code</p>
              <p className="text-gray-900 font-mono text-lg font-bold tracking-widest">
                DEMO-CODE-FREE-TRIAL
              </p>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
