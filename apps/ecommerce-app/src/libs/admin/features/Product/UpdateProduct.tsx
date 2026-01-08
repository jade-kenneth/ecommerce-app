import { CloseButton, Dialog, Portal, useDisclosure } from '@chakra-ui/react';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  capitalize,
  ComboboxField,
  Field,
  FieldInput,
  MultiComboboxField,
  NumberInputField,
  Spinner,
  UploadFile,
} from '../../../global/src';

import { Controller, useForm } from 'react-hook-form';
import { FaEdit } from 'react-icons/fa';
import { IoCheckmarkCircleOutline } from 'react-icons/io5';
import z from 'zod';
import { Checkbox } from '../../../global/src/components/ui/Checkbox';
import {
  CategoryType,
  ProductCoreDataFragment,
  StatusType,
  useUpdateProductMutation,
} from '../../../global/src/graphql/generated';
import { useProductProviderContext } from './ProductContext';
import { SchemaDefinition } from './utils';

interface AddProductButtonProps {
  onUpdateProduct?: (data: ProductCoreDataFragment) => void;
}
export const UpdateProduct = (props: AddProductButtonProps) => {
  const disclosure = useDisclosure();

  const context = useProductProviderContext();

  const form = useForm<z.infer<typeof SchemaDefinition>>({
    mode: 'all',
    defaultValues: {
      name: context.name,
      category: context.category as CategoryType[],
      price: context.price.toString(),
      points: context.points.toString(),
      stock: context.pieces,
      status: context.status,
      thumbnail: context.thumbnail,
      discountPercentage: context.discount,
      discountToggle: context.discount > 0,
    },
    resolver: zodResolver(SchemaDefinition),
  });
  const [updateProduct, { loading }] = useUpdateProductMutation();

  const price = parseFloat(form.watch('price') || '0');

  return (
    <Dialog.Root closeOnInteractOutside open={disclosure.open}>
      <div
        className="flex w-full items-center gap-2 rounded-lg cursor-pointer outline-none  transition-colors"
        onClick={() => disclosure.onOpen()}
      >
        <FaEdit />
        <p className="text-paragraph-sm"> Edit</p>
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
              <p className="text-heading-6 font-medium">Add Product</p>
            </Dialog.Header>
            <Dialog.Body className="flex flex-col gap-4">
              <Controller
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FieldInput
                    label="Name"
                    invalid={!!form.formState.errors.name}
                    {...field}
                    required
                    placeholder="Product Name"
                    className="w-full"
                  />
                )}
              />

              <Controller
                control={form.control}
                name="thumbnail"
                render={({ field }) => {
                  return (
                    <UploadFile
                      value={field.value ? [field.value] : []}
                      onChange={(files) => {
                        field.onChange(files[0]);
                      }}
                      invalid={!!form.formState.errors.thumbnail}
                    />
                  );
                }}
              />

              <Field.Root invalid={!!form.formState.errors.category}>
                <Controller
                  control={form.control}
                  name="category"
                  render={({ field }) => {
                    return (
                      <MultiComboboxField
                        options={Object.values(CategoryType).map(
                          (category) => ({
                            label: capitalize(category, {
                              delimiter: capitalize.delimiters.UNDERSCORE,
                            }),
                            value: category,
                          })
                        )}
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                        placeholder="Choose or select category"
                        label="Category"
                      />
                    );
                  }}
                />
              </Field.Root>
              <Field.Root invalid={!!form.formState.errors.price}>
                <Controller
                  control={form.control}
                  name="price"
                  render={({ field }) => {
                    return (
                      <NumberInputField
                        {...field}
                        label="Price"
                        placeholder="₱ 0.00"
                      />
                    );
                  }}
                />
              </Field.Root>
              <Checkbox.Root
                className="flex flex-col gap-2 items-start"
                checked={form.watch('discountToggle')}
                onCheckedChange={(details) => {
                  if (details.checked) {
                    form.setValue('discountToggle', true, {
                      shouldValidate: true,
                    });
                  } else {
                    form.setValue('discountToggle', false, {
                      shouldValidate: true,
                    });
                  }
                }}
              >
                <div className="flex flex-row-reverse gap-2">
                  <Checkbox.Label className="text-carbon-500 text-sm font-medium">
                    Apply Discount
                  </Checkbox.Label>
                  <Checkbox.Control>
                    <Checkbox.Indicator className="flex items-center justify-center">
                      <IoCheckmarkCircleOutline />
                    </Checkbox.Indicator>
                  </Checkbox.Control>
                </div>
                <Checkbox.HiddenInput />
              </Checkbox.Root>
              {form.getValues('discountToggle') && (
                <Controller
                  control={form.control}
                  name="discountPercentage"
                  render={({ field }) => {
                    const discountedPrice =
                      price -
                      parseFloat(
                        (price * ((field.value || 0) / 100)).toFixed(2)
                      );
                    return (
                      <div className="flex bg-carbon-950-value  gap-6 p-4 rounded-xl flex-col w-full">
                        <NumberInputField
                          value={field.value?.toString()}
                          onChange={(value) => {
                            form.setValue('discountPercentage', +value, {
                              shouldValidate: true,
                            });
                          }}
                          label="Discount (%)"
                          placeholder="%"
                        />
                        <FieldInput
                          label="Final Price"
                          disabled
                          value={`₱ ${
                            isNaN(discountedPrice) ? '0.00' : discountedPrice
                          }`}
                          className="w-full text-carbon-300-value "
                        />
                      </div>
                    );
                  }}
                />
              )}
              <Field.Root invalid={!!form.formState.errors.points}>
                <Controller
                  control={form.control}
                  name="points"
                  render={({ field }) => {
                    return (
                      <NumberInputField
                        {...field}
                        label="Points"
                        placeholder="0"
                      />
                    );
                  }}
                />
              </Field.Root>
              <Field.Root invalid={!!form.formState.errors.stock}>
                <Controller
                  control={form.control}
                  name="stock"
                  render={({ field }) => {
                    return (
                      <NumberInputField
                        value={field.value?.toString()}
                        onChange={(value) => {
                          field.onChange(+value);
                        }}
                        label="Stock"
                        placeholder="0"
                      />
                    );
                  }}
                />
              </Field.Root>
              <Field.Root invalid={!!form.formState.errors.status}>
                <Controller
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <ComboboxField
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      options={Object.values(StatusType).map((status) => ({
                        label: capitalize(status, {
                          delimiter: capitalize.delimiters.UNDERSCORE,
                        }),
                        value: status,
                      }))}
                      placeholder="Select Status"
                      label="Status"
                    />
                  )}
                />
              </Field.Root>
            </Dialog.Body>
            <Dialog.Footer className="flex justify-end">
              <div className="flex gap-2 items-center">
                <button
                  className="bg-primary-700-value p-3 ui-disabled:opacity-10 ui-disabled:cursor-not-allowed text-white rounded-[32px] flex gap-2 items-center text-carbon-500 text-sm font-medium "
                  onClick={form.handleSubmit(async (data) => {
                    try {
                      await updateProduct({
                        variables: {
                          input: {
                            _id: context._id,
                            name: data.name,
                            category: data.category,
                            price: parseFloat(data.price),
                            thumbnail: data.thumbnail,
                            points: data.points,
                            pieces: data.stock,
                            discount: data.discountPercentage || 0,
                            status: data.status,
                            dateAdded: new Date().toISOString(),
                          },
                        },
                      });

                      props.onUpdateProduct?.({
                        ...data,
                        price: +data.price,
                        pieces: data.stock,
                        discount: data.discountPercentage || 0,
                        _id: context._id,
                        __typename: 'Product',
                      });
                      disclosure.onClose();
                    } catch (error) {
                      console.error('Error updating product:', error);
                    }
                  })}
                  data-disabled={
                    !form.formState.isValid || form.formState.isSubmitting
                      ? ''
                      : undefined
                  }
                >
                  <p>Update Product</p>{' '}
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
