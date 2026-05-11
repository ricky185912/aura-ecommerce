'use client';

import Link from 'next/link';
import { ArrowRightIcon, SparklesIcon, ShieldCheckIcon, TruckIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-10 sm:py-12 md:py-16 lg:py-20 xl:py-28">
      <div className="absolute top-20 -left-32 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-raspberry-100/30 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 -right-32 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-green-100/30 rounded-full blur-3xl animate-float delay-1000" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 glass-card px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-5 sm:mb-6 md:mb-8 animate-scale-in">
            <SparklesIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-raspberry-500" />
            <span className="text-xs sm:text-sm font-medium text-raspberry-600">Welcome to AURA</span>
          </div>
          
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight animate-fade-up">
            <span className="gradient-text">Luxury Delivered,</span>
            <br />
            <span className="text-gray-800">In Minutes</span>
          </h1>
          
          <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl text-cream-700 mb-5 sm:mb-6 md:mb-8 lg:mb-10 max-w-2xl mx-auto leading-relaxed px-2 sm:px-4 animate-fade-up delay-100">
            Experience premium fashion, skincare, and haircare delivered to your doorstep with elegance and speed.
          </p>
          
          <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 md:gap-4 justify-center animate-fade-up delay-200 px-4 xs:px-0">
            <Link href="/products" className="btn-primary inline-flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base py-2 sm:py-2.5 md:py-3 px-4 sm:px-5 md:px-6">
              Shop Now
              <ArrowRightIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/new" className="btn-outline inline-flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base py-2 sm:py-2.5 md:py-3 px-4 sm:px-5 md:px-6">
              <SparklesIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
              New Arrivals
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 mt-8 sm:mt-10 md:mt-12 lg:mt-16 pt-4 sm:pt-5 md:pt-6 lg:pt-8 border-t border-cream-200 animate-fade-up delay-300">
            <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 text-cream-700">
              <TruckIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 text-raspberry-500" />
              <span className="text-[10px] xs:text-xs sm:text-sm">Free Shipping over $50</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 text-cream-700">
              <ShieldCheckIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 text-green-600" />
              <span className="text-[10px] xs:text-xs sm:text-sm">2 Year Warranty</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 text-cream-700">
              <ClockIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 text-raspberry-500" />
              <span className="text-[10px] xs:text-xs sm:text-sm">Express Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}