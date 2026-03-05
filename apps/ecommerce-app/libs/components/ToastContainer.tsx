'use client';

import { createToaster, Toaster } from '@ark-ui/react';
import { XCircle } from 'lucide-react';
import { Toast } from './Primitives/Toast';
export const toaster = createToaster({
  placement: 'top',
  duration: 2000,
  overlap: true,
  max: 5,
});
export function ToastContainer() {
  return (
    <Toaster toaster={toaster}>
      {(toast) => (
        <Toast.Root key={toast.id}>
          <Toast.Icon />
          <Toast.Title>
            {toast.title
              ? toast.title
              : toast.type === 'error'
                ? 'Error'
                : toast.type === 'warning'
                  ? 'Warning'
                  : 'Success'}
          </Toast.Title>
          <Toast.Description>
            {toast.description ?? toast.title}
          </Toast.Description>
          <Toast.CloseTrigger>
            <XCircle className="w-4 h-4" />
          </Toast.CloseTrigger>
        </Toast.Root>
      )}
    </Toaster>
  );
}
