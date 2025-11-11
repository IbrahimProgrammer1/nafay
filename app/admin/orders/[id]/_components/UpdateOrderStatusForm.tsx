'use client'

import { OrderStatus } from '@prisma/client';
import { updateOrderStatusAction } from '../../_actions';
import { useTransition } from 'react';
import toast from 'react-hot-toast';

export default function UpdateOrderStatusForm({ orderId, currentStatus }: { orderId: string, currentStatus: OrderStatus }) {
  const [isPending, startTransition] = useTransition();

  const handleStatusUpdate = (formData: FormData) => {
    const newStatus = formData.get('status') as OrderStatus;
    startTransition(async () => {
      const result = await updateOrderStatusAction(orderId, newStatus);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  const statuses: OrderStatus[] = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  return (
    <form action={handleStatusUpdate} className="space-y-4">
      <select
        name="status"
        defaultValue={currentStatus}
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
      >
        {statuses.map(status => (
          <option key={status} value={status}>{status}</option>
        ))}
      </select>
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:bg-gray-400"
      >
        {isPending ? 'Updating...' : 'Update Status'}
      </button>
    </form>
  );
}