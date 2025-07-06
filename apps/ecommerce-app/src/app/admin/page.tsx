'use client';

import {
  CloseButton,
  Dialog,
  Field,
  Flex,
  Portal,
  useDisclosure,
} from '@chakra-ui/react';
import { ObjectType } from '@ecommerce-app/object-shared';
import { ObjectId } from '@ecommerce/object-id';
import {
  apolloClient,
  Badge,
  Button,
  capitalize,
  ComboboxField,
  DataTable,
  FieldInput,
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
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FaPlusCircle } from 'react-icons/fa';
import z from 'zod';
export default function ManageProducts() {
  const [page, setPage] = useState(1);
  const query = useProductsQuery();
  const items = useMemo(() => {
    return (
      query.data?.products.edges?.map(({ node }) => ({
        id: node._id,
        name: node.name,
        price: node.price,
        points: node.points,
        stock: node.pieces,
        category: node.category,
        status: node.status,
        discount: node.discount,
        thumbnail: node.thumbnail,
        finalPrice:
          (node.price ?? 0) - ((node.price ?? 0) * (node.discount || 0)) / 100,
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

          apolloClient.writeQuery<ProductsQuery, ProductsQueryVariables>({
            query: ProductsDocument,
            variables: query.variables,
            data: {
              products: {
                ...cacheResponse.products,
                edges: [
                  {
                    __typename: 'Edge',
                    cursor: '',
                    node: data,
                  },
                  ...(cacheResponse.products.edges || []),
                ],
              },
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
            render: (item) =>
              item.thumbnail ? (
                <Image
                  src={`https://drive.google.com/uc?export=view&id=${item.thumbnail}`}
                  alt={item.name || 'Product Image'}
                  width={100}
                  height={100}
                  className="rounded-md"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                  <p className="text-gray-500">No Image</p>
                </div>
              ),
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
                {item.category
                  ?.map((category) => {
                    return capitalize(category, {
                      delimiter: capitalize.delimiters.UNDERSCORE,
                    });
                  })
                  .join(', ')}
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
            render: (item) => <p>{item.points?.toString()}</p>,
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
            render: (item) => (
              <Badge.Root
                colorScheme={
                  item.status === StatusType.Available ? 'success' : 'danger'
                }
              >
                <Badge.Indicator asChild>
                  <span className="w-2 h-2 rounded-full bg-current" />
                </Badge.Indicator>
                <Badge.Label>
                  {capitalize(item.status ?? '', {
                    delimiter: capitalize.delimiters.UNDERSCORE,
                  })}
                </Badge.Label>
              </Badge.Root>
            ),
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
const AddProductButton = (props: AddProductButtonProps) => {
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
      status: StatusType.Available,
    },
  });
  const [createProduct, { loading }] = useCreateProductMutation();
  console.log(form.watch(), 'form watch');
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
                    {...field}
                    placeholder="Product Name"
                    label="Name"
                    className="w-full"
                  />
                )}
              />
              <Field.Root>
                <Field.Label>Image</Field.Label>
                <Controller
                  control={form.control}
                  name="thumbnail"
                  render={({ field }) => {
                    return <UploadFile {...field} />;
                  }}
                />
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
                name="discountPercentage"
                render={({ field }) => {
                  return (
                    <NumberInputField
                      value={field.value?.toString()}
                      onChange={(value) => {
                        field.onChange(+value);
                      }}
                      label="Dsicount Percentage"
                      placeholder="%"
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
