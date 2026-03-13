'use client';

import { Portal } from '@ark-ui/react';
import { CircleAlert, Trash2 } from 'lucide-react';

import { Button, toaster } from '~/components';
import { AlertDialog } from '~/components/Primitives/AlertDialog';
import { useProfileContext } from '../ProfileContext';

export default function ProfileDeleteAddressDialog() {
  const {
    state: { deleteAddressId, dialogs },
    dispatch,
  } = useProfileContext();

  const confirmDeleteAddress = () => {
    if (!deleteAddressId) return;

    dispatch({ type: 'confirm_delete_address' });
    toaster.success({ description: 'Address removed from your profile.' });
  };

  return (
    <AlertDialog.Root
      open={dialogs.deleteAddress}
      onOpenChange={(details) =>
        dispatch({
          type: 'set_delete_address_dialog_open',
          open: details.open,
        })
      }
    >
      <AlertDialog.Backdrop />
      <Portal>
        <AlertDialog.Positioner>
          <AlertDialog.Content className="w-[92vw] max-w-md rounded-2xl bg-white p-0">
            <AlertDialog.Header className="border-b border-error-100 bg-error-50 px-5 py-4">
              <AlertDialog.Title className="text-base font-semibold text-error-800">
                Delete Address?
              </AlertDialog.Title>
              <AlertDialog.Description className="mt-1 text-sm text-error-700">
                This action cannot be undone.
              </AlertDialog.Description>
            </AlertDialog.Header>
            <AlertDialog.Body className="px-5 py-4">
              <div className="flex items-start gap-3 rounded-xl border border-error-100 bg-error-50/70 p-3">
                <CircleAlert className="mt-0.5 h-5 w-5 text-error-600" />
                <p className="text-sm text-error-700">
                  Confirm deletion only if this address is no longer used.
                </p>
              </div>
            </AlertDialog.Body>
            <AlertDialog.Footer className="flex justify-end gap-2 border-t border-gray-100 px-5 py-4">
              <Button
                className="rounded-[32px] border border-gray-200 bg-white px-4 text-gray-700"
                onClick={() =>
                  dispatch({
                    type: 'set_delete_address_dialog_open',
                    open: false,
                  })
                }
              >
                Keep Address
              </Button>
              <Button
                className="rounded-[32px] bg-error-600 px-4 text-white"
                onClick={confirmDeleteAddress}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog.Positioner>
      </Portal>
    </AlertDialog.Root>
  );
}
