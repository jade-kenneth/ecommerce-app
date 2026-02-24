'use client';

import { useRouter } from 'next/navigation';
import type { ComponentType, ReactNode } from 'react';
import { useEffect } from 'react';

import { Layout as AdminLayout } from '~/features/admin/features/Layout';
import { AccountType } from '~/graphql/generated';
import { LazySession, useSession } from '~/providers/AuthProvider';
import { DefaultLoading } from './DefaultLoading';
import { DefaultUnauthorized } from './DefaultUnauthorized';

export type Role = AccountType;

export interface WithLayoutAccessOptions {
  role?: Role[];
  redirectTo?: string;
  loadingFallback?: ReactNode;
  unauthenticatedFallback?: ReactNode;
  unauthorizedFallback?: ReactNode;
}

function isRoleAllowed(role: Role, requiredRoles?: readonly Role[]) {
  if (!requiredRoles?.length) return true;
  return requiredRoles.includes(role);
}

export type WithLayoutGuardState =
  | 'loading'
  | 'unauthenticated'
  | 'unauthorized'
  | 'authorized';

/**
 * Guard state contract for `withLayout`.
 *
 * Render priority (top to bottom):
 * 1. `loading` - session is unresolved, never render protected content
 * 2. `unauthenticated` - auth error or no session
 * 3. `unauthorized` - authenticated but role check failed
 * 4. `authorized` - render admin layout + wrapped page
 *
 * This function is intentionally pure so the guard behavior can be unit tested
 * later without mounting React components.
 */
export function resolveWithLayoutGuardState(
  session: LazySession,
  requiredRoles?: readonly Role[],
): WithLayoutGuardState {
  if (session.status === 'loading') return 'loading';

  if (session.status === 'unauthenticated' || session.status === 'error') {
    return 'unauthenticated';
  }

  if (!isRoleAllowed(session.role, requiredRoles)) {
    return 'unauthorized';
  }

  return 'authorized';
}

export function withLayout<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithLayoutAccessOptions = {},
) {
  const requiredRoles = options.role;

  const redirectTo = options.redirectTo;

  const WithAdminLayout = (props: P) => {
    const session = useSession();
    const router = useRouter();

    const guardState = resolveWithLayoutGuardState(session, requiredRoles);

    const shouldRedirect =
      Boolean(redirectTo) &&
      guardState !== 'loading' &&
      guardState !== 'authorized';

    useEffect(() => {
      if (!shouldRedirect || !redirectTo) return;

      router.replace(redirectTo);
    }, [redirectTo, router, shouldRedirect]);

    if (guardState === 'loading') {
      return options.loadingFallback ?? <DefaultLoading />;
    }

    if (guardState === 'unauthenticated') {
      return (
        options.unauthenticatedFallback ?? (
          <DefaultUnauthorized message="You need to be authenticated to access this page." />
        )
      );
    }

    if (guardState === 'unauthorized') {
      const fallbackMessage =
        'You do not have the required role to access this page.';

      return (
        options.unauthorizedFallback ?? (
          <DefaultUnauthorized message={fallbackMessage} />
        )
      );
    }

    return (
      <AdminLayout>
        <WrappedComponent {...props} />
      </AdminLayout>
    );
  };

  WithAdminLayout.displayName = `withLayout(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return WithAdminLayout;
}
