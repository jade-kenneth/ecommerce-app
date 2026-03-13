'use client';

import { Button, toaster } from '~/components';
import { Dialog } from '~/components/Dialog';
import { Field } from '~/components/Primitives/Field';
import { useProfileContext } from '../ProfileContext';
import { AddressFormState } from '../useProfile';

export default function ProfileAddressDialog() {
  const {
    state: { addressForm, dialogs, editingAddressId },
    dispatch,
  } = useProfileContext();

  const handleAddressSave = () => {
    const requiredFields: Array<keyof AddressFormState> = [
      'label',
      'recipient',
      'phone',
      'line1',
      'city',
      'province',
      'postalCode',
      'country',
    ];

    const hasMissingField = requiredFields.some((field) => !addressForm[field].trim());

    if (hasMissingField) {
      toaster.error({
        description: 'Please complete all required address fields.',
      });
      return;
    }

    dispatch({ type: 'save_address', newId: `address-${Date.now()}` });
    toaster.success({
      description: editingAddressId
        ? 'Address updated successfully.'
        : 'Address added successfully.',
    });
  };

  return (
    <Dialog.Root
      open={dialogs.address}
      onOpenChange={(details) => dispatch({ type: 'set_address_dialog_open', open: details.open })}
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content className="w-[92vw] max-w-2xl bg-white p-0">
          <div className="border-b border-cyan-100 bg-cyan-50 px-6 py-4">
            <p className="text-lg font-semibold text-cyan-900">
              {editingAddressId ? 'Edit Address' : 'Add New Address'}
            </p>
            <p className="text-sm text-cyan-700">
              Save delivery and billing details for faster checkout.
            </p>
          </div>

          <Dialog.Body className="grid grid-cols-1 gap-4 px-6 py-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field.Root>
                <Field.Label>Label</Field.Label>
                <Field.Input
                  value={addressForm.label}
                  placeholder="Home, Office, etc."
                  onChange={(event) =>
                    dispatch({
                      type: 'patch_address_form',
                      patch: { label: event.target.value },
                    })
                  }
                />
              </Field.Root>
              <Field.Root>
                <Field.Label>Recipient</Field.Label>
                <Field.Input
                  value={addressForm.recipient}
                  onChange={(event) =>
                    dispatch({
                      type: 'patch_address_form',
                      patch: { recipient: event.target.value },
                    })
                  }
                />
              </Field.Root>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field.Root>
                <Field.Label>Phone</Field.Label>
                <Field.Input
                  value={addressForm.phone}
                  onChange={(event) =>
                    dispatch({
                      type: 'patch_address_form',
                      patch: { phone: event.target.value },
                    })
                  }
                />
              </Field.Root>
              <Field.Root>
                <Field.Label>Country</Field.Label>
                <Field.Input
                  value={addressForm.country}
                  onChange={(event) =>
                    dispatch({
                      type: 'patch_address_form',
                      patch: { country: event.target.value },
                    })
                  }
                />
              </Field.Root>
            </div>

            <Field.Root>
              <Field.Label>Address line 1</Field.Label>
              <Field.Input
                value={addressForm.line1}
                onChange={(event) =>
                  dispatch({
                    type: 'patch_address_form',
                    patch: { line1: event.target.value },
                  })
                }
              />
            </Field.Root>

            <Field.Root>
              <Field.Label>Address line 2 (optional)</Field.Label>
              <Field.Input
                value={addressForm.line2}
                onChange={(event) =>
                  dispatch({
                    type: 'patch_address_form',
                    patch: { line2: event.target.value },
                  })
                }
              />
            </Field.Root>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field.Root>
                <Field.Label>City</Field.Label>
                <Field.Input
                  value={addressForm.city}
                  onChange={(event) =>
                    dispatch({
                      type: 'patch_address_form',
                      patch: { city: event.target.value },
                    })
                  }
                />
              </Field.Root>
              <Field.Root>
                <Field.Label>Province</Field.Label>
                <Field.Input
                  value={addressForm.province}
                  onChange={(event) =>
                    dispatch({
                      type: 'patch_address_form',
                      patch: { province: event.target.value },
                    })
                  }
                />
              </Field.Root>
              <Field.Root>
                <Field.Label>Postal code</Field.Label>
                <Field.Input
                  value={addressForm.postalCode}
                  onChange={(event) =>
                    dispatch({
                      type: 'patch_address_form',
                      patch: { postalCode: event.target.value },
                    })
                  }
                />
              </Field.Root>
            </div>
          </Dialog.Body>

          <Dialog.Footer className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
            <Button
              className="rounded-[32px] border border-gray-200 bg-white px-4 text-gray-700"
              onClick={() => dispatch({ type: 'set_address_dialog_open', open: false })}
            >
              Cancel
            </Button>
            <Button
              className="rounded-[32px] bg-cyan-700 px-4 text-white"
              onClick={handleAddressSave}
            >
              {editingAddressId ? 'Save Address' : 'Add Address'}
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
