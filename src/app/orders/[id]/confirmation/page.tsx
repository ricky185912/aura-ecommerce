'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.id;

  return (
    <div className="min-h-screen flex items-center justify-center py-20">
      <div className="container max-w-md mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-green-dark-100 p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-500 mb-4">Thank you for your purchase</p>
          <p className="text-sm text-gray-400 mb-6">Order #{orderId}</p>
          
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-600">We&apos;ve sent a confirmation email to your registered email address.</p>
          </div>
          
          <div className="flex flex-col gap-3">
            <Link href={`/orders/${orderId}`}>
              <button className="w-full py-3 bg-raspberry-600 text-white rounded-full font-medium hover:bg-raspberry-700 transition-all">
                Track Order
              </button>
            </Link>
            <Link href="/products">
              <button className="w-full py-3 bg-white text-gray-900 rounded-full font-medium border border-green-dark-200 hover:border-raspberry-300 transition-all">
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}