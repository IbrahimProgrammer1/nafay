'use client'

import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { type Product } from '@prisma/client';
import Image from 'next/image';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Upload, X, Loader2 } from 'lucide-react';
import { type State, createProductAction, updateProductAction } from '../_actions';

const productFormSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  brand: z.string().min(2, 'Brand is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().positive('Price must be a positive number'),
  stock: z.coerce.number().int().nonnegative('Stock must be a non-negative integer'),
  processor: z.string().min(1, 'Processor is required'),
  ram: z.string().min(1, 'RAM is required'),
  storage: z.string().min(1, 'Storage is required'),
  display: z.string().min(1, 'Display is required'),
  gpu: z.string().optional(),
  battery: z.string().optional(),
  weight: z.coerce.number().optional(),
  os: z.string().min(1, 'OS is required'),
  featured: z.boolean(),
});

type ProductFormData = z.infer<typeof productFormSchema>;

type ProductFormProps = {
  product?: Product | null;
};

export default function ProductForm({ product }: ProductFormProps) {
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [isUploading, setIsUploading] = useState(false);

  const action = product ? updateProductAction.bind(null, product.id) : createProductAction;
  const [state, formAction] = useFormState(action, { message: null, errors: {} });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name || '',
      brand: product?.brand || '',
      description: product?.description || '',
      price: product?.price || 0,
      stock: product?.stock || 0,
      processor: product?.processor || '',
      ram: product?.ram || '',
      storage: product?.storage || '',
      display: product?.display || '',
      os: product?.os || '',
      gpu: product?.gpu || '',
      battery: product?.battery || '',
      weight: product?.weight || 0,
      featured: product?.featured ?? false,
    },
  });

  useEffect(() => {
    if (state.message && !state.errors) {
        // A success message from the server action is not needed here
        // as we redirect on success. This handles potential success messages without errors.
    }
    if (state.message && state.errors) {
      toast.error(state.message);
    }
  }, [state]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true);
    const uploadedImageUrls: string[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await axios.post('/api/upload', formData);
        uploadedImageUrls.push(res.data.url);
      } catch (error) {
        toast.error('Image upload failed. Please try again.');
        console.error(error);
      }
    }
    setImages((prev) => [...prev, ...uploadedImageUrls]);
    setIsUploading(false);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };
  
  return (
    <form action={formAction} className="space-y-8">
      {/* Product Images Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Product Images</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 mb-4">
          {images.map((url, index) => (
            <div key={index} className="relative aspect-square">
              <Image src={url} alt={`Product image ${index + 1}`} fill className="rounded-md object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                <X size={14} />
              </button>
              <input type="hidden" name="images" value={url} />
            </div>
          ))}
          <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
            {isUploading ? <Loader2 className="animate-spin h-8 w-8 text-gray-400" /> : <Upload className="h-8 w-8 text-gray-400" />}
            <span className="mt-2 text-xs text-gray-500">Upload</span>
            <input type="file" multiple onChange={handleImageUpload} className="hidden" disabled={isUploading}/>
          </label>
        </div>
        {state.errors?.images && <p className="text-sm text-red-500">{state.errors.images[0]}</p>}
      </div>

      {/* Main Product Details */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Product Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input {...register('name')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                {(errors.name || state.errors?.name) && <p className="text-sm text-red-500 mt-1">{errors.name?.message || state.errors?.name?.[0]}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Brand</label>
                <input {...register('brand')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                {(errors.brand || state.errors?.brand) && <p className="text-sm text-red-500 mt-1">{errors.brand?.message || state.errors?.brand?.[0]}</p>}
            </div>
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea {...register('description')} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                {(errors.description || state.errors?.description) && <p className="text-sm text-red-500 mt-1">{errors.description?.message || state.errors?.description?.[0]}</p>}
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input type="number" step="0.01" {...register('price')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                {(errors.price || state.errors?.price) && <p className="text-sm text-red-500 mt-1">{errors.price?.message || state.errors?.price?.[0]}</p>}
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Stock</label>
                <input type="number" {...register('stock')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                {(errors.stock || state.errors?.stock) && <p className="text-sm text-red-500 mt-1">{errors.stock?.message || state.errors?.stock?.[0]}</p>}
            </div>
        </div>
      </div>
      
      {/* Specifications */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {['processor', 'ram', 'storage', 'display', 'gpu', 'battery', 'weight', 'os'].map(field => (
                <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 capitalize">{field}</label>
                    <input type={field === 'weight' ? 'number' : 'text'} step="0.01" {...register(field as any)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    {errors[field as keyof ProductFormData] && <p className="text-sm text-red-500 mt-1">{errors[field as keyof ProductFormData]?.message}</p>}
                </div>
           ))}
        </div>
      </div>

      {/* Featured Status */}
       <div className="bg-white p-6 rounded-lg shadow-sm">
          <label className="flex items-center">
            <input type="checkbox" {...register('featured')} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
            <span className="ml-3 text-sm font-medium text-gray-700">Mark as featured product</span>
          </label>
      </div>

      <div className="flex justify-end gap-4">
        <button type="button" onClick={() => reset()} className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
          Reset
        </button>
        <button type="submit" disabled={isSubmitting || isUploading} className="px-6 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 disabled:bg-gray-400">
          {isSubmitting ? 'Saving...' : (product ? 'Save Changes' : 'Create Product')}
        </button>
      </div>
    </form>
  );
}