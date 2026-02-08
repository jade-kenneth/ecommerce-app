'use client';

import { Package, ShoppingCart, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import { OrderStatus, useMyOrdersQuery, useProductsQuery } from '~/graphql/generated';
import { numberFormatter } from '~/utils/numberFormatter';
import { safeParseFloat } from '~/utils/safeParseFloat';
import { capitalize } from '~/utils/capitalize';

export const Dashboard = () => {
  const productsQuery = useProductsQuery({
    fetchPolicy: 'network-only',
    variables: { first: 1 },
  });
  const ordersQuery = useMyOrdersQuery({
    fetchPolicy: 'network-only',
  });

  const stats = useMemo(() => {
    const totalProducts = productsQuery.data?.products.totalCount ?? 0;
    const orders = ordersQuery.data?.myOrders ?? [];
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce(
      (sum, order) => sum + safeParseFloat(order.total, 0),
      0,
    );
    const avgOrderValue =
      totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const pendingOrders = orders.filter(
      (order) => order.status === OrderStatus.Pending,
    ).length;

    return [
      {
        title: 'Total Revenue',
        value: `₱${numberFormatter.format(totalRevenue, { locale: 'en-PH' })}`,
        helper: `${totalOrders} order${totalOrders === 1 ? '' : 's'}`,
        icon: TrendingUp,
      },
      {
        title: 'Orders',
        value: numberFormatter.format(totalOrders, { locale: 'en-PH' }),
        helper: `${pendingOrders} pending`,
        icon: ShoppingCart,
      },
      {
        title: 'Products',
        value: numberFormatter.format(totalProducts, { locale: 'en-PH' }),
        helper: 'Active catalog count',
        icon: Package,
      },
      {
        title: 'Avg Order Value',
        value: `₱${numberFormatter.format(avgOrderValue, { locale: 'en-PH' })}`,
        helper: 'Based on total orders',
        icon: TrendingUp,
      },
    ];
  }, [productsQuery.data, ordersQuery.data]);

  const recentOrders = useMemo(() => {
    const orders = ordersQuery.data?.myOrders ?? [];
    return [...orders]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5);
  }, [ordersQuery.data]);
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-200 dark:border-gray-800 dark:bg-gray-950"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <Icon className="w-5 h-5 text-cyan-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {stat.value}
              </div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {stat.helper}
              </p>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Orders
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Latest orders from your store
            </p>
          </div>
          <div className="space-y-4">
            {ordersQuery.loading ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Loading orders...
              </p>
            ) : recentOrders.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No orders yet.
              </p>
            ) : (
              recentOrders.map((order, index) => (
                <div
                  key={order._id}
                  className={`flex items-center justify-between py-4 ${
                    index !== recentOrders.length - 1
                      ? 'border-b border-gray-200 dark:border-gray-800'
                      : ''
                  }`}
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      #{order._id}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {capitalize(order.status ?? '', {
                        delimiter: capitalize.delimiters.UNDERSCORE,
                      })}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      ₱
                      {numberFormatter.format(order.total, {
                        locale: 'en-PH',
                      })}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('en-PH')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Quick Actions
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage your store
            </p>
          </div>
          <div className="space-y-3">
            <button className="w-full px-4 py-3 bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white font-semibold rounded-lg transition-colors duration-200">
              Add New Product
            </button>
            <button className="w-full px-4 py-3 border-2 border-cyan-600 text-cyan-600 hover:bg-cyan-50 active:bg-cyan-100 dark:hover:bg-cyan-950 dark:active:bg-cyan-900 font-semibold rounded-lg transition-colors duration-200">
              View Analytics
            </button>
            <button className="w-full px-4 py-3 border-2 border-cyan-600 text-cyan-600 hover:bg-cyan-50 active:bg-cyan-100 dark:hover:bg-cyan-950 dark:active:bg-cyan-900 font-semibold rounded-lg transition-colors duration-200">
              Manage Inventory
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
