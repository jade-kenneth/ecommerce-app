'use client';
import React from 'react';
import { Categories, Highlight, Navbar } from '~/features/portal';

import { LicenseContext } from './LicenseContext';
import { LicenseDialog } from './LicenseDialog';
import { useLicense } from './useLicense';

export interface LicenseProviderProps {
  excludePaths?: string[];
  children: React.ReactNode;
}

export const LicenseProvider = ({
  excludePaths,
  children,
}: LicenseProviderProps) => {
  const license = useLicense({ excludePaths });

  return (
    <LicenseContext value={license}>
      <LicensedRequired
        isLicensed={license.isLicensed}
        fallback={
          <LicenseDialog>
            <Highlight />
            <Navbar />
            <Categories />
          </LicenseDialog>
        }
      >
        {children}
      </LicensedRequired>
    </LicenseContext>
  );
};

interface LicensedRequiredProps {
  fallback?: React.ReactNode;
  children: React.ReactNode;
  isLicensed?: boolean;
}

export const LicensedRequired = ({
  fallback,
  children,
  isLicensed,
}: LicensedRequiredProps) => {
  if (isLicensed) return children;
  if (fallback) return fallback;
  return <div>You need a valid license to access this content.</div>;
};
