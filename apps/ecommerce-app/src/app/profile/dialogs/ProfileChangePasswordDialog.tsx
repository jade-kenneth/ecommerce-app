'use client';

import { Button, toaster } from '~/components';
import { Dialog } from '~/components/Dialog';
import { Field } from '~/components/Primitives/Field';
import { useProfileContext } from '../ProfileContext';

export default function ProfileChangePasswordDialog() {
  const {
    state: { dialogs, passwordForm },
    dispatch,
  } = useProfileContext();

  const handleChangePassword = () => {
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      toaster.error({ description: 'All password fields are required.' });
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toaster.error({
        description: 'New password must be at least 8 characters.',
      });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toaster.error({ description: 'Password confirmation does not match.' });
      return;
    }

    dispatch({ type: 'set_change_password_dialog_open', open: false });
    toaster.success({ description: 'Password updated.' });
  };

  return (
    <Dialog.Root
      open={dialogs.changePassword}
      onOpenChange={(details) =>
        dispatch({
          type: 'set_change_password_dialog_open',
          open: details.open,
        })
      }
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content className="w-[92vw] max-w-lg bg-white p-0">
          <div className="border-b border-cyan-100 bg-cyan-50 px-6 py-4">
            <p className="text-lg font-semibold text-cyan-900">Change Password</p>
            <p className="text-sm text-cyan-700">
              Use a strong password with at least 8 characters.
            </p>
          </div>

          <Dialog.Body className="grid grid-cols-1 gap-4 px-6 py-5">
            <Field.Root>
              <Field.Label>Current password</Field.Label>
              <Field.Input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(event) =>
                  dispatch({
                    type: 'patch_password_form',
                    patch: { currentPassword: event.target.value },
                  })
                }
              />
            </Field.Root>
            <Field.Root>
              <Field.Label>New password</Field.Label>
              <Field.Input
                type="password"
                value={passwordForm.newPassword}
                onChange={(event) =>
                  dispatch({
                    type: 'patch_password_form',
                    patch: { newPassword: event.target.value },
                  })
                }
              />
            </Field.Root>
            <Field.Root>
              <Field.Label>Confirm new password</Field.Label>
              <Field.Input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(event) =>
                  dispatch({
                    type: 'patch_password_form',
                    patch: { confirmPassword: event.target.value },
                  })
                }
              />
            </Field.Root>
          </Dialog.Body>

          <Dialog.Footer className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
            <Button
              className="rounded-[32px] border border-gray-200 bg-white px-4 text-gray-700"
              onClick={() =>
                dispatch({
                  type: 'set_change_password_dialog_open',
                  open: false,
                })
              }
            >
              Cancel
            </Button>
            <Button
              className="rounded-[32px] bg-cyan-700 px-4 text-white"
              onClick={handleChangePassword}
            >
              Update Password
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
