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
import { FaPlusCircle } from 'react-icons/fa';

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

const AddProductButton = () => {
  const disclosure = useDisclosure();
  const value = useFileUpload();
  const [value1, setValue1] = useState<string[]>(['Rice']);
  const [v1, setV1] = useState<string>('');
  const [status, setStatus] = useState<string>('ACTIVE');

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
              <FieldInput
                value={v1}
                onChange={(e) => setV1(e)}
                label="Product Name"
                placeholder="Enter product name"
              />
              <Field.Root>
                <Field.Label>Image</Field.Label>
                <UploadFile />
              </Field.Root>

              <MultiComboboxField
                options={[
                  { label: 'Dairy', value: 'Dairy' },
                  { label: 'Snacks', value: 'Snacks' },
                  { label: 'Seasonings', value: 'Seasonings' },
                  { label: 'Rice', value: 'Rice' },
                ]}
                defaultValue={['Rice']}
                value={value1}
                onChange={(value) => {
                  setValue1(value);
                }}
                placeholder="Choose or select category"
                label="Category"
              />

              <NumberInputField
                value={v1}
                onChange={(e) => setV1(e)}
                label="Price"
                placeholder="₱ 0.00"
              />

              <NumberInputField
                value={v1}
                onChange={(e) => setV1(e)}
                label="Points"
                placeholder="0"
              />

              <NumberInputField
                value={v1}
                onChange={(e) => setV1(e)}
                label="Stock"
                placeholder="0"
              />

              <ComboboxField
                options={[
                  { label: 'Active', value: 'ACTIVE' },
                  { label: 'Inactive', value: 'INACTIVE' },
                ]}
                value={status}
                onChange={(value) => {
                  setStatus(value);
                }}
                label="Status"
                placeholder="Choose or select status"
              />
            </Dialog.Body>
            <Dialog.Footer>
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
