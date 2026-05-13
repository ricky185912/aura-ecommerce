'use client';

import Link from 'next/link';
import Image from 'next/image';
import { TrashIcon, ShoppingBagIcon, PlusIcon, MinusIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useCartStore } from '@/store/cartStore';
import Hero from '@/components/Hero';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();
  
  // Direct INR values - no conversion
  const subtotalINR = subtotal;
  const shippingINR = subtotalINR > 4250 ? 0 : 150;
  const totalINR = subtotalINR + shippingINR;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white">
        <Hero />
        <div className="flex items-center justify-center py-16 sm:py-20 px-4">
          <div className="text-center max-w-md mx-auto">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBagIcon className="w-12 h-12 sm:w-16 sm:h-16 text-cream-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-sm sm:text-base text-cream-700 mb-6">Looks like you haven&apos;t added anything yet</p>
            <Link 
              href="/products" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-raspberry-600 to-raspberry-700 text-white rounded-full font-medium hover:shadow-lg transition-all duration-300 group"
            >
              Start Shopping
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white">
      <Hero />
      
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 sm:mb-8">Shopping Cart</h1>
          
          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-cream-200 overflow-hidden">
                {/* Header - Desktop */}
                <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-cream-50 border-b border-cream-200 text-sm font-medium text-cream-700">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>
                
                {/* Cart Items List */}
                {items.map((item) => {
                  const itemTotal = item.price * item.quantity;
                  
                  return (
                    <div key={item.id} className="flex flex-col md:grid md:grid-cols-12 gap-4 p-4 border-b border-cream-200 last:border-0 hover:bg-cream-50/30 transition-colors">
                      {/* Product Info */}
                      <div className="flex gap-4 col-span-6">
                        <div className="relative w-20 h-20 bg-gradient-to-br from-cream-100 to-cream-50 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                          {item.image ? (
                            <Image 
                              src={item.image} 
                              alt={item.name} 
                              fill 
                              className="object-cover" 
                              sizes="80px"
                              unoptimized
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <ShoppingBagIcon className="w-8 h-8 text-cream-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-0.5 text-sm sm:text-base line-clamp-1">{item.name}</h3>
                          <p className="text-xs text-cream-600 mb-1">{item.category || 'Premium Product'}</p>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-xs text-red-500 hover:text-red-600 inline-flex items-center gap-1 transition-colors"
                          >
                            <TrashIcon className="w-3 h-3" />
                            Remove
                          </button>
                        </div>
                      </div>
                      
                      {/* Price */}
                      <div className="flex items-center justify-between md:justify-center col-span-2">
                        <span className="md:hidden text-xs text-cream-600">Price:</span>
                        <span className="font-semibold text-gray-800 text-sm">₹{item.price.toLocaleString('en-IN')}</span>
                      </div>
                      
                      {/* Quantity */}
                      <div className="flex items-center justify-between md:justify-center col-span-2">
                        <span className="md:hidden text-xs text-cream-600">Quantity:</span>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-cream-200 hover:border-raspberry-300 hover:bg-raspberry-50 transition-all flex items-center justify-center"
                          >
                            <MinusIcon className="w-3 h-3 text-gray-600" />
                          </button>
                          <span className="text-sm font-medium w-8 text-center text-gray-800">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-cream-200 hover:border-raspberry-300 hover:bg-raspberry-50 transition-all flex items-center justify-center"
                          >
                            <PlusIcon className="w-3 h-3 text-gray-600" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Total */}
                      <div className="flex items-center justify-between md:justify-end col-span-2">
                        <span className="md:hidden text-xs text-cream-600">Total:</span>
                        <span className="font-bold text-raspberry-600 text-sm sm:text-base">₹{itemTotal.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Continue Shopping Link */}
              <Link 
                href="/products" 
                className="inline-flex items-center gap-2 text-sm text-cream-700 hover:text-raspberry-600 mt-4 transition-colors group"
              >
                <ArrowRightIcon className="w-3 h-3 rotate-180 group-hover:-translate-x-1 transition-transform" />
                Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-cream-200 p-5 sm:p-6 sticky top-24">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm text-cream-700">
                    <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                    <span className="font-medium text-gray-800">₹{subtotalINR.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-cream-700">
                    <span>Shipping</span>
                    <span className="font-medium text-gray-800">
                      {shippingINR === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `₹${shippingINR.toLocaleString('en-IN')}`
                      )}
                    </span>
                  </div>
                  
                  {subtotalINR < 4250 && (
                    <div className="bg-raspberry-50 rounded-lg p-3 text-xs text-raspberry-700">
                      <p>Add ₹{(4250 - subtotalINR).toLocaleString('en-IN')} more to get free shipping!</p>
                    </div>
                  )}
                  
                  <div className="border-t border-cream-200 pt-3 mt-3">
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-800">Total</span>
                      <span className="font-bold text-raspberry-600 text-xl">₹{totalINR.toLocaleString('en-IN')}</span>
                    </div>
                    <p className="text-xs text-cream-600 mt-1">Inclusive of all taxes</p>
                  </div>
                </div>
                
                <Link href="/checkout">
                  <button className="w-full py-3 bg-gradient-to-r from-raspberry-600 to-raspberry-700 text-white rounded-full font-medium hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
                    Proceed to Checkout
                  </button>
                </Link>
                
                <div className="mt-4 text-center text-xs text-cream-600">
                  <p>Secure payment • Easy returns • 24/7 support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}