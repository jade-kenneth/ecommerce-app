'use client';

import { useMutation, useQuery } from '@apollo/client/react';
import { User2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useMemo } from 'react';

import { Badge, toaster } from '~/components';
import { Sticky } from '~/components/Sticky';
import { Tabs } from '~/components/Tabs';
import { Footer, Highlight } from '~/features/portal';
import { Layout } from '~/features/portal/Layout/Layout';
import { SELF_QUERY, UNLINK_GOOGLE_ACCOUNT_MUTATION } from '~/graphql/Account';
import { ProfileProvider } from './ProfileContext';

import { ProfileTab, useProfile } from './useProfile';

const ClientOnlyNavbar = dynamic(() => import('~/features/portal').then((mod) => mod.Navbar), {
  ssr: false,
});

const renderTabContentLoading = () => (
  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5 text-sm text-gray-500">
    Loading section...
  </div>
);

const ProfilePersonalTabContent = dynamic(() => import('./tabs/ProfilePersonalTabContent'), {
  loading: renderTabContentLoading,
});

const ProfileAddressesTabContent = dynamic(() => import('./tabs/ProfileAddressesTabContent'), {
  loading: renderTabContentLoading,
});

const ProfileSecurityTabContent = dynamic(() => import('./tabs/ProfileSecurityTabContent'), {
  loading: renderTabContentLoading,
});

const ProfilePreferencesTabContent = dynamic(() => import('./tabs/ProfilePreferencesTabContent'), {
  loading: renderTabContentLoading,
});

const renderDialogLoading = () => null;

const ProfileAddressDialog = dynamic(() => import('./dialogs/ProfileAddressDialog'), {
  loading: renderDialogLoading,
});

const ProfileChangePasswordDialog = dynamic(() => import('./dialogs/ProfileChangePasswordDialog'), {
  loading: renderDialogLoading,
});

const ProfileDeleteAddressDialog = dynamic(() => import('./dialogs/ProfileDeleteAddressDialog'), {
  loading: renderDialogLoading,
});

const ProfileUnlinkProviderDialog = dynamic(() => import('./dialogs/ProfileUnlinkProviderDialog'), {
  loading: renderDialogLoading,
});

export default function ProfilePageClient() {
  const profileStore = useProfile();
  const { data: selfData } = useQuery(SELF_QUERY, {
    fetchPolicy: 'cache-and-network',
  });
  const [unlinkGoogleAccount] = useMutation(UNLINK_GOOGLE_ACCOUNT_MUTATION);

  const { state, dispatch } = profileStore;

  const { activeTab, dialogs, profile, loginMethods, unlinkProviderKey } = state;

  const linkedLoginMethodsCount = useMemo(
    () => loginMethods.filter((method) => method.linked).length,
    [loginMethods],
  );

  const fullName = `${profile.firstName} ${profile.lastName}`.trim();

  useEffect(() => {
    const isGoogleLinked = Boolean(selfData?.self?.googleDetails?.id);
    dispatch({
      type: 'set_provider_linked',
      providerKey: 'google',
      linked: isGoogleLinked,
    });
  }, [dispatch, selfData?.self?.googleDetails?.id]);

  const confirmUnlinkProvider = async () => {
    if (!unlinkProviderKey) return;

    if (unlinkProviderKey === 'google') {
      try {
        const result = await unlinkGoogleAccount({
          refetchQueries: [{ query: SELF_QUERY }],
        });

        if (!result.data?.unlinkGoogleAccount) {
          toaster.error({
            description: 'Unable to unlink Google account. Please try again.',
          });
          return;
        }
      } catch {
        toaster.error({
          description: 'Unable to unlink Google account. Please try again.',
        });
        return;
      }
    }

    dispatch({ type: 'confirm_unlink_provider' });
    toaster.success({ description: 'Login method unlinked successfully.' });
  };

  return (
    <ProfileProvider value={profileStore}>
      <>
        <Sticky>
          <Highlight />
          <ClientOnlyNavbar />
        </Sticky>
        <Layout>
          <div className="mx-auto w-full max-w-screen px-4 py-8 sm:px-6 lg:px-10">
            <div className="rounded-3xl border border-cyan-100 bg-white p-6 shadow-sm hidden">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-cyan-100 bg-cyan-50">
                    {profile.avatarUrl ? (
                      <Image
                        src={profile.avatarUrl}
                        alt="Profile avatar"
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <User2 className="h-8 w-8 text-cyan-700" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">Account Profile</p>
                    <h1 className="text-2xl font-semibold text-gray-900">{fullName}</h1>
                    <p className="text-sm text-gray-500">{profile.email}</p>
                    <p className="text-sm text-gray-500">{profile.phone}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge.Root colorScheme="info">
                    <Badge.Label>Member since {profile.createdAt}</Badge.Label>
                  </Badge.Root>
                  <Badge.Root colorScheme={linkedLoginMethodsCount > 1 ? 'success' : 'warning'}>
                    <Badge.Label>
                      {linkedLoginMethodsCount} linked login method
                      {linkedLoginMethodsCount > 1 ? 's' : ''}
                    </Badge.Label>
                  </Badge.Root>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <Tabs.Root
                value={activeTab}
                onValueChange={(details: { value: string }) =>
                  dispatch({
                    type: 'set_active_tab',
                    tab: details.value as ProfileTab,
                  })
                }
                variant="enclosed"
                size="sm"
              >
                <Tabs.List className="w-full overflow-x-auto">
                  <Tabs.Indicator />
                  <Tabs.Trigger
                    value="personal"
                    className="ui-selected:bg-cyan-600  ui-selected:text-white hidden"
                  >
                    Personal Information
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="addresses"
                    className="ui-selected:bg-cyan-600 ui-selected:text-white hidden"
                  >
                    Address Book
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="security"
                    className="ui-selected:bg-cyan-600 ui-selected:rounded-md ui-selected:text-white"
                  >
                    Security & Login
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="preferences"
                    className="ui-selected:bg-cyan-600 ui-selected:text-white hidden"
                  >
                    Preferences
                  </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="personal" className="mt-6">
                  <ProfilePersonalTabContent />
                </Tabs.Content>

                <Tabs.Content value="addresses" className="mt-6">
                  <ProfileAddressesTabContent />
                </Tabs.Content>

                <Tabs.Content value="security" className="mt-6">
                  <ProfileSecurityTabContent />
                </Tabs.Content>

                <Tabs.Content value="preferences" className="mt-6">
                  <ProfilePreferencesTabContent />
                </Tabs.Content>
              </Tabs.Root>
            </div>
          </div>
          <Footer />
        </Layout>

        {dialogs.address ? <ProfileAddressDialog /> : null}
        {dialogs.changePassword ? <ProfileChangePasswordDialog /> : null}
        {dialogs.deleteAddress ? <ProfileDeleteAddressDialog /> : null}
        {dialogs.unlinkProvider ? (
          <ProfileUnlinkProviderDialog onConfirm={confirmUnlinkProvider} />
        ) : null}
      </>
    </ProfileProvider>
  );
}
