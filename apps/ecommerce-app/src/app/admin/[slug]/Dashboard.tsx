import { BarChart, Package, TrendingUp, Users } from 'lucide-react';

export const Dashboard = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$12,485',
      change: '+12.5%',
      icon: TrendingUp,
    },
    {
      title: 'Total Users',
      value: '2,543',
      change: '+5.2%',
      icon: Users,
    },
    {
      title: 'Products',
      value: '384',
      change: '+2.1%',
      icon: Package,
    },
    {
      title: 'Growth',
      value: '23.5%',
      change: '+8.2%',
      icon: BarChart,
    },
  ];
  const activities = [
    { user: 'Sarah Johnson', action: 'Purchased', time: '2 hours ago' },
    { user: 'Mike Chen', action: 'Reviewed product', time: '4 hours ago' },
    { user: 'Emma Davis', action: 'Added to cart', time: '6 hours ago' },
  ];
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
              <p className="text-xs font-medium text-green-600 dark:text-green-500">
                {stat.change} from last month
              </p>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Your latest transactions
            </p>
          </div>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div
                key={activity.user}
                className={`flex items-center justify-between py-4 ${
                  index !== activities.length - 1
                    ? 'border-b border-gray-200 dark:border-gray-800'
                    : ''
                }`}
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {activity.user}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {activity.action}
                  </p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {activity.time}
                </p>
              </div>
            ))}
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
