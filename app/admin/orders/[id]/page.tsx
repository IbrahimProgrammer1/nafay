import { prisma } from '@/../lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { formatPrice } from '@/../lib/utils';
import { Home, Phone, Mail, User } from 'lucide-react';
import UpdateOrderStatusForm from './_components/UpdateOrderStatusForm';

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Order #{order.orderNumber.split('-').pop()?.toUpperCase()}</h1>
        <p className="mt-1 text-gray-600">
          Placed on {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Items Ordered */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Items Ordered ({order.items.length})</h3>
            <ul className="divide-y divide-gray-200">
              {order.items.map(item => (
                <li key={item.id} className="flex py-4">
                  <Image src={item.product.images[0]} alt={item.product.name} width={64} height={64} className="h-16 w-16 rounded-md object-cover"/>
                  <div className="ml-4 flex-1">
                    <p className="font-medium text-gray-900">{item.product.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                    <p className="text-sm text-gray-500">({formatPrice(item.price)} each)</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Payment and Shipping */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
                  <div className="space-y-2 text-sm">
                      <p><strong>Total:</strong> {formatPrice(order.total)}</p>
                      <p><strong>Method:</strong> <span className="capitalize">{order.paymentMethod.replace('_', ' ')}</span></p>
                      <p><strong>Status:</strong> <span className="capitalize font-medium">{order.paymentStatus}</span></p>
                  </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">Shipping Method</h3>
                  <p className="text-sm">Standard Shipping (Free)</p>
              </div>
          </div>
        </div>

        {/* Customer and Status */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Customer</h3>
            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-2"><User size={14}/> {order.customerName}</p>
              <p className="flex items-center gap-2"><Mail size={14}/> {order.customerEmail}</p>
              <p className="flex items-center gap-2"><Phone size={14}/> {order.customerPhone}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
            <address className="text-sm not-italic">
              {order.shippingAddress}<br />
              {order.shippingCity}{order.shippingZip ? `, ${order.shippingZip}` : ''}<br />
              {order.shippingCountry}
            </address>
          </div>
           <div className="bg-white p-6 rounded-lg shadow-sm">
             <h3 className="text-lg font-semibold mb-4">Update Status</h3>
             <UpdateOrderStatusForm orderId={order.id} currentStatus={order.status} />
           </div>
        </div>
      </div>
    </div>
  );
}