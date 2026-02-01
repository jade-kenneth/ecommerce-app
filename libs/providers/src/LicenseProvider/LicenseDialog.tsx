import { Key, ShieldCheck } from 'lucide-react';
import { PropsWithChildren, useState } from 'react';
import { Button } from '~/components/Button';
import { Dialog } from '~/components/Dialog';
import { OtpField } from '~/components/OtpField';
import { useLicenseContext } from './LicenseContext';
import { getLicense } from './service';

export const LicenseDialog = (props: PropsWithChildren) => {
  const context = useLicenseContext();
  const [error, setError] = useState<string | null>(null);

  const handleActivate = async (value: string) => {
    try {
      const res = await getLicense(value);
      if (res) context.setLicense({ isLicensed: true });
    } catch (err) {
      setError('License activation failed');
    }
  };

  return (
    <Dialog.Root open={true}>
      <Dialog.Backdrop>{props.children}</Dialog.Backdrop>

      <Dialog.Positioner className="bg-white/80 flex justify-center items-center">
        <Dialog.Content className="flex justify-center   max-w-[550px] min-w-[350px] py-6 items-center">
          <div className=" rounded-3xl text-center shadow-lg px-12 py-3">
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck
                  size={40}
                  className="text-cyan-600"
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
                <p className="text-error-600  font-semibold mt-2">{error}</p>
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
                  href="https://www.facebook.com/jeidosenpaitsx/"
                  target="_blank"
                  className="text-cyan-600 hover:text-cyan-700 font-medium"
                >
                  Contact admin
                </a>
              </p>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
