import { prisma } from '@/../lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { ShieldCheck, Truck, RotateCw } from 'lucide-react';
import { formatPrice } from '@/../lib/utils';
import AddToCartButton from '@/../components/AddToCartButton';

export const dynamic = 'force-dynamic';

type ProductPageProps = {
  params: {
    id: string;
  };
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = params;
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  const specDetails = [
    { label: 'Processor', value: product.processor },
    { label: 'RAM', value: product.ram },
    { label: 'Storage', value: product.storage },
    { label: 'Display', value: product.display },
    { label: 'Graphics', value: product.gpu },
    { label: 'OS', value: product.os },
    { label: 'Battery', value: product.battery },
    { label: 'Weight', value: product.weight ? `${product.weight} kg` : null },
  ];

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Image Gallery */}
          <div className="sticky top-24">
            <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            {/* Optional: Add thumbnail images here */}
          </div>

          {/* Product Info */}
          <div>
            <p className="text-sm font-medium text-primary-600">{product.brand}</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-4">
              <p className="text-3xl text-gray-900">{formatPrice(product.price)}</p>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="text-base text-gray-700 space-y-4">
                <p>{product.description}</p>
              </div>
            </div>

            <div className="mt-8">
                {product.stock > 0 ? (
                    <p className="text-sm text-green-600 font-semibold">In Stock ({product.stock} available)</p>
                ) : (
                    <p className="text-sm text-red-600 font-semibold">Out of Stock</p>
                )}
            </div>

            {/* Add to Cart Button */}
            {product.stock > 0 && (
                <div className="mt-8">
                    <AddToCartButton product={product} />
                </div>
            )}

            {/* Highlights */}
            <div className="mt-10 border-t border-gray-200 pt-8">
              <h3 className="text-sm font-medium text-gray-900">Highlights</h3>
              <div className="mt-4 prose prose-sm text-gray-500">
                <ul role="list">
                  {specDetails.filter(spec => spec.value).map(spec => (
                    <li key={spec.label}>{spec.label}: <strong>{spec.value}</strong></li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Policies */}
            <section className="mt-10">
              <h3 className="sr-only">Policies</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <Truck className="mx-auto h-6 w-6 text-gray-500"/>
                      <p className="mt-2 text-sm text-gray-600">Free Shipping</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <ShieldCheck className="mx-auto h-6 w-6 text-gray-500"/>
                      <p className="mt-2 text-sm text-gray-600">1 Year Warranty</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <RotateCw className="mx-auto h-6 w-6 text-gray-500"/>
                      <p className="mt-2 text-sm text-gray-600">30-Day Returns</p>
                  </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}