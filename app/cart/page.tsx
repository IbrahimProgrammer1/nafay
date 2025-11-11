'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/../context/CartContext'
import { formatPrice } from '@/../lib/utils'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCart()
  const router = useRouter()

  const subtotal = getTotal()
  const shippingCost = 0 // Or implement your shipping logic
  const tax = subtotal * 0.1 // Example 10% tax
  const total = subtotal + shippingCost + tax

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <ShoppingBag className="h-24 w-24 text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800">Your Cart is Empty</h1>
        <p className="mt-2 text-gray-500">Looks like you haven&apos;t added anything to your cart yet.</p>
        <Link href="/products">
          <button className="mt-6 bg-primary-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-primary-700 transition-colors">
            Continue Shopping
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-8 bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
                <h2 className="text-lg font-medium text-gray-900">Products</h2>
                <button onClick={clearCart} className="text-sm font-medium text-red-500 hover:text-red-700 transition">Clear all</button>
            </div>
            
            <ul role="list" className="divide-y divide-gray-200">
              {items.map((item) => (
                <li key={item.id} className="flex py-6">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>
                          <Link href={`/products/${item.id}`}>{item.name}</Link>
                        </h3>
                        <p className="ml-4">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <div className="flex items-center border rounded-md">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-l-md"><Minus size={16} /></button>
                        <span className="px-4 font-semibold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-r-md"><Plus size={16} /></button>
                      </div>
                      <div className="flex">
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="font-medium text-primary-600 hover:text-primary-500 flex items-center gap-1"
                        >
                          <Trash2 size={16}/> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
              <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Subtotal</p>
                  <p className="text-sm font-medium text-gray-900">{formatPrice(subtotal)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Shipping</p>
                  <p className="text-sm font-medium text-gray-900">{shippingCost > 0 ? formatPrice(shippingCost) : 'Free'}</p>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-600">Tax estimate</p>
                  <p className="text-sm font-medium text-gray-900">{formatPrice(tax)}</p>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <p className="text-base font-medium text-gray-900">Order total</p>
                  <p className="text-base font-medium text-gray-900">{formatPrice(total)}</p>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700"
                >
                  Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5"/>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}