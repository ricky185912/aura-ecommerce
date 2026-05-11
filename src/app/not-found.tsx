'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeftIcon, HomeIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-raspberry-50 via-white to-green-dark-50 flex items-center justify-center px-4 py-20">
      
      {/* Floating Decorations */}
      <div className="fixed top-20 right-10 w-48 h-48 opacity-5 pointer-events-none">
        <div className="w-full h-full bg-raspberry-500 rounded-full blur-3xl animate-pulse" />
      </div>
      <div className="fixed bottom-20 left-10 w-64 h-64 opacity-5 pointer-events-none">
        <div className="w-full h-full bg-green-dark-600 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-2xl mx-auto text-center">
        {/* Animated 404 Number */}
        <div className="relative mb-8">
          <div className="text-[120px] sm:text-[180px] md:text-[220px] font-black leading-none tracking-tighter select-none">
            <span className="bg-gradient-to-r from-raspberry-600 via-raspberry-500 to-green-dark-600 bg-clip-text text-transparent animate-pulse">
              4
            </span>
            <span className="bg-gradient-to-r from-raspberry-500 via-green-dark-500 to-raspberry-600 bg-clip-text text-transparent animate-pulse delay-150">
              0
            </span>
            <span className="bg-gradient-to-r from-green-dark-600 via-raspberry-600 to-raspberry-500 bg-clip-text text-transparent animate-pulse delay-300">
              4
            </span>
          </div>
          
          {/* Decorative Circles */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 sm:w-60 sm:h-60 md:w-80 md:h-80">
            <div className="absolute inset-0 border-2 border-raspberry-200 rounded-full animate-ping opacity-20" />
            <div className="absolute inset-4 border-2 border-green-dark-200 rounded-full animate-ping delay-300 opacity-20" />
            <div className="absolute inset-8 border-2 border-raspberry-300 rounded-full animate-ping delay-700 opacity-20" />
          </div>
        </div>

        {/* Message */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-raspberry-100 text-raspberry-700 px-4 py-2 rounded-full text-sm mb-6 animate-bounce">
            🧐 Oops!
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          
          <p className="text-gray-500 mb-8 text-base sm:text-lg max-w-md mx-auto">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or doesn&apos;t exist.
          </p>

          {/* Search Suggestions */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-green-dark-100">
            <p className="text-sm text-gray-600 mb-3">You might be looking for:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link href="/products" className="px-3 py-1.5 bg-white rounded-full text-sm text-gray-700 border border-green-dark-200 hover:border-raspberry-300 hover:text-raspberry-600 transition-all">
                All Products
              </Link>
              <Link href="/new" className="px-3 py-1.5 bg-white rounded-full text-sm text-gray-700 border border-green-dark-200 hover:border-raspberry-300 hover:text-raspberry-600 transition-all">
                New Arrivals
              </Link>
              <Link href="/trending" className="px-3 py-1.5 bg-white rounded-full text-sm text-gray-700 border border-green-dark-200 hover:border-raspberry-300 hover:text-raspberry-600 transition-all">
                Trending
              </Link>
              <Link href="/category/mens-fashion" className="px-3 py-1.5 bg-white rounded-full text-sm text-gray-700 border border-green-dark-200 hover:border-raspberry-300 hover:text-raspberry-600 transition-all">
                Men&apos;s Fashion
              </Link>
              <Link href="/category/womens-fashion" className="px-3 py-1.5 bg-white rounded-full text-sm text-gray-700 border border-green-dark-200 hover:border-raspberry-300 hover:text-raspberry-600 transition-all">
                Women&apos;s Fashion
              </Link>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-raspberry-600 text-white rounded-full font-medium hover:bg-raspberry-700 transition-all shadow-lg shadow-raspberry-600/20 group"
            >
              <HomeIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Back to Home
            </Link>
            
            <Link 
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-full font-medium border border-green-dark-200 hover:border-raspberry-300 hover:text-raspberry-600 transition-all group"
            >
              <ShoppingBagIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Continue Shopping
            </Link>
          </div>

          {/* Help Text */}
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-400">
            <ArrowLeftIcon className="w-3 h-3" />
            <span>Or use the navigation menu to find what you need</span>
          </div>
        </div>
      </div>

      {/* Decorative Brand Logo */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-30">
        <div className="flex items-center gap-2">
          <div className="relative w-6 h-6">
            <Image
              src="/logo.jpeg"
              alt="AURA Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-xs text-gray-400">AURA</span>
        </div>
      </div>
    </div>
  );
}