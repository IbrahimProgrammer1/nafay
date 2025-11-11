'use server'

import { z } from 'zod';
import { prisma } from '@/../lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Define the Zod schema for product validation
const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  brand: z.string().min(2, 'Brand is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().positive('Price must be a positive number'),
  stock: z.coerce.number().int().nonnegative('Stock must be a non-negative integer'),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  processor: z.string().min(1, 'Processor is required'),
  ram: z.string().min(1, 'RAM is required'),
  storage: z.string().min(1, 'Storage is required'),
  display: z.string().min(1, 'Display is required'),
  gpu: z.string().optional(),
  battery: z.string().optional(),
  weight: z.coerce.number().optional(),
  os: z.string().min(1, 'OS is required'),
  featured: z.preprocess((val) => val === 'on' || val === true, z.boolean()),
});

// Type for state management in the form component
export type State = {
  errors?: {
    [key: string]: string[];
  } | undefined;
  message?: string | null;
};

// CREATE PRODUCT ACTION
export async function createProductAction(prevState: State, formData: FormData): Promise<State> {
    const validatedFields = productSchema.safeParse({
        name: formData.get('name'),
        brand: formData.get('brand'),
        description: formData.get('description'),
        price: formData.get('price'),
        stock: formData.get('stock'),
        images: formData.getAll('images'),
        processor: formData.get('processor'),
        ram: formData.get('ram'),
        storage: formData.get('storage'),
        display: formData.get('display'),
        gpu: formData.get('gpu'),
        battery: formData.get('battery'),
        weight: formData.get('weight'),
        os: formData.get('os'),
        featured: formData.get('featured'),
    });

    if (!validatedFields.success) {
        return { errors: validatedFields.error.flatten().fieldErrors };
    }

    try {
        await prisma.product.create({ data: validatedFields.data });
    } catch (error) {
        return { message: 'Database Error: Failed to create product.' };
    }

    revalidatePath('/admin/products');
    redirect('/admin/products');
}

// UPDATE PRODUCT ACTION
export async function updateProductAction(productId: string, prevState: State, formData: FormData): Promise<State> {
    const validatedFields = productSchema.safeParse({
        name: formData.get('name'),
        brand: formData.get('brand'),
        description: formData.get('description'),
        price: formData.get('price'),
        stock: formData.get('stock'),
        images: formData.getAll('images'),
        processor: formData.get('processor'),
        ram: formData.get('ram'),
        storage: formData.get('storage'),
        display: formData.get('display'),
        gpu: formData.get('gpu'),
        battery: formData.get('battery'),
        weight: formData.get('weight'),
        os: formData.get('os'),
        featured: formData.get('featured'),
    });

    if (!validatedFields.success) {
        return { errors: validatedFields.error.flatten().fieldErrors };
    }

    try {
        await prisma.product.update({ where: { id: productId }, data: validatedFields.data });
    } catch (error) {
        return { message: 'Database Error: Failed to update product.' };
    }

    revalidatePath('/admin/products');
    revalidatePath(`/products/${productId}`);
    redirect('/admin/products');
}


// DELETE PRODUCT ACTION
export async function deleteProductAction(formData: FormData): Promise<void> {
  const productId = formData.get('productId') as string;

  if (!productId) {
    throw new Error('Product ID not found');
  }

  try {
    // Note: In a real app, you would also delete associated images from Cloudinary here.
    await prisma.product.delete({
      where: { id: productId },
    });
    revalidatePath('/admin/products');
  } catch (error) {
    throw new Error('Database Error: Failed to delete product.');
  }
}