'use client';

import { createListCollection, Portal } from '@ark-ui/react';

import { MoreVertical } from 'lucide-react';
import Image from 'next/image';
import { Reducer, useMemo, useReducer } from 'react';
import { DataTable } from '~/components/DataTable/DataTable';
import { Badge } from '~/components/ui/Badge';
import { Menu } from '~/components/ui/Menu';

import { apolloClient } from '~/config/client';
import {
  CreateProduct,
  DeleteProduct,
  ProductProvider,
  UpdateProduct,
} from '~/features/admin';
import {
  ProductsDocument,
  ProductsQuery,
  ProductsQueryVariables,
  StatusType,
  useProductsQuery,
} from '~/graphql/generated';
import { usePaginated } from '~/hooks/usePaginated';
import { capitalize } from '~/utils/capitalize';
import { numberFormatter } from '~/utils/numberFormatter';

interface PageState {
  page: number;
  pageSize: number;
}
export const ManageInventory = () => {
  const [state, setState] = useReducer<Reducer<PageState, Partial<PageState>>>(
    (prev, next) => ({
      ...prev,
      ...next,
    }),
    { page: 1, pageSize: 10 },
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

  const summaryCards = useMemo(() => {
    const active = query.data?.products.edges.filter(
      (item) => item.node.status === StatusType.Active,
    ).length;
    const discounted = query.data?.products.edges.filter(
      (item) => (item.node.discount ?? 0) > 0,
    ).length;
    const lowStock = query.data?.products.edges.filter(
      (item) => (item.node.pieces ?? 0) <= 5,
    ).length;

    return [
      {
        label: 'Total Products',
        value: numberFormatter.format(query?.data?.products.totalCount ?? 0, {
          locale: 'en-PH',
        }),
      },
      {
        label: 'Active Products',
        value: numberFormatter.format(active, { locale: 'en-PH' }),
      },
      {
        label: 'Discounted',
        value: numberFormatter.format(discounted, { locale: 'en-PH' }),
      },
      {
        label: 'Low Stock',
        value: numberFormatter.format(lowStock, { locale: 'en-PH' }),
      },
    ];
  }, [query.data]);

  return (
    <div className="flex flex-col gap-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-1 px-2 pb-4">
          <p className="text-lg font-semibold text-gray-900">Product List</p>
          <p className="text-sm text-gray-500">
            Showing {currentPage.length} of{' '}
            {query.data?.products.totalCount ?? 0} products
          </p>
        </div>
        <DataTable
          id="products"
          collections={createListCollection({
            items: currentPage,
            itemToValue: (item) => item._id,
            itemToString: (item) => item.name,
          })}
          loading={query.loading}
          columns={[
            {
              heading: 'Image',
              filterable: true,
              render: (item) => {
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
              render: (item) => (
                <p>
                  ₱{numberFormatter.format(item.price, { locale: 'en-PH' })}
                </p>
              ),
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
                <p>
                  ₱
                  {numberFormatter.format(
                    item.price - (item.price * item.discount) / 100,
                    { locale: 'en-PH' },
                  )}
                </p>
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
              heading: 'Stock',
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
              heading: 'Actions',
              filterable: true,
              render: (item) => (
                <Menu.Root unmountOnExit={false} lazyMount>
                  <Menu.Trigger className="flex items-center justify-center">
                    <MoreVertical className="w-4 h-4" />
                  </Menu.Trigger>
                  <Portal>
                    <Menu.Positioner>
                      <ProductProvider value={item}>
                        <Menu.Content className="min-w-[115px]">
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

                          <DeleteProduct />
                        </Menu.Content>
                      </ProductProvider>
                    </Menu.Positioner>
                  </Portal>
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
      </div>
    </div>
  );
};
