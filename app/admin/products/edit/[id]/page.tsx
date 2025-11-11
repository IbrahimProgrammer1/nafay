import { prisma } from '@/../lib/prisma';
import { notFound } from 'next/navigation';
import ProductForm from '../../_components/ProductForm';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
  });

  if (!product) {
    return notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        <p className="mt-1 text-gray-600">Update the details for &quot;{product.name}&quot;.</p>
      </div>
      <ProductForm product={product} />
    </div>
  );
}