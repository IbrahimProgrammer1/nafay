import { prisma } from '@/../lib/prisma';
import { formatPrice } from '@/../lib/utils';
import { Users, Package, ShoppingCart, DollarSign, Activity, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

// Helper function to get stats in a single DB query for efficiency
async function getDashboardStats() {
  const [totalRevenue, totalOrders, totalCustomers, totalProducts] = await prisma.$transaction([
    prisma.order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        status: 'DELIVERED',
      },
    }),
    prisma.order.count(),
    prisma.user.count({
      where: {
        role: 'USER',
      },
    }),
    prisma.product.count(),
  ]);

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user: {
        select: { name: true },
      },
    },
  });

  return {
    totalRevenue: totalRevenue._sum.total ?? 0,
    totalOrders,
    totalCustomers,
    totalProducts,
    recentOrders,
  };
}

// Re-usable Stat Card Component
function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  changeType 
}: { 
  title: string;
  value: string | number;
  icon: React.ElementType;
  change?: string;
  changeType?: 'increase' | 'decrease';
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <Icon className="h-6 w-6 text-gray-400" />
      </div>
      <div className="mt-2">
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        {change && (
          <p className={`mt-1 text-sm flex items-center ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
            <ArrowUpRight className={`h-4 w-4 mr-1 ${changeType === 'decrease' ? 'transform rotate-180' : ''}`} />
            {change}
          </p>
        )}
      </div>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const {
    totalRevenue,
    totalOrders,
    totalCustomers,
    totalProducts,
    recentOrders,
  } = await getDashboardStats();

  const stats = [
    { 
      title: 'Total Revenue', 
      value: formatPrice(totalRevenue), 
      icon: DollarSign, 
      change: '+2.5% this month' 
    },
    { 
      title: 'Total Orders', 
      value: totalOrders, 
      icon: ShoppingCart, 
      change: '+10% this month' 
    },
    { 
      title: 'Total Customers', 
      value: totalCustomers, 
      icon: Users, 
      change: '+5 new this month' 
    },
    { 
      title: 'Total Products', 
      value: totalProducts, 
      icon: Package 
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-600">An overview of your store&apos;s performance.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            changeType="increase"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
          <div className="flow-root">
            <ul role="list" className="-my-5 divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <li key={order.id} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <ShoppingCart className="h-5 w-5 text-primary-600" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        Order #{order.orderNumber.split('-').pop()}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        by {order.customerName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatPrice(order.total)}
                      </p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                        order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 text-center">
              <Link href="/admin/orders" className="text-sm font-medium text-primary-600 hover:text-primary-800">
                View all orders &rarr;
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Analytics</h3>
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
            <Activity className="h-12 w-12 mb-2" />
            <p className="text-sm">Sales chart coming soon.</p>
            <p className="text-xs">Integrate a library like Recharts or Chart.js here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}