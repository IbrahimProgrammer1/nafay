import { prisma } from '@/../lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { formatPrice } from '@/../lib/utils';
import { deleteProductAction } from '../products/_actions';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-gray-600">Manage all products in your store.</p>
        </div>
        <Link href="/admin/products/new">
          <button className="flex items-center gap-2 bg-primary-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-primary-700 transition-colors">
            <PlusCircle size={20} />
            Add New Product
          </button>
        </Link>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Image</th>
              <th scope="col" className="px-6 py-3">Product Name</th>
              <th scope="col" className="px-6 py-3">Brand</th>
              <th scope="col" className="px-6 py-3">Price</th>
              <th scope="col" className="px-6 py-3">Stock</th>
              <th scope="col" className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <Image
                    src={product.images[0] || '/placeholder.jpg'}
                    alt={product.name}
                    width={50}
                    height={50}
                    className="rounded-md object-cover"
                  />
                </td>
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {product.name}
                </th>
                <td className="px-6 py-4">{product.brand}</td>
                <td className="px-6 py-4">{formatPrice(product.price)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.stock > 10 ? 'bg-green-100 text-green-800' :
                    product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-4">
                    <Link href={`/admin/products/edit/${product.id}`}>
                        <button className="text-primary-600 hover:text-primary-800"><Edit size={18} /></button>
                    </Link>
                    <form action={deleteProductAction}>
                        <input type="hidden" name="productId" value={product.id} />
                        <button type="submit" className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
            <div className="text-center py-12 text-gray-500">
                <p>No products found. Add your first product to get started!</p>
            </div>
        )}
      </div>
    </div>
  );
}