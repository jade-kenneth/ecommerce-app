'use client';

import type { ComponentType, ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { Layout as AdminLayout } from '~/features/admin/features/Layout';
import { AccountType } from '~/graphql/generated';
import { useSession } from '~/providers/AuthProvider';
import { DefaultLoading } from './DefaultLoading';
import { DefaultUnauthorized } from './DefaultUnauthorized';

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
