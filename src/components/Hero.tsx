'use client';

import Link from 'next/link';
import { ArrowRightIcon, SparklesIcon, ShieldCheckIcon, TruckIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[85vh] sm:min-h-[90vh] flex items-center">
      {/* Animated Background Elements */}
      <div className="absolute top-20 -left-32 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-raspberry-100/30 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 -right-32 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-green-100/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-96 sm:h-96 bg-raspberry-50/20 rounded-full blur-3xl animate-pulse" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/60 backdrop-blur-sm border border-cream-200 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-5 sm:mb-6 md:mb-8 animate-scale-in shadow-sm">
            <SparklesIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-raspberry-500" />
            <span className="text-xs sm:text-sm font-medium text-raspberry-600">Welcome to AURA — Luxury Reimagined</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 md:mb-8 leading-[1.2] animate-fade-up">
            <span className="bg-gradient-to-r from-raspberry-600 to-green-600 bg-clip-text text-transparent">
              Luxury Delivered,
            </span>
            <br />
            <span className="text-gray-800">
              In Minutes
            </span>
          </h1>
          
          {/* Description */}
          <p className="text-sm xs:text-base sm:text-lg md:text-xl text-cream-700 mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed px-4 animate-fade-up" style={{ animationDelay: '100ms' }}>
            Experience premium fashion, skincare, and haircare delivered to your doorstep with elegance and speed. Curated just for you.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center animate-fade-up px-4" style={{ animationDelay: '200ms' }}>
            <Link 
              href="/products" 
              className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-raspberry-500 to-raspberry-600 text-white font-semibold py-3 sm:py-3.5 px-6 sm:px-8 rounded-full text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Shop Now
              <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link 
              href="/new" 
              className="group inline-flex items-center justify-center gap-2 bg-white/80 backdrop-blur-sm border-2 border-raspberry-200 text-raspberry-600 font-semibold py-3 sm:py-3.5 px-6 sm:px-8 rounded-full text-sm sm:text-base hover:bg-raspberry-50 hover:border-raspberry-400 hover:scale-105 transition-all duration-300 shadow-sm"
            >
              <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              New Arrivals
            </Link>
          </div>

          {/* Features Grid */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 mt-10 sm:mt-12 md:mt-16 lg:mt-20 pt-6 sm:pt-8 border-t border-cream-200 animate-fade-up" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-2 sm:gap-2.5 text-cream-700 group hover:scale-105 transition-transform duration-300">
              <div className="p-1.5 sm:p-2 rounded-full bg-raspberry-50 group-hover:bg-raspberry-100 transition-colors">
                <TruckIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-raspberry-500" />
              </div>
              <span className="text-[11px] xs:text-xs sm:text-sm font-medium">Free Shipping over $50</span>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-2.5 text-cream-700 group hover:scale-105 transition-transform duration-300">
              <div className="p-1.5 sm:p-2 rounded-full bg-green-50 group-hover:bg-green-100 transition-colors">
                <ShieldCheckIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-green-600" />
              </div>
              <span className="text-[11px] xs:text-xs sm:text-sm font-medium">2 Year Warranty</span>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-2.5 text-cream-700 group hover:scale-105 transition-transform duration-300">
              <div className="p-1.5 sm:p-2 rounded-full bg-raspberry-50 group-hover:bg-raspberry-100 transition-colors">
                <ClockIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-raspberry-500" />
              </div>
              <span className="text-[11px] xs:text-xs sm:text-sm font-medium">Express Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}