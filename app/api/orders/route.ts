import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/../lib/prisma';
import { getSession } from '@/../lib/auth.server';
import { generateOrderNumber } from '@/../lib/utils';
import { z } from 'zod';
import { OrderStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
});

const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, "Order must contain at least one item."),
  customerName: z.string().min(1, "Customer name is required."),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(1, "Customer phone is required."),
  shippingAddress: z.string().min(1),
  shippingCity: z.string().min(1),
  shippingCountry: z.string().min(1),
  shippingZip: z.string().optional(),
  paymentMethod: z.string().min(1),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as OrderStatus | null;

    const whereClause: any = {};

    if (session.role !== 'ADMIN') {
      whereClause.userId = session.userId;
    }

    if (status) {
      whereClause.status = status;
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        items: {
          include: {
            product: {
              select: { name: true, images: true },
            },
          },
        },
        ...(session.role === 'ADMIN' && {
            user: { select: { name: true, email: true } }
        }),
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const userId = session?.userId as string | undefined;

    const body = await request.json();
    const validation = createOrderSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { items, ...customerData } = validation.data;
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          ...customerData,
          userId,
          total,
          orderNumber: generateOrderNumber(),
          items: {
            create: items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });

      for (const item of items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product || product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product?.name || 'a product'}.`);
        }
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return newOrder;
    });

    return NextResponse.json(order, { status: 201 });

  } catch (error: any) {
    console.error('Order creation error:', error);
    if (error.message.includes('Insufficient stock')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create order.' }, { status: 500 });
  }
}