'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { ShieldCheck } from 'lucide-react';

import { LinkGoogleAccount } from '../LinkGoogleAccount';
import { useProfileContext } from '../ProfileContext';

import { Badge, Button } from '~/components';
import { LoginMethodKey } from '../useProfile';

export default function ProfileSecurityTabContent() {
  const {
    state: { loginMethods },
    dispatch,
  } = useProfileContext();

  const requestUnlinkProvider = (providerKey: LoginMethodKey) => {
    const method = loginMethods.find((item) => item.key === providerKey);

    if (!method?.linked) return;

    dispatch({ type: 'open_unlink_provider_dialog', providerKey });
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5">
      <div className="mb-4">
        <p className="text-base font-semibold text-gray-900">Linked Accounts</p>
        <p className="text-sm text-gray-500">
          Link or unlink login methods while keeping at least one active method.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {loginMethods.map((method) => (
          <div key={method.key} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">{method.label}</p>
                <p className="text-xs text-gray-500">{method.linked ? 'Linked' : 'Not linked'}</p>
              </div>
              <Badge.Root colorScheme={method.linked ? 'success' : 'warning'}>
                <Badge.Label>{method.linked ? 'Linked' : 'Not Linked'}</Badge.Label>
              </Badge.Root>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {method.linked && (
                <Button
                  className="rounded-[32px] border border-gray-200 bg-white px-4 text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => requestUnlinkProvider(method.key)}
                >
                  Unlink
                </Button>
              )}

              {method.key === 'google' && !method.linked && (
                <GoogleOAuthProvider
                  clientId={process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID || ''}
                >
                  <LinkGoogleAccount
                    onLinked={() => dispatch({ type: 'link_provider', providerKey: method.key })}
                  />
                </GoogleOAuthProvider>
              )}
            </div>
          </div>
        ))}
      </div>

      {loginMethods.find((method) => method.key === 'password')?.linked && (
        <div className="mt-6 rounded-xl border border-cyan-100 bg-cyan-50 p-4 hidden">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-cyan-900">Password Security</p>
              <p className="text-sm text-cyan-700">
                Change your password regularly to keep your account secure.
              </p>
            </div>
            <Button
              className="rounded-[32px] bg-cyan-700 px-4 text-white"
              onClick={() => dispatch({ type: 'open_change_password_dialog' })}
            >
              <ShieldCheck className="mr-2 h-4 w-4" />
              Change Password
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
