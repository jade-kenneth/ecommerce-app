'use client';

import { createListCollection } from '@ark-ui/react';

import { Flex } from '@chakra-ui/react';

import Image from 'next/image';
import { Reducer, useReducer } from 'react';
import { TbDotsVertical } from 'react-icons/tb';
import {
  CreateProduct,
  DeleteProduct,
  ProductProvider,
  UpdateProduct,
} from '../../libs/admin';
import {
  apolloClient,
  Badge,
  capitalize,
  DataTable,
  Menu,
  usePaginated,
} from '../../libs/global/src';
import {
  ProductsDocument,
  ProductsQuery,
  ProductsQueryVariables,
  StatusType,
  useProductsQuery,
} from '../../libs/global/src/graphql/generated';
interface PageState {
  page: number;
  pageSize: number;
}
export default function ManageProducts() {
  const [state, setState] = useReducer<Reducer<PageState, Partial<PageState>>>(
    (prev, next) => ({
      ...prev,
      ...next,
    }),
    { page: 1, pageSize: 10 }
  );
  const query = useProductsQuery({
    fetchPolicy: 'network-only',
    variables: {
      first: state.pageSize,
    },
  });

  const { currentPage, totalPages } = usePaginated(() => {
    if (!query.data) return [];

    return query.data.products.edges.map(({ node }) => node);
  }, state);

  return (
    <Flex direction={'column'} gap={4} p={7}>
      <CreateProduct
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
        collections={createListCollection({
          items: currentPage,
          itemToValue: (item) => item._id,
          itemToString: (item) => item.name,
        })}
        columns={[
          {
            heading: 'Image',
            filterable: true,
            render: (item) => {
              console.log(item.thumbnail.split('/upload'));
              return item.thumbnail ? (
                <Image
                  src={item.thumbnail}
                  alt={item.name || 'Product Image'}
                  width={100}
                  height={100}
                  className="rounded-md aspect-[1/1] object-cover w-12 h-12"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                  <p className="text-gray-500">No Image</p>
                </div>
              );
            },

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
            render: (item) => (
              <p>{item.price - (item.price * item.discount) / 100}</p>
            ),
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
            render: (item) => <p>{item.pieces ?? '-'}</p>,
            sortable: true,
          },
          {
            heading: 'Status',
            filterable: true,
            render: (item) => (
              <Badge.Root
                colorScheme={
                  item.status === StatusType.Active ? 'success' : 'danger'
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
          {
            heading: '',
            filterable: true,
            render: (item) => (
              <Menu.Root>
                <Menu.Trigger>
                  <TbDotsVertical />
                </Menu.Trigger>

                <Menu.Positioner>
                  <Menu.Content className="min-w-[115px]">
                    <ProductProvider value={item}>
                      <Menu.Item value="update">
                        <UpdateProduct
                          onUpdateProduct={async (data) => {
                            const res = apolloClient.readQuery<
                              ProductsQuery,
                              ProductsQueryVariables
                            >({
                              query: ProductsDocument,
                              variables: query.variables,
                            });

                            if (!res?.products) return query.refetch();

                            const edges = res.products.edges.map((edge) => {
                              if (edge.node._id === data._id) {
                                return {
                                  ...edge,
                                  node: data,
                                };
                              }
                              return edge;
                            });

                            apolloClient.writeQuery<
                              ProductsQuery,
                              ProductsQueryVariables
                            >({
                              query: ProductsDocument,
                              variables: query.variables,
                              data: {
                                products: {
                                  ...res.products,
                                  edges,
                                },
                                __typename: 'Query',
                              },
                            });
                          }}
                        />
                      </Menu.Item>
                      <Menu.Item value="delete">
                        <DeleteProduct />
                      </Menu.Item>
                    </ProductProvider>
                  </Menu.Content>
                </Menu.Positioner>
              </Menu.Root>
            ),
            sortable: true,
          },
        ]}
        pagination={{
          page: state.page,
          pageSize: state.pageSize,
          totalItems: query.data?.products.totalCount ?? 0,
          onPageChange: async (page) => {
            if (page > totalPages) {
              await query.fetchMore({
                variables: {
                  ...query.variables,

                  after: query.data?.products.pageInfo.endCursor,
                },
              });
            }
            setState({ page });
          },
        }}
      />
    </Flex>
  );
}
