'use client';

import type { ComponentType, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Layout as AdminLayout } from '~/features/admin/features/Layout';
import { AccountType } from '~/graphql/generated';
import { useSession } from '~/providers/AuthProvider';

export enum Permission {
  ReadDashboard = 'READ_DASHBOARD',
}

export type Role = AccountType;

export interface WithLayoutAccessOptions {
  role?: Role[];
  permission?: Permission;
  redirectTo?: string;
  loadingFallback?: ReactNode;
  unauthenticatedFallback?: ReactNode;
  unauthorizedFallback?: ReactNode;
}

function DefaultLoading() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-50 to-white px-4 py-6 sm:px-6 sm:py-10 dark:from-gray-950 dark:to-gray-900">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-2xl items-center justify-center sm:min-h-[calc(100vh-5rem)]">
        <div className="w-full rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur sm:rounded-3xl sm:p-8 dark:border-gray-800 dark:bg-gray-950/80">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 ring-1 ring-cyan-100 sm:h-16 sm:w-16 dark:bg-cyan-950/40 dark:ring-cyan-900/60">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-cyan-200 border-t-cyan-600 sm:h-8 sm:w-8 dark:border-cyan-900 dark:border-t-cyan-400" />
            </div>

            <h2 className="text-base font-semibold text-slate-900 sm:text-lg dark:text-white">
              Checking Admin Access
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-600 sm:text-sm dark:text-slate-300">
              We are verifying your session and permissions before loading the
              admin page.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="h-16 animate-pulse rounded-xl border border-slate-200 bg-slate-100/80 dark:border-gray-800 dark:bg-gray-900/70" />
            <div className="h-16 animate-pulse rounded-xl border border-slate-200 bg-slate-100/80 dark:border-gray-800 dark:bg-gray-900/70" />
            <div className="h-16 animate-pulse rounded-xl border border-slate-200 bg-slate-100/80 dark:border-gray-800 dark:bg-gray-900/70" />
          </div>
        </div>
      </div>
    </div>
  );
}

function DefaultUnauthorized({ message }: { message: string }) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-rose-50 via-white to-white px-4 py-6 sm:px-6 sm:py-10 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-2xl items-center justify-center sm:min-h-[calc(100vh-5rem)]">
        <div className="w-full rounded-2xl border border-rose-200 bg-white/95 p-5 shadow-sm sm:rounded-3xl sm:p-8 dark:border-rose-900/60 dark:bg-gray-950/85">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 ring-1 ring-rose-200 sm:h-16 sm:w-16 dark:bg-rose-950/50 dark:ring-rose-900/60">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className="h-7 w-7 text-rose-700 sm:h-8 sm:w-8 dark:text-rose-300"
              >
                <path
                  d="M12 8v5m0 3h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.72 3h16.92a2 2 0 0 0 1.72-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700 dark:text-rose-300">
              Access Restricted
            </p>
            <h2 className="mt-2 text-base font-semibold text-slate-900 sm:text-lg dark:text-white">
              Unable to open this admin page
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-600 sm:text-sm dark:text-slate-300">
              {message}
            </p>
          </div>

          <div className="mt-6 rounded-xl border border-rose-100 bg-rose-50/70 p-3 text-left sm:p-4 dark:border-rose-900/50 dark:bg-rose-950/20">
            <p className="text-xs leading-5 text-rose-800 sm:text-sm dark:text-rose-200">
              If this is unexpected, sign in again or contact an administrator
              to confirm your account role and access level.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function withLayout<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithLayoutAccessOptions = {},
) {
  const WithAdminLayout = (props: P) => {
    const session = useSession();

    const requiredRoles = ['ADMIN'];

    const [error, setError] = useState<
      'AuthVerificationFailed' | 'InsufficientRole' | null
    >(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (['unauthenticated', 'error'].includes(session.status)) {
        setError('AuthVerificationFailed');
        setLoading(false);
        return;
      }
      if (session.role) {
        if (!requiredRoles.includes(session.role)) {
          setError('InsufficientRole');
          setLoading(false);
          return;
        }
      }
      setLoading(false);
    }, [session]);

    if (loading) return options.loadingFallback ?? <DefaultLoading />;

    if (error) {
      switch (error) {
        case 'AuthVerificationFailed': {
          const fallbackMessage =
            'You need to be authenticated to access this page.';
          return (
            options.unauthenticatedFallback ?? (
              <DefaultUnauthorized message={fallbackMessage} />
            )
          );
        }
        case 'InsufficientRole': {
          const fallbackMessage =
            'You do not have the required role to access this page.';
          return (
            options.unauthorizedFallback ?? (
              <DefaultUnauthorized message={fallbackMessage} />
            )
          );
        }
        default:
          return null;
      }
    }

    return (
      <AdminLayout>
        <WrappedComponent {...props} />
      </AdminLayout>
    );
  };

  return WithAdminLayout;
}
