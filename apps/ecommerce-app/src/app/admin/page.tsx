'use client';

import {
  CloseButton,
  Dialog,
  Field,
  Flex,
  Portal,
  Text,
  useDisclosure,
  useFileUpload,
} from '@chakra-ui/react';
import {
  Button,
  ComboboxField,
  DataTable,
  FieldInput,
  MultiComboboxField,
  NumberInputField,
  UploadFile,
} from '@global';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FaPlusCircle } from 'react-icons/fa';
import z from 'zod';
export default function ManageProducts() {
  const [page, setPage] = useState(1);
  return (
    <Flex direction={'column'} gap={4} p={7}>
      <AddProductButton />

      <DataTable
        id="products"
        items={[
          {
            id: '1212',
            name: 'Product 1',
            description: 'Product 1 description',
          },
          {
            id: '1212',
            name: 'Product 2',
            description: 'Product 1 description',
          },
          {
            id: '1212',
            name: 'Product 3',
            description: 'Product 1 description',
          },
        ]}
        columns={[
          {
            heading: 'Image',
            filterable: true,
            render: (item) => <p>{item.id}</p>,
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
            render: (item) => <p>{item.id}</p>,
            sortable: true,
          },
          {
            heading: 'Price (₱)',
            filterable: true,
            render: (item) => <p>{item.id}</p>,
            sortable: true,
          },
          {
            heading: 'Discount (%)',
            filterable: true,
            render: (item) => <p>{item.id}</p>,
            sortable: true,
          },
          {
            heading: 'Discount (%)',
            filterable: true,
            render: (item) => <p>{item.id}</p>,
            sortable: true,
          },
          {
            heading: 'Final Price (₱)',
            filterable: true,
            render: (item) => <p>{item.id}</p>,
            sortable: true,
          },
          {
            heading: 'Points',
            filterable: true,
            render: (item) => <p>{item.id}</p>,
            sortable: true,
          },
          {
            heading: 'Stock ',
            filterable: true,
            render: (item) => <p>{item.id}</p>,
            sortable: true,
          },
          {
            heading: 'Status',
            filterable: true,
            render: (item) => <p>{item.id}</p>,
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
const schema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  image: z.string().trim().min(1, 'Image is required'),
  category: z.array(z.string()).min(1, 'At least one category is required'),
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
  status: z.nativeEnum(Status).or(z.literal('')),
});
const AddProductButton = () => {
  const disclosure = useDisclosure();
  const value = useFileUpload();
  const [value1, setValue1] = useState<string[]>(['Rice']);
  const [v1, setV1] = useState<string>('');
  const [status, setStatus] = useState<string>('ACTIVE');
  const form = useForm<z.infer<typeof schema>>({
    mode: 'all',
    defaultValues: {
      name: '',
      image: '',
      category: [],
      price: '',
      points: '',
      stock: '',
      status: '',
    },
  });
  console.log(form.watch(), 'form watch');
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Flex justify={'space-between'} w="full">
          <Text sizes={'heading-5'} fontWeight={'medium'}>
            Manage Products
          </Text>
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
            <Text sizes={'paragraph-sm'}> Add Product</Text>
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
              <Text
                sizes={'heading-6'}
                fontSize={'24px'}
                fontWeight={'semibold'}
              >
                Add Product
              </Text>
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
                      options={[
                        { label: 'Dairy', value: 'Dairy' },
                        { label: 'Snacks', value: 'Snacks' },
                        { label: 'Seasonings', value: 'Seasonings' },
                        { label: 'Rice', value: 'Rice' },
                      ]}
                      defaultValue={['Rice']}
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
                    options={[
                      { label: 'Active', value: 'ACTIVE' },
                      { label: 'Inactive', value: 'INACTIVE' },
                    ]}
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
                  className="bg-primary-700-value p-3 text-white rounded-[32px] text-carbon-500 text-sm font-medium"
                  onClick={() => disclosure.onClose()}
                >
                  Add Product
                </button>
              </div>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
