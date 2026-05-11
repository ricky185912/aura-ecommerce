'use client';

import Link from 'next/link';
import Image from 'next/image';
import { TrashIcon, ShoppingBagIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { useCartStore } from '@/store/cartStore';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();
  const shipping = subtotal > 500 ? 0 : 10;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBagIcon className="w-16 h-16 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven&apos;t added anything yet</p>
          <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-raspberry-600 text-white rounded-full font-medium hover:bg-raspberry-700 transition-all shadow-lg shadow-raspberry-600/20">
            Start Shopping
            <ShoppingBagIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-green-dark-100 overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-green-dark-100 text-sm font-medium text-gray-600">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>
              
              {items.map((item) => (
                <div key={item.id} className="flex flex-col md:grid md:grid-cols-12 gap-4 p-4 border-b border-green-dark-100 last:border-0">
                  <div className="flex gap-4 col-span-6">
                    <div className="relative w-20 h-20 bg-raspberry-50 rounded-xl overflow-hidden flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-500">Size: M</p>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-sm text-red-500 hover:text-red-600 mt-2 inline-flex items-center gap-1"
                      >
                        <TrashIcon className="w-3 h-3" />
                        Remove
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between md:justify-center col-span-2">
                    <span className="md:hidden text-gray-600 text-sm">Price:</span>
                    <span className="font-semibold text-gray-900">${item.price}</span>
                  </div>
                  
                  <div className="flex items-center justify-between md:justify-center col-span-2">
                    <span className="md:hidden text-gray-600 text-sm">Quantity:</span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-green-dark-200 hover:border-raspberry-300 hover:bg-raspberry-50 transition-all flex items-center justify-center"
                      >
                        <MinusIcon className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-green-dark-200 hover:border-raspberry-300 hover:bg-raspberry-50 transition-all flex items-center justify-center"
                      >
                        <PlusIcon className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between md:justify-end col-span-2">
                    <span className="md:hidden text-gray-600 text-sm">Total:</span>
                    <span className="font-bold text-raspberry-600">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-green-dark-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.reduce((sum, i) => sum + i.quantity, 0)} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping}`}</span>
                </div>
                <div className="border-t border-green-dark-100 pt-3">
                  <div className="flex justify-between font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-raspberry-600 text-xl">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <Link href="/checkout">
                <button className="w-full py-3 bg-raspberry-600 text-white rounded-full font-medium hover:bg-raspberry-700 transition-all shadow-lg shadow-raspberry-600/20">
                  Proceed to Checkout
                </button>
              </Link>
              
              <Link href="/products" className="block text-center text-sm text-gray-500 mt-4 hover:text-raspberry-600 transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}