'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ObjectId } from 'bson';

import { CheckCircle2, PlusCircle, XIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import {
  CategoryType,
  ProductCoreDataFragment,
  StatusType,
  useCreateProductMutation,
} from '~/graphql/generated';
import { capitalize } from '~/utils/capitalize';
import { useDisclosure } from '~/utils/useDisclosure';
import {
  ComboboxField,
  MultiComboboxField,
} from '../../../../../ui/components/ComoboxField';
import { Dialog } from '../../../../../ui/components/Dialog';
import { FieldInput } from '../../../../../ui/components/FieldInput';
import { UploadFile } from '../../../../../ui/components/FileUpload';
import { NumberInputField } from '../../../../../ui/components/NumberInputField';
import { Spinner } from '../../../../../ui/components/Spinner';
import { Checkbox } from '../../../../../ui/components/ui/Checkbox';
import { Field } from '../../../../../ui/components/ui/Field';
import { SchemaDefinition } from './utils';

interface AddProductButtonProps {
  onAddProduct?: (data: ProductCoreDataFragment) => void | Promise<void>;
}
export const CreateProduct = (props: AddProductButtonProps) => {
  const disclosure = useDisclosure();

  const form = useForm<z.infer<typeof SchemaDefinition>>({
    mode: 'all',
    defaultValues: {
      name: '',
      category: [],
      price: '',
      points: '',
      stock: 0,
      status: StatusType.Active,
      thumbnail: '',
      discountToggle: false,
    },
    resolver: zodResolver(SchemaDefinition),
  });
  const [createProduct, { loading }] = useCreateProductMutation();

  const price = parseFloat(form.watch('price') || '0');

  return (
    <Dialog.Root closeOnInteractOutside open={disclosure.open}>
      <div className="flex justify-between w-full">
        <div className="flex flex-col gap-1">
          <p className="text-heading-5 font-medium text-gray-900">
            Manage Products
          </p>
          <p className="text-sm text-gray-500">
            Create, price, and publish products in your catalog.
          </p>
        </div>
        <Dialog.Trigger
          className="flex items-center gap-2 rounded-[32px] bg-cyan-700 px-4 h-9 text-white hover:bg-cyan-600 transition-colors w-fit"
          onClick={() => disclosure.onOpen()}
        >
          <PlusCircle className="w-4 h-4" />
          <p className="text-paragraph-sm"> Add Product</p>
        </Dialog.Trigger>
      </div>

      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content className="w-[92vw] max-w-4xl p-0 overflow-hidden">
          <div className="flex items-start justify-between border-b border-cyan-100 bg-cyan-50 px-6 py-5">
            <div className="flex flex-col gap-1">
              <p className="text-xl font-semibold text-gray-900">Add Product</p>
              <p className="text-sm text-gray-500">
                Fill in details, pricing, and inventory before publishing.
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
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Media</p>
                  <p className="text-xs text-gray-500">
                    Upload a clear product thumbnail.
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
                  <p className="text-sm font-semibold text-gray-900">Pricing</p>
                  <p className="text-xs text-gray-500">
                    Base price and optional discount.
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
                  onCheckedChange={() => {
                    form.setValue(
                      'discountToggle',
                      !form.getValues('discountToggle'),
                      {
                        shouldValidate: true,
                      },
                    );
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
                              isNaN(discountedPrice) ? '0.00' : discountedPrice
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
                    Set available stock and points.
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
              onClick={() => disclosure.onClose()}
            >
              Cancel
            </button>
            <button
              className="bg-cyan-700 px-5 py-2 ui-disabled:opacity-10 ui-disabled:cursor-not-allowed text-white rounded-[32px] flex gap-2 items-center text-sm font-medium"
              onClick={form.handleSubmit(async (data) => {
                const _id = new ObjectId().toHexString();
                try {
                  const result = await createProduct({
                    variables: {
                      input: {
                        _id,
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

                  if (!result.data?.createProduct) {
                    throw new Error('Create product mutation did not succeed');
                  }

                  await props.onAddProduct?.({
                    __typename: 'Product',
                    _id,
                    name: data.name,
                    category: data.category,
                    price: +data.price,
                    thumbnail: data.thumbnail,
                    points: data.points,
                    pieces: data.stock,
                    discount: data.discountPercentage || 0,
                    status: data.status,
                  });
                  disclosure.onClose();
                  form.reset();
                } catch (error) {
                  console.error('Error creating product:', error);
                }
              })}
              data-disabled={
                !form.formState.isValid || form.formState.isSubmitting
                  ? ''
                  : undefined
              }
            >
              <p>Add Product</p> {loading && <Spinner className="w-2 h-2" />}
            </button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
