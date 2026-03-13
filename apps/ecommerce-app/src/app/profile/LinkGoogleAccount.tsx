'use client';

import { useMutation } from '@apollo/client/react';
import { useGoogleLogin } from '@react-oauth/google';
import { Link2 } from 'lucide-react';

import { Button, toaster } from '~/components';
import { LINK_GOOGLE_ACCOUNT_MUTATION, SELF_QUERY } from '~/graphql/Account';
import { fetchGoogleUserInfo } from '~/providers/AuthProvider';

type LinkGoogleAccountProps = {
  onLinked?: () => void;
};

export const LinkGoogleAccount = ({ onLinked }: LinkGoogleAccountProps) => {
  const [linkGoogleAccount, { loading }] = useMutation(LINK_GOOGLE_ACCOUNT_MUTATION);

  const loginGoogle = useGoogleLogin({
    flow: 'implicit',
    scope: 'openid email profile',
    onSuccess: async ({ access_token: accessToken }) => {
      if (!accessToken) {
        toaster.error({
          description: 'Google sign-in did not return an access token.',
        });
        return;
      }

      try {
        const payload = await fetchGoogleUserInfo(accessToken);

        const result = await linkGoogleAccount({
          variables: {
            input: {
              id: payload.sub,
              emailAddress: payload.email,
              displayName: payload.name,
              avatarUrl: payload.picture,
            },
          },
          refetchQueries: [{ query: SELF_QUERY }],
        });

        if (!result.data?.linkGoogleAccount) {
          toaster.error({
            description: 'Unable to link Google account. Please try again.',
          });
          return;
        }

        onLinked?.();
        toaster.success({ description: 'Google account linked successfully.' });
      } catch {
        toaster.error({
          description: 'Unable to link Google account. Please try again.',
        });
      }
    },
    onError: () => {
      toaster.error({
        description: 'Google sign-in was canceled or failed.',
      });
    },
  });

  return (
    <Button
      className="rounded-[32px] bg-cyan-700 px-4 text-white"
      disabled={loading}
      onClick={() => loginGoogle()}
    >
      <Link2 className="mr-2 h-4 w-4" />
      {loading ? 'Linking...' : 'Link Account'}
    </Button>
  );
};
