import { Key, ShieldCheck } from 'lucide-react';
import { PropsWithChildren, useState } from 'react';
import { Button } from '../../../ui/components/Button';
import { Dialog } from '../../../ui/components/Dialog';
import { OtpField } from '../../../ui/components/OtpField';
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
      <Dialog.Backdrop className="bg-[unset]">{props.children}</Dialog.Backdrop>

      <Dialog.Positioner className="bg-white/80 flex justify-center items-center px-4 py-6 sm:px-8 sm:py-12">
        <Dialog.Content className="flex justify-center w-[94vw] border-[1px]  rounded-3xl  sm:w-auto max-w-[550px] min-w-0  items-center">
          <div className="rounded-3xl text-center shadow-lg px-4 h-full sm:px-12 py-4 sm:py-6 w-full">
            <div className="flex flex-col items-center mb-6 sm:mb-8">
              <div className="w-14 h-14 sm:w-20 sm:h-20 bg-cyan-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <ShieldCheck
                  size={28}
                  className="text-cyan-600"
                  strokeWidth={1.5}
                />
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
                License Required
              </h1>
              <p className="text-sm sm:text-lg text-gray-500">
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
                <p className="text-error-600 text-sm sm:text-base font-semibold mt-2">
                  {error}
                </p>
              </div>
              <Button
                disabled={context.loading}
                className="w-full text-white font-semibold py-3 sm:py-4 px-5 sm:px-6 rounded-2xl flex items-center justify-center gap-3 transition-colors text-base sm:text-lg"
              >
                <Key size={20} className="sm:hidden" />
                <Key size={24} className="hidden sm:inline" />
                {context.loading ? 'Validating License...' : 'Activate License'}
              </Button>
            </div>
            <div className="text-center mb-6 sm:mb-8">
              <p className="text-gray-600 text-sm sm:text-base">
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
