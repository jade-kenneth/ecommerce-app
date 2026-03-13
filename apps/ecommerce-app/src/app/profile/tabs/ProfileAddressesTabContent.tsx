'use client';

import { Plus } from 'lucide-react';

import { Badge, Button, toaster } from '~/components';
import { Menu } from '~/components/Primitives/Menu';
import { useProfileContext } from '../ProfileContext';
import { AddressItem } from '../useProfile';

export default function ProfileAddressesTabContent() {
  const {
    state: { addresses },
    dispatch,
  } = useProfileContext();

  const requestDeleteAddress = (address: AddressItem) => {
    if (address.lockedForActiveOrder) {
      toaster.warning({
        description:
          'This address is currently required for an active order and cannot be deleted.',
      });
      return;
    }

    dispatch({ type: 'open_delete_address_dialog', addressId: address.id });
  };

  const setDefaultAddress = (addressId: string, type: 'shipping' | 'billing') => {
    dispatch({ type: 'set_default_address', addressId, defaultType: type });

    toaster.success({
      description:
        type === 'shipping'
          ? 'Default shipping address updated.'
          : 'Default billing address updated.',
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-base font-semibold text-gray-900">Address Book</p>
          <p className="text-sm text-gray-500">
            Manage shipping and billing addresses for faster checkout.
          </p>
        </div>
        <Button
          className="w-fit rounded-[32px] bg-cyan-700 px-4 text-white"
          onClick={() => dispatch({ type: 'open_add_address_dialog' })}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Address
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {addresses.map((address) => (
          <div
            key={address.id}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-base font-semibold text-gray-900">{address.label}</p>
                <p className="text-sm text-gray-500">{address.recipient}</p>
              </div>
              <Menu.Root>
                <Menu.Trigger className="rounded-lg border border-gray-200 px-2 py-1 text-sm text-gray-700 hover:bg-gray-50">
                  Actions
                </Menu.Trigger>
                <Menu.Positioner>
                  <Menu.Content>
                    <Menu.ItemGroup>
                      <Menu.Item
                        value={`edit-${address.id}`}
                        onClick={() => dispatch({ type: 'open_edit_address_dialog', address })}
                      >
                        Edit address
                      </Menu.Item>
                      <Menu.Item
                        value={`ship-${address.id}`}
                        onClick={() => setDefaultAddress(address.id, 'shipping')}
                      >
                        Set as default shipping
                      </Menu.Item>
                      <Menu.Item
                        value={`bill-${address.id}`}
                        onClick={() => setDefaultAddress(address.id, 'billing')}
                      >
                        Set as default billing
                      </Menu.Item>
                      <Menu.Item
                        value={`delete-${address.id}`}
                        onClick={() => requestDeleteAddress(address)}
                      >
                        Delete
                      </Menu.Item>
                    </Menu.ItemGroup>
                  </Menu.Content>
                </Menu.Positioner>
              </Menu.Root>
            </div>

            <p className="mt-3 text-sm text-gray-700">{address.line1}</p>
            {address.line2 ? <p className="text-sm text-gray-700">{address.line2}</p> : null}
            <p className="text-sm text-gray-700">
              {address.city}, {address.province} {address.postalCode}
            </p>
            <p className="text-sm text-gray-700">{address.country}</p>
            <p className="mt-2 text-sm text-gray-500">{address.phone}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {address.isDefaultShipping && (
                <Badge.Root colorScheme="info">
                  <Badge.Label>Default Shipping</Badge.Label>
                </Badge.Root>
              )}
              {address.isDefaultBilling && (
                <Badge.Root colorScheme="success">
                  <Badge.Label>Default Billing</Badge.Label>
                </Badge.Root>
              )}
              {address.lockedForActiveOrder && (
                <Badge.Root colorScheme="warning">
                  <Badge.Label>Used by Active Order</Badge.Label>
                </Badge.Root>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
