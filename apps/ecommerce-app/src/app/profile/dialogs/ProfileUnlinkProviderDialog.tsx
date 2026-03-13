'use client';

import { Portal } from '@ark-ui/react';
import { ShieldCheck } from 'lucide-react';

import { Button } from '~/components';
import { AlertDialog } from '~/components/Primitives/AlertDialog';
import { useProfileContext } from '../ProfileContext';

interface ProfileUnlinkProviderDialogProps {
  onConfirm: () => Promise<void>;
}

export default function ProfileUnlinkProviderDialog({
  onConfirm,
}: ProfileUnlinkProviderDialogProps) {
  const {
    state: { dialogs },
    dispatch,
  } = useProfileContext();

  return (
    <AlertDialog.Root
      open={dialogs.unlinkProvider}
      onOpenChange={(details) =>
        dispatch({
          type: 'set_unlink_provider_dialog_open',
          open: details.open,
        })
      }
    >
      <AlertDialog.Backdrop />
      <Portal>
        <AlertDialog.Positioner>
          <AlertDialog.Content className="w-[92vw] max-w-md rounded-2xl bg-white p-0">
            <AlertDialog.Header className="border-b border-warning-100 bg-warning-50 px-5 py-4">
              <AlertDialog.Title className="text-base font-semibold text-warning-800">
                Unlink Login Method?
              </AlertDialog.Title>
              <AlertDialog.Description className="mt-1 text-sm text-warning-700">
                Make sure another login method remains linked.
              </AlertDialog.Description>
            </AlertDialog.Header>
            <AlertDialog.Body className="px-5 py-4">
              <div className="flex items-start gap-3 rounded-xl border border-warning-100 bg-warning-50/70 p-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-warning-700" />
                <p className="text-sm text-warning-700">
                  Unlinking this provider removes one way to access your account.
                </p>
              </div>
            </AlertDialog.Body>
            <AlertDialog.Footer className="flex justify-end gap-2 border-t border-gray-100 px-5 py-4">
              <Button
                className="rounded-[32px] border border-gray-200 bg-white px-4 text-gray-700"
                onClick={() =>
                  dispatch({
                    type: 'set_unlink_provider_dialog_open',
                    open: false,
                  })
                }
              >
                Cancel
              </Button>
              <Button className="rounded-[32px] bg-warning-600 px-4 text-white" onClick={onConfirm}>
                Unlink
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog.Positioner>
      </Portal>
    </AlertDialog.Root>
  );
}
