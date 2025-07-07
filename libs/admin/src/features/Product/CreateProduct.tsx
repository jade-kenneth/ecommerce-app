import {
  CloseButton,
  Dialog,
  Flex,
  Portal,
  useDisclosure,
} from '@chakra-ui/react';
import { ObjectType } from '@ecommerce-app/object-shared';
import { ObjectId } from '@ecommerce/object-id';
import {
  Button,
  capitalize,
  ComboboxField,
  Field,
  FieldInput,
  MultiComboboxField,
  NumberInputField,
  Spinner,
  UploadFile,
} from '@global';
import {
  CategoryType,
  ProductCoreDataFragment,
  StatusType,
  useCreateProductMutation,
} from '@graphql/products';
import { Checkbox } from 'libs/general/src/components/ui/Checkbox';
import { Controller, useForm } from 'react-hook-form';
import { FaPlusCircle } from 'react-icons/fa';
import { IoCheckmarkCircleOutline } from 'react-icons/io5';
import z from 'zod';
const schema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  image: z.string().trim().min(1, 'Image is required'),
  category: z
    .array(z.nativeEnum(CategoryType))
    .min(1, 'At least one category is required'),
  price: z
    .string()
    .trim()
    .min(1, 'Price is required')
    .superRefine((val, ctx) => {
      if (!/^\d+(\.\d{1,2})?$/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Price must be a valid number with up to two decimal places',
        });
      }
    }),
  points: z
    .string()
    .trim()
    .min(1, 'Points is required')
    .superRefine((val, ctx) => {
      if (!/^\d+$/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Points must be a valid integer',
        });
      }
    }),
  stock: z
    .number()
    .int('Must be a whole number')
    .min(0, 'Stock cannot be negative'),
  status: z.nativeEnum(StatusType),
  discountPercentage: z
    .number()
    .int('Must be a whole number')
    .min(0)
    .max(100)
    .optional(),
  thumbnail: z.string().trim().min(1, 'Thumbnail is required'),
});

interface AddProductButtonProps {
  onAddProduct?: (data: ProductCoreDataFragment) => void;
}
export const CreateProduct = (props: AddProductButtonProps) => {
  const disclosure = useDisclosure();

  const form = useForm<z.infer<typeof schema>>({
    mode: 'all',
    defaultValues: {
      name: '',
      image: '',
      category: [],
      price: '',
      points: '',
      stock: 0,
      status: StatusType.Active,
    },
  });
  const [createProduct, { loading }] = useCreateProductMutation();

  const price = parseFloat(form.watch('price') || '0');
  return (
    <Dialog.Root closeOnInteractOutside open={disclosure.open}>
      <Flex justify={'space-between'} w="full">
        <p className="text-heading-5 font-medium">Manage Products</p>
        <Dialog.Trigger>
          <Button
            display={'flex'}
            alignItems={'center'}
            rounded={'32px'}
            bg="colors.primary.700"
            gap={2}
            h="36px"
            cursor={'pointer'}
            w="fit-content"
            onClick={() => disclosure.onOpen()}
          >
            <FaPlusCircle />
            <p className="text-paragraph-sm"> Add Product</p>
          </Button>
        </Dialog.Trigger>
      </Flex>

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
                    {...field}
                    placeholder="Product Name"
                    className="w-full"
                  />
                )}
              />

              <Controller
                control={form.control}
                name="thumbnail"
                render={({ field }) => {
                  return <UploadFile {...field} />;
                }}
              />

              <Controller
                control={form.control}
                name="category"
                render={({ field }) => {
                  return (
                    <MultiComboboxField
                      options={Object.values(CategoryType).map((category) => ({
                        label: capitalize(category, {
                          delimiter: capitalize.delimiters.UNDERSCORE,
                        }),
                        value: category,
                      }))}
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
              <Checkbox.Root className="flex flex-col gap-2 items-start">
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
                <Checkbox.Context>
                  {({ checked }) => {
                    return checked ? (
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
                                  field.onChange(+value);
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
                                className="w-full text-carbon-300-value "
                              />
                            </div>
                          );
                        }}
                      />
                    ) : (
                      <></>
                    );
                  }}
                </Checkbox.Context>
              </Checkbox.Root>
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
            <Dialog.Footer className="flex justify-between">
              <button onClick={() => form.reset()}>Clear</button>
              <div className="flex gap-2 items-center">
                <button
                  className="bg-primary-700-value p-3 text-white rounded-[32px] flex gap-2 items-center text-carbon-500 text-sm font-medium"
                  onClick={form.handleSubmit(async (data) => {
                    const _id = ObjectId.generate(
                      ObjectType.Product
                    ).toHexString();
                    try {
                      await createProduct({
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

                      props.onAddProduct?.({
                        ...data,
                        price: +data.price,
                        points: data.points,
                        pieces: data.stock,
                        discount: data.discountPercentage || 0,
                        _id,
                        __typename: 'Product',
                      });
                      disclosure.onClose();
                      form.reset();
                    } catch (error) {
                      console.error('Error creating product:', error);
                    }
                  })}
                  disabled={
                    !form.formState.isValid || form.formState.isSubmitting
                  }
                >
                  <p>Add Product</p>{' '}
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
