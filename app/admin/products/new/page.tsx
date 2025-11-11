import ProductForm from '../_components/ProductForm';

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
        <p className="mt-1 text-gray-600">Fill out the details below to add a new laptop to your store.</p>
      </div>
      <ProductForm />
    </div>
  );
}