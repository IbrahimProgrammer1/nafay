import { prisma } from '@/../lib/prisma';
import { formatPrice } from '@/../lib/utils';
import Link from 'next/link';
import { Eye, Truck } from 'lucide-react';
import OrderStatusFilter from './_components/OrderStatusFilter';
import { OrderStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams?: { status?: OrderStatus };
}) {
  const status = searchParams?.status;

  const orders = await prisma.order.findMany({
    where: {
      status: status || undefined,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      _count: {
        select: { items: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="mt-1 text-gray-600">View and manage all customer orders.</p>
        </div>
        <OrderStatusFilter />
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Order ID</th>
              <th scope="col" className="px-6 py-3">Date</th>
              <th scope="col" className="px-6 py-3">Customer</th>
              <th scope="col" className="px-6 py-3">Total</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
                <th scope="row" className="px-6 py-4 font-mono text-gray-900 whitespace-nowrap">
                  #{order.orderNumber.split('-').pop()?.toUpperCase()}
                </th>
                <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">{order.customerName}</td>
                <td className="px-6 py-4 font-medium">{formatPrice(order.total)}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                      order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'PROCESSING' ? 'bg-purple-100 text-purple-800' :
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/admin/orders/${order.id}`}>
                    <button className="text-primary-600 hover:text-primary-800"><Eye size={18} /></button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
            <div className="text-center py-12 text-gray-500">
                <p>No orders found for this status.</p>
            </div>
        )}
      </div>
    </div>
  );
}