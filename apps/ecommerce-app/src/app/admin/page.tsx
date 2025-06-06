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
  DataTable,
  Input,
  MultiComboboxField,
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
              <Field.Root>
                <Field.Label>Product Name</Field.Label>
                <Input rounded={'32px'} placeholder="Enter product name" />
              </Field.Root>
              <Field.Root>
                <Field.Label>Image</Field.Label>
                <UploadFile />
              </Field.Root>
              <Field.Root>
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
                  label="Category"
                />
              </Field.Root>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
