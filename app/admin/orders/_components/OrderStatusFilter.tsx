'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { OrderStatus } from '@prisma/client';

export default function OrderStatusFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    const params = new URLSearchParams(searchParams);
    if (status && status !== 'ALL') {
      params.set('status', status);
    } else {
      params.delete('status');
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const statuses: (OrderStatus | 'ALL')[] = ['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  return (
    <div>
      <select
        onChange={handleFilterChange}
        defaultValue={searchParams.get('status') || 'ALL'}
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
      >
        {statuses.map(status => (
          <option key={status} value={status}>
            {status === 'ALL' ? 'All Orders' : status.charAt(0) + status.slice(1).toLowerCase()}
          </option>
        ))}
      </select>
    </div>
  );
}