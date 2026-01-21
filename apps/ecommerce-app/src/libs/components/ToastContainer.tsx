'use client';

import { createToaster, Toaster } from '@ark-ui/react';
import { PiXCircleBold } from 'react-icons/pi';
import { Toast } from './Toast';
export const toaster = createToaster({
  placement: 'top',
  duration: 5000,
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
            <PiXCircleBold />
          </Toast.CloseTrigger>
        </Toast.Root>
      )}
    </Toaster>
  );
}
