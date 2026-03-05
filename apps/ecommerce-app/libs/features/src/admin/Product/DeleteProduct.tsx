import { useMutation } from '@apollo/client/react';
import { Portal } from '@ark-ui/react';
import { Menu } from '~/components';
import { Spinner } from '~/components/Spinner';
import { Trash, XIcon } from 'lucide-react';
import { Dialog } from '~/components/Primitives/Dialog';
import { DELETE_PRODUCT_MUTATION } from '~/graphql/Product';
import { useDisclosure } from '~/utils/useDisclosure';
import { useProductProviderContext } from './ProductContext';

export const DeleteProduct = () => {
  const disclosure = useDisclosure();
  const context = useProductProviderContext();
  const [deleteProduct, { loading }] = useMutation(DELETE_PRODUCT_MUTATION, {
    optimisticResponse: {
      deleteProduct: true,
    },
    update(cache) {
      cache.evict({
        id: cache.identify(context),
      });
    },
  });

  return (
    <>
      <Menu.Item value="delete" onSelect={() => disclosure.setOpen(true)}>
        <Trash className="w-4 h-4" />
        <p className="text-paragraph-sm"> Delete</p>
      </Menu.Item>
      <Dialog.Root
        closeOnInteractOutside
        open={disclosure.open}
        onOpenChange={(details) => disclosure.setOpen(details.open)}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content className="w-[92vw] max-w-xl p-0 overflow-hidden">
              <div className="flex items-start justify-between border-b border-cyan-100 bg-cyan-50 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <Trash className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-xl font-semibold text-gray-900">
                      Delete Product
                    </p>
                    <p className="text-sm text-gray-500">
                      This action is permanent and cannot be undone.
                    </p>
                  </div>
                </div>
                <Dialog.CloseTrigger>
                  <XIcon
                    size={18}
                    color="gray"
                    onClick={() => disclosure.setOpen(false)}
                  />
                </Dialog.CloseTrigger>
              </div>

              <Dialog.Body className="flex flex-col gap-4 px-6 py-6">
                <div className="rounded-2xl border border-red-100 bg-red-50/40 p-4 text-sm text-gray-600">
                  You are about to delete{' '}
                  <span className="font-semibold text-gray-900">
                    {context.name}
                  </span>
                  . This will remove it from your catalog immediately.
                </div>
              </Dialog.Body>
              <Dialog.Footer className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
                <button
                  className="rounded-[32px] border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                  type="button"
                  onClick={() => disclosure.setOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-error-600 px-5 py-2 ui-disabled:opacity-10 ui-disabled:cursor-not-allowed text-white rounded-[32px] flex gap-2 items-center text-sm font-medium hover:bg-red-500"
                  onClick={async () => {
                    await deleteProduct({
                      variables: {
                        input: {
                          _id: context._id,
                        },
                      },
                    });
                    disclosure.setOpen(false);
                  }}
                  data-disabled={loading ? '' : undefined}
                >
                  <p>Delete Product</p>{' '}
                  {loading && <Spinner className="w-2 h-2" />}
                </button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};
