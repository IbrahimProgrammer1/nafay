'use server'

import { prisma } from '@/../lib/prisma';
import { OrderStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function updateOrderStatusAction(orderId: string, newStatus: OrderStatus) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });
    // Revalidate both the detail page and the list page
    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true, message: 'Order status updated successfully.' };
  } catch (error) {
    return { success: false, message: 'Database Error: Failed to update order status.' };
  }
}