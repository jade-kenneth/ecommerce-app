'use client';
import { useMutation } from '@apollo/client/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog } from '~/components/Primitives/Dialog';

import { Portal } from '@ark-ui/react';
import { Menu } from '~/components';
import {
  ComboboxField,
  MultiComboboxField,
} from '~/components/ComoboxField';
import { UploadFile } from '~/components/FileUpload';
import { Spinner } from '~/components/Spinner';
import { CheckCircle2, Pencil, XIcon } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import { Checkbox } from '~/components/Primitives/Checkbox';
import { Field } from '~/components/Primitives/Field';
import { FieldInput } from '~/components/forms/FieldInput';
import { NumberInputField } from '~/components/forms/NumberInputField';
import { UPDATE_PRODUCT_MUTATION } from '~/graphql/Product';
import {
  CategoryType,
  ProductCoreDataFragment,
  StatusType,
} from '~/graphql/generated';
import { capitalize } from '~/utils/capitalize';
import { useDisclosure } from '~/utils/useDisclosure';
import { useProductProviderContext } from './ProductContext';
import { SchemaDefinition } from './utils';

interface AddProductButtonProps {
  onUpdateProduct?: (data: ProductCoreDataFragment) => void;
}
export const UpdateProduct = (props: AddProductButtonProps) => {
  const disclosure = useDisclosure();

  const context = useProductProviderContext();

  const getDefaultValues = () => ({
    name: context.name,
    category: context.category as CategoryType[],
    price: context.price.toString(),
    points: context.points.toString(),
    stock: context.pieces,
    status: context.status,
    thumbnail: context.thumbnail,
    discountPercentage: context.discount,
    discountToggle: (context.discount ?? 0) > 0,
  });

  const form = useForm<z.infer<typeof SchemaDefinition>>({
    mode: 'all',
    defaultValues: getDefaultValues(),
    resolver: zodResolver(SchemaDefinition),
  });

  useEffect(() => {
    form.reset(getDefaultValues());
  }, [context._id]);

  const [updateProduct, { loading }] = useMutation(UPDATE_PRODUCT_MUTATION);

  const price = parseFloat(form.watch('price') || '0');

  return (
    <>
      <Menu.Item value="update" onSelect={() => disclosure.setOpen(true)}>
        <Pencil className="w-4 h-4" />
        <p className="text-paragraph-sm"> Edit</p>
      </Menu.Item>
      <Dialog.Root
        open={disclosure.open}
        onOpenChange={(details) => disclosure.setOpen(details.open)}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content className="w-[92vw] max-w-4xl p-0 overflow-hidden">
              <div className="flex items-start justify-between border-b border-cyan-100 bg-cyan-50 px-6 py-5">
                <div className="flex flex-col gap-1">
                  <p className="text-xl font-semibold text-gray-900">
                    Update Product
                  </p>
                  <p className="text-sm text-gray-500">
                    Review details, pricing, and inventory updates.
                  </p>
                </div>
                <Dialog.CloseTrigger>
                  <XIcon
                    size={18}
                    color="gray"
                    onClick={() => disclosure.setOpen(false)}
                  />
                </Dialog.CloseTrigger>
              </div>

              <Dialog.Body className="flex flex-col gap-6 px-6 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Product Details
                      </p>
                      <p className="text-xs text-gray-500">
                        Name, category, and publishing status.
                      </p>
                    </div>
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

                    <Field.Root invalid={!!form.formState.errors.category}>
                      <Controller
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <MultiComboboxField
                            options={Object.values(CategoryType).map(
                              (category) => ({
                                label: capitalize(category, {
                                  delimiter: capitalize.delimiters.UNDERSCORE,
                                }),
                                value: category,
                              }),
                            )}
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value);
                            }}
                            placeholder="Choose or select category"
                            label="Category"
                          />
                        )}
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
                            options={Object.values(StatusType).map(
                              (status) => ({
                                label: capitalize(status, {
                                  delimiter: capitalize.delimiters.UNDERSCORE,
                                }),
                                value: status,
                              }),
                            )}
                            placeholder="Select Status"
                            label="Status"
                          />
                        )}
                      />
                    </Field.Root>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Media
                      </p>
                      <p className="text-xs text-gray-500">
                        Update the product thumbnail if needed.
                      </p>
                    </div>
                    <Controller
                      control={form.control}
                      name="thumbnail"
                      render={({ field }) => (
                        <UploadFile
                          value={field.value ? [field.value] : []}
                          onChange={(files) => {
                            field.onChange(files[0]);
                          }}
                          invalid={!!form.formState.errors.thumbnail}
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Pricing
                      </p>
                      <p className="text-xs text-gray-500">
                        Update base price and discount.
                      </p>
                    </div>
                    <Field.Root invalid={!!form.formState.errors.price}>
                      <Controller
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <NumberInputField
                            {...field}
                            label="Price"
                            placeholder="₱ 0.00"
                          />
                        )}
                      />
                    </Field.Root>
                    <Checkbox.Root
                      className="flex items-center justify-between rounded-xl border border-gray-200 p-3"
                      checked={form.watch('discountToggle')}
                      onCheckedChange={(details) => {
                        form.setValue('discountToggle', !details.checked, {
                          shouldValidate: true,
                        });
                      }}
                    >
                      <div>
                        <Checkbox.Label className="text-sm font-medium text-gray-700">
                          Apply Discount
                        </Checkbox.Label>
                        <p className="text-xs text-gray-500">
                          Offer a percentage discount for promotions.
                        </p>
                      </div>
                      <Checkbox.Control>
                        <Checkbox.Indicator className="flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4" />
                        </Checkbox.Indicator>
                      </Checkbox.Control>
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
                              (price * ((field.value || 0) / 100)).toFixed(2),
                            );
                          return (
                            <div className="flex gap-4 rounded-xl border border-cyan-100 bg-cyan-50 p-4 flex-col w-full">
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
                                  isNaN(discountedPrice)
                                    ? '0.00'
                                    : discountedPrice
                                }`}
                                className="w-full text-carbon-300 "
                              />
                            </div>
                          );
                        }}
                      />
                    )}
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Inventory & Rewards
                      </p>
                      <p className="text-xs text-gray-500">
                        Adjust stock levels and points.
                      </p>
                    </div>
                    <Field.Root invalid={!!form.formState.errors.points}>
                      <Controller
                        control={form.control}
                        name="points"
                        render={({ field }) => (
                          <NumberInputField
                            {...field}
                            label="Points"
                            placeholder="0"
                          />
                        )}
                      />
                    </Field.Root>
                    <Field.Root invalid={!!form.formState.errors.stock}>
                      <Controller
                        control={form.control}
                        name="stock"
                        render={({ field }) => (
                          <NumberInputField
                            value={field.value?.toString()}
                            onChange={(value) => {
                              field.onChange(+value);
                            }}
                            label="Stock"
                            placeholder="0"
                          />
                        )}
                      />
                    </Field.Root>
                  </div>
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
                  className="bg-cyan-700 px-5 py-2 ui-disabled:opacity-10 ui-disabled:cursor-not-allowed text-white rounded-[32px] flex gap-2 items-center text-sm font-medium"
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
                        avgRating: context.avgRating ?? 0,
                        _id: context._id,
                        __typename: 'Product',
                      });
                      disclosure.setOpen(false);
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
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};
