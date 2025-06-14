'use client';

import {
  CloseButton,
  Dialog,
  Field,
  Flex,
  Portal,
  useDisclosure,
  useFileUpload,
} from '@chakra-ui/react';
import {
  apolloClient,
  Button,
  capitalize,
  ComboboxField,
  DataTable,
  FieldInput,
  generateObjectIdString,
  MultiComboboxField,
  NumberInputField,
  Spinner,
  UploadFile,
} from '@global';
import {
  CategoryType,
  ProductCoreDataFragment,
  ProductsDocument,
  ProductsQuery,
  ProductsQueryVariables,
  StatusType,
  useCreateProductMutation,
  useProductsQuery,
} from '@graphql/products';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FaPlusCircle } from 'react-icons/fa';
import z from 'zod';
export default function ManageProducts() {
  const [page, setPage] = useState(1);
  const query = useProductsQuery();
  const items = useMemo(() => {
    return (
      query.data?.products?.map((item) => ({
        id: item._id,
        name: item.name,
        price: item.price,
        points: item.points,
        stock: item.pieces,
        category: item.category,
        status: item.status,
        discount: item.discount,
        finalPrice:
          (item.price ?? 0) - ((item.price ?? 0) * (item.discount || 0)) / 100,
      })) || []
    );
  }, [query]);
  return (
    <Flex direction={'column'} gap={4} p={7}>
      <AddProductButton
        onAddProduct={(data) => {
          const cacheResponse = apolloClient.readQuery<
            ProductsQuery,
            ProductsQueryVariables
          >({
            query: ProductsDocument,
            variables: query.variables,
          });

          if (!cacheResponse) return query.refetch();

          const newProducts = [data, ...(cacheResponse.products || [])];

          apolloClient.writeQuery<ProductsQuery, ProductsQueryVariables>({
            query: ProductsDocument,
            variables: query.variables,
            data: {
              products: newProducts,
              __typename: 'Query',
            },
          });
        }}
      />

      <DataTable
        id="products"
        items={items}
        columns={[
          {
            heading: 'Image',
            filterable: true,
            render: (item) => <p>N/A</p>,
            sortable: true,
          },
          {
            heading: 'Product Name',
            filterable: true,
            render: (item) => <p>{item.name}</p>,
            sortable: true,
          },
          {
            heading: 'Category',
            filterable: true,
            render: (item) => (
              <p>
                {item.category?.map((category) => {
                  return capitalize(category, {
                    delimiter: capitalize.delimiters.UNDERSCORE,
                  });
                })}
              </p>
            ),
            sortable: true,
          },
          {
            heading: 'Price (₱)',
            filterable: true,
            render: (item) => <p>{item.price}</p>,
            sortable: true,
          },
          {
            heading: 'Discount (%)',
            filterable: true,
            render: (item) => <p>{item.discount ?? '-'}</p>,
            sortable: true,
          },
          {
            heading: 'Final Price (₱)',
            filterable: true,
            render: (item) => <p>{item.finalPrice}</p>,
            sortable: true,
          },
          {
            heading: 'Points',
            filterable: true,
            render: (item) => <p>{item.points}</p>,
            sortable: true,
          },
          {
            heading: 'Stock ',
            filterable: true,
            render: (item) => <p>{item.stock ?? '-'}</p>,
            sortable: true,
          },
          {
            heading: 'Status',
            filterable: true,
            render: (item) => <p>{item.status}</p>,
            sortable: true,
          },
        ]}
        pagination={{
          page,
          pageSize: 10,
          totalItems: 100,
          onPageChange: (page) => {
            console.log(page, 'page');
            setPage(page);
          },
        }}
      />
    </Flex>
  );
}
enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

type Value = {
  type?: 'per-level' | 'bet-amount';
  perLevel?: Record<string, any>;
  betAmount?: Record<string, any>;
};
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
    .string()
    .trim()
    .min(1, 'Stock is required')
    .superRefine((val, ctx) => {
      if (!/^\d+$/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Stock must be a valid integer',
        });
      }
    }),
  status: z.nativeEnum(StatusType),
});

interface AddProductButtonProps {
  onAddProduct?: (data: ProductCoreDataFragment) => void;
}
const AddProductButton = (props: AddProductButtonProps) => {
  const disclosure = useDisclosure();
  const value = useFileUpload();
  const [value1, setValue1] = useState<string[]>(['Rice']);
  const [v1, setV1] = useState<string>('');
  const [status, setStatus] = useState<string>('ACTIVE');
  const [value2, setValue2] = useState<Value>({
    perLevel: { level_1: { test: '3' }, level_2: { test: '1' } },
  });
  console.log(value2, 'value2');
  const form = useForm<z.infer<typeof schema>>({
    mode: 'all',
    defaultValues: {
      name: '',
      image: '',
      category: [],
      price: '',
      points: '',
      stock: '',
      status: StatusType.Available,
    },
  });
  const [createProduct, { loading }] = useCreateProductMutation();
  return (
    <Dialog.Root closeOnInteractOutside>
      <Dialog.Trigger>
        <Flex justify={'space-between'} w="full">
          <p className="text-heading-5 font-medium">Manage Products</p>
          <Button
            display={'flex'}
            alignItems={'center'}
            rounded={'32px'}
            bg="colors.primary.700"
            gap={2}
            h="36px"
            w="fit-content"
          >
            <FaPlusCircle />
            <p className="text-paragraph-sm"> Add Product</p>
          </Button>
        </Flex>
      </Dialog.Trigger>

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
                    {...field}
                    placeholder="Product Name"
                    label="Name"
                    className="w-full"
                  />
                )}
              />
              <Field.Root>
                <Field.Label>Image</Field.Label>
                <UploadFile />
              </Field.Root>

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
              <Controller
                control={form.control}
                name="stock"
                render={({ field }) => {
                  return (
                    <NumberInputField
                      {...field}
                      label="Stock"
                      placeholder="0"
                    />
                  );
                }}
              />

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
            </Dialog.Body>
            <Dialog.Footer className="flex justify-between">
              <button onClick={() => form.reset()}>Clear</button>
              <div className="flex gap-2 items-center">
                <button
                  className="border-[1px] border-[#D2D2D2] p-3 rounded-[32px] text-carbon-500 text-sm font-medium"
                  onClick={() => disclosure.onClose()}
                >
                  Save as Draft
                </button>
                <button
                  className="bg-primary-700-value p-3 text-white rounded-[32px] flex gap-2 items-center text-carbon-500 text-sm font-medium"
                  onClick={form.handleSubmit(async (data) => {
                    const id = generateObjectIdString();
                    console.log(id, 'idd');
                    try {
                      const response = await createProduct({
                        variables: {
                          input: {
                            id,
                            name: data.name,
                            category: data.category,
                            price: parseFloat(data.price),
                            points: parseInt(data.points, 10),
                            pieces: parseInt(data.stock, 10),

                            status: data.status,
                            dateAdded: new Date().toISOString(),
                          },
                        },
                      });

                      props.onAddProduct?.({
                        ...data,
                        price: +data.price,
                        points: +data.points,
                        _id: id,
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
                  {loading && <Spinner className="w-4 h-4" />}
                </button>
              </div>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
