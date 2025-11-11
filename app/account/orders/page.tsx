'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import { type Order, type OrderItem, type Product } from '@prisma/client';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/../lib/utils';
import Spinner from '@/../components/Spinner';
import { Package, Calendar, Hash } from 'lucide-react';
import toast from 'react-hot-toast';

// Define a more detailed type for our order object
type OrderWithItems = Order & {
  items: (OrderItem & {
    product: Pick<Product, 'name' | 'images'>;
  })[];
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await axios.get<OrderWithItems[]>('/api/orders');
        setOrders(response.data);
      } catch (error: any) {
        if (error.response?.status === 401) {
            toast.error("Please log in to view your orders.");
            // Optionally redirect to login page
            // router.push('/login');
        } else {
            toast.error("Failed to fetch your orders.");
        }
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center min-h-[60vh] flex flex-col justify-center items-center">
        <Package className="h-20 w-20 text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800">No Orders Yet</h1>
        <p className="mt-2 text-gray-500">You haven&apos;t placed any orders with us. Let&apos;s change that!</p>
        <Link href="/products">
          <button className="mt-6 bg-primary-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-primary-700 transition-colors">
            Start Shopping
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 sm:p-6 bg-gray-50 rounded-t-lg flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} />
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-mono">
                    <Hash size={16} />
                    <span>#{order.orderNumber.split('-').pop()?.toUpperCase()}</span>
                  </div>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                    order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'PROCESSING' ? 'bg-purple-100 text-purple-800' :
                    order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="p-4 sm:p-6">
                <ul className="space-y-4">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex items-start gap-4">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-md object-cover border"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.product.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-gray-800">{formatPrice(item.price * item.quantity)}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 sm:p-6 bg-gray-50 rounded-b-lg text-right">
                <p className="text-lg font-semibold text-gray-900">
                  Total: {formatPrice(order.total)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}