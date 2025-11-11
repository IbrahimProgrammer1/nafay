'use client'

import React, { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Home, Package } from 'lucide-react'
import Spinner from '@/../components/Spinner'

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  if (!orderId) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">Looking for your order...</h1>
        <p className="mt-2 text-gray-500">No order ID found in the URL.</p>
      </div>
    )
  }

  return (
    <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg text-center max-w-2xl mx-auto">
      <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Thank You For Your Order!</h1>
      <p className="mt-4 text-lg text-gray-600">
        Your order has been placed successfully. A confirmation email has been sent to you.
      </p>
      <div className="mt-8 bg-gray-50 border border-dashed border-gray-300 rounded-lg py-4 px-6 inline-block">
        <p className="text-sm text-gray-500">Your Order Number is:</p>
        <p className="text-2xl font-mono font-bold text-primary-600 tracking-wider mt-1">{orderId}</p>
      </div>
      <p className="mt-8 text-gray-500">
        You can track the status of your order in the &quot;My Orders&quot; section if you have an account.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link href="/">
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-primary-700 transition-colors">
            <Home size={18} />
            Back to Home
          </button>
        </Link>
        {/* Optional: Link to an "My Orders" page */}
        {/* <Link href="/account/orders">
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 border border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-md hover:bg-gray-100 transition-colors">
            <Package size={18} />
            View My Orders
          </button>
        </Link> */}
      </div>
    </div>
  )
}


export default function OrderSuccessPage() {
    return (
        <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center p-4">
            <Suspense fallback={<div className="flex justify-center items-center h-full"><Spinner className="h-12 w-12"/></div>}>
                <OrderSuccessContent />
            </Suspense>
        </div>
    )
}