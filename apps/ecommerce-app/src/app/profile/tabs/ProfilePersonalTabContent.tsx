'use client';

import { useMemo } from 'react';

import { Button, toaster } from '~/components';
import { Field } from '~/components/Primitives/Field';
import { useProfileContext } from '../ProfileContext';

export default function ProfilePersonalTabContent() {
  const {
    state: { loginMethods, personalForm },
    dispatch,
  } = useProfileContext();

  const canEditEmail = useMemo(
    () => !loginMethods.some((method) => method.key !== 'password' && method.linked),
    [loginMethods],
  );

  const handleSavePersonalInfo = () => {
    if (!personalForm.firstName.trim() || !personalForm.lastName.trim()) {
      toaster.error({ description: 'First and last name are required.' });
      return;
    }

    if (!personalForm.phone.trim()) {
      toaster.error({ description: 'Mobile number is required.' });
      return;
    }

    dispatch({ type: 'save_personal_form' });
    toaster.success({ description: 'Personal information updated.' });
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_1fr] hidden">
      <section className="rounded-2xl border border-gray-100 bg-white p-5">
        <div className="mb-4">
          <p className="text-base font-semibold text-gray-900">Personal Details</p>
          <p className="text-sm text-gray-500">
            Keep your account information accurate and up to date.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field.Root>
            <Field.Label>First name</Field.Label>
            <Field.Input
              value={personalForm.firstName}
              onChange={(event) =>
                dispatch({
                  type: 'patch_personal_form',
                  patch: { firstName: event.target.value },
                })
              }
            />
          </Field.Root>
          <Field.Root>
            <Field.Label>Last name</Field.Label>
            <Field.Input
              value={personalForm.lastName}
              onChange={(event) =>
                dispatch({
                  type: 'patch_personal_form',
                  patch: { lastName: event.target.value },
                })
              }
            />
          </Field.Root>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4">
          <Field.Root>
            <Field.Label>Mobile number</Field.Label>
            <Field.Input
              value={personalForm.phone}
              onChange={(event) =>
                dispatch({
                  type: 'patch_personal_form',
                  patch: { phone: event.target.value },
                })
              }
            />
          </Field.Root>

          <Field.Root disabled={!canEditEmail}>
            <Field.Label>Email address</Field.Label>
            <Field.Input
              value={personalForm.email}
              onChange={(event) =>
                dispatch({
                  type: 'patch_personal_form',
                  patch: { email: event.target.value },
                })
              }
              disabled={!canEditEmail}
            />
            {!canEditEmail && (
              <Field.HelperText>
                Email updates are restricted while SSO login methods are linked.
              </Field.HelperText>
            )}
          </Field.Root>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            className="rounded-[32px] bg-cyan-700 px-5 text-white"
            onClick={handleSavePersonalInfo}
          >
            Save Changes
          </Button>
          <Button
            className="rounded-[32px] border border-gray-200 bg-white px-5 text-gray-700"
            onClick={() => dispatch({ type: 'reset_personal_form' })}
          >
            Cancel
          </Button>
        </div>
      </section>

      {/* <section className="rounded-2xl border border-gray-100 bg-white p-5">
        <p className="text-base font-semibold text-gray-900">Profile Photo</p>
        <p className="mt-1 text-sm text-gray-500">
          Upload a clear profile photo for easier account recognition.
        </p>

        <div className="mt-5 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-cyan-200 bg-cyan-50/60 p-6">
          <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow">
            {personalForm.avatarUrl ? (
              <Image
                src={personalForm.avatarUrl}
                alt="Avatar preview"
                fill
                className="object-cover"
                sizes="112px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-cyan-100">
                <User2 className="h-10 w-10 text-cyan-700" />
              </div>
            )}
          </div>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onAvatarChange}
          />
          <Button
            className="rounded-[32px] bg-cyan-700 px-4 text-white"
            onClick={() => avatarInputRef.current?.click()}
          >
            Upload New Photo
          </Button>
        </div>
      </section> */}
    </div>
  );
}
