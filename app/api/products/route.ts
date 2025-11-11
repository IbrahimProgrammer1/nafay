import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/../lib/prisma';
import { getSession } from '../../../lib/auth.server';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1),
  brand: z.string().min(1),
  price: z.number().positive(),
  description: z.string().min(1),
  images: z.array(z.string()),
  stock: z.number().int().nonnegative(),
  processor: z.string().min(1),
  ram: z.string().min(1),
  storage: z.string().min(1),
  display: z.string().min(1),
  gpu: z.string().optional(),
  battery: z.string().optional(),
  weight: z.number().optional(),
  os: z.string().min(1),
  featured: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brand = searchParams.get('brand');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    const where: any = {};

    if (brand) where.brand = brand;
    if (featured === 'true') where.featured = true;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { [sort]: order },
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const data = productSchema.parse(body);

    const product = await prisma.product.create({
      data,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}