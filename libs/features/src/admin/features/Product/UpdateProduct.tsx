'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog } from '../../../../../ui/components/Dialog';

import { Portal } from '@ark-ui/react';
import { CheckCircle2, Pencil, XIcon } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import { Menu } from '~/components';
import {
  CategoryType,
  ProductCoreDataFragment,
  StatusType,
  useUpdateProductMutation,
} from '~/graphql/generated';
import { capitalize } from '~/utils/capitalize';
import { useDisclosure } from '~/utils/useDisclosure';
import {
  ComboboxField,
  MultiComboboxField,
} from '../../../../../ui/components/ComoboxField';
import { FieldInput } from '../../../../../ui/components/FieldInput';
import { UploadFile } from '../../../../../ui/components/FileUpload';
import { NumberInputField } from '../../../../../ui/components/NumberInputField';
import { Spinner } from '../../../../../ui/components/Spinner';
import { Checkbox } from '../../../../../ui/components/ui/Checkbox';
import { Field } from '../../../../../ui/components/ui/Field';
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

  const [updateProduct, { loading }] = useUpdateProductMutation();

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
            <Dialog.Content>
              <Dialog.CloseTrigger>
                <XIcon onClick={() => disclosure.setOpen(false)} />
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
                            }),
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
                    form.setValue('discountToggle', !details.checked, {
                      shouldValidate: true,
                    });
                  }}
                >
                  <div className="flex flex-row-reverse gap-2">
                    <Checkbox.Label className="text-carbon-500 text-sm font-medium">
                      Apply Discount
                    </Checkbox.Label>
                    <Checkbox.Control>
                      <Checkbox.Indicator className="flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
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
                          (price * ((field.value || 0) / 100)).toFixed(2),
                        );
                      return (
                        <div className="flex bg-carbon-950  gap-6 p-4 rounded-xl flex-col w-full">
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
                    className="bg-cyan-700 p-3 ui-disabled:opacity-10 ui-disabled:cursor-not-allowed text-white rounded-[32px] flex gap-2 items-center text-carbon-500 text-sm font-medium "
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
                </div>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};
