import { CloseButton, Dialog, Portal, useDisclosure } from '@chakra-ui/react';
import { Spinner } from '@global';
import {
  ProductCoreDataFragment,
  useDeleteProductMutation,
} from '@graphql/products';
import { FaTrash } from 'react-icons/fa';

interface AddProductButtonProps {
  data: ProductCoreDataFragment;
  onUpdateProduct?: (data: ProductCoreDataFragment) => void;
}
export const DeleteProduct = (props: AddProductButtonProps) => {
  const disclosure = useDisclosure();

  const [deleteProduct, { loading }] = useDeleteProductMutation({
    optimisticResponse: {
      __typename: 'Mutation',
      deleteProduct: true,
    },
    update(cache) {
      cache.evict({
        id: cache.identify(props.data),
      });
    },
  });

  return (
    <Dialog.Root closeOnInteractOutside open={disclosure.open}>
      <div
        className="flex w-full items-center gap-2 rounded-lg cursor-pointer outline-none  transition-colors"
        onClick={() => disclosure.onOpen()}
      >
        <FaTrash />
        <p className="text-paragraph-sm"> Delete</p>
      </div>

      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.CloseTrigger>
              <CloseButton
                size={'sm'}
                color={'gray'}
                border={'none'}
                boxShadow={'none'}
                onClick={() => disclosure.setOpen(false)}
              />
            </Dialog.CloseTrigger>

            <Dialog.Header>
              <p className="text-heading-6 font-medium">Delete Product</p>
            </Dialog.Header>
            <Dialog.Body className="flex flex-col gap-4">
              <p className="text-paragraph-sm">
                Are you sure you want to delete this product? This action cannot
                be undone.
              </p>
            </Dialog.Body>
            <Dialog.Footer className="flex justify-end">
              <div className="flex gap-2 items-center">
                <button
                  className="bg-primary-700-value p-3 ui-disabled:opacity-10 ui-disabled:cursor-not-allowed text-white rounded-[32px] flex gap-2 items-center text-carbon-500 text-sm font-medium "
                  onClick={async () => {
                    await deleteProduct({
                      variables: {
                        input: {
                          _id: props.data._id,
                        },
                      },
                    });
                  }}
                >
                  <p>Delete Product</p>{' '}
                  {loading && <Spinner className="w-2 h-2" />}
                </button>
              </div>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
