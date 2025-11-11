'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useCart } from '@/../context/CartContext'
import Spinner from '@/../components/Spinner'
import { formatPrice } from '@/../lib/utils';

const shippingSchema = z.object({
  customerName: z.string().min(2, 'Full name is required'),
  customerEmail: z.string().email('Invalid email address'),
  customerPhone: z.string().min(10, 'Phone number must be at least 10 digits'),
  shippingAddress: z.string().min(5, 'Street address is required'),
  shippingCity: z.string().min(2, 'City is required'),
  shippingCountry: z.string().min(2, 'Country is required'),
  shippingZip: z.string().min(4, 'ZIP code is required'),
  paymentMethod: z.enum(['credit_card', 'paypal', 'cash_on_delivery'], {
    required_error: 'Please select a payment method',
  }),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (items.length === 0 && !loading) {
      toast.error("Your cart is empty. Redirecting...");
      router.push('/cart');
    }
  }, [items, router, loading]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
  });

  const onSubmit: SubmitHandler<ShippingFormData> = async (data) => {
    setLoading(true);
    try {
      const orderPayload = {
        ...data,
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      };
      
      const response = await axios.post('/api/orders', orderPayload);
      
      toast.success('Order placed successfully!');
      clearCart();
      router.push(`/order-success?orderId=${response.data.orderNumber}`);

    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.response?.data?.error || 'Failed to place order.');
    }
  };

  if (items.length === 0) {
    return <div className="flex justify-center items-center h-screen"><Spinner className="h-12 w-12"/></div>;
  }
  
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Checkout</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Shipping Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input {...register('customerName')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
                {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" {...register('customerEmail')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
                {errors.customerEmail && <p className="text-red-500 text-xs mt-1">{errors.customerEmail.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input {...register('customerPhone')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
                {errors.customerPhone && <p className="text-red-500 text-xs mt-1">{errors.customerPhone.message}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input {...register('shippingAddress')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
                {errors.shippingAddress && <p className="text-red-500 text-xs mt-1">{errors.shippingAddress.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input {...register('shippingCity')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
                {errors.shippingCity && <p className="text-red-500 text-xs mt-1">{errors.shippingCity.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Country</label>
                <input {...register('shippingCountry')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
                {errors.shippingCountry && <p className="text-red-500 text-xs mt-1">{errors.shippingCountry.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                <input {...register('shippingZip')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
                {errors.shippingZip && <p className="text-red-500 text-xs mt-1">{errors.shippingZip.message}</p>}
              </div>
            </div>

            <h2 className="text-xl font-semibold pt-4">Payment Method</h2>
            <div className="space-y-2">
                {['credit_card', 'paypal', 'cash_on_delivery'].map(method => (
                    <label key={method} className="flex items-center p-3 border rounded-md cursor-pointer has-[:checked]:bg-primary-50 has-[:checked]:border-primary-500">
                        <input type="radio" {...register('paymentMethod')} value={method} className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500" />
                        <span className="ml-3 block text-sm font-medium text-gray-700 capitalize">{method.replace('_', ' ')}</span>
                    </label>
                ))}
                {errors.paymentMethod && <p className="text-red-500 text-xs mt-1">{errors.paymentMethod.message}</p>}
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400"
              >
                {loading ? <Spinner className="h-6 w-6"/> : `Place Order - ${formatPrice(getTotal() * 1.1)}`}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}