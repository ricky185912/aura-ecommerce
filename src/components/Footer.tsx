'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden">
      {/* Gradient Background - Raspberry Dominant */}
      <div className="absolute inset-0 bg-gradient-to-br from-raspberry-800 via-raspberry-700 to-green-800" />
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 1px)`,
        backgroundSize: '24px 24px'
      }} />
      
      <div className="relative z-10 container mx-auto px-4 py-8 sm:py-10 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 mb-8 sm:mb-10">
          
          {/* Brand Column */}
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-white/20 rounded-xl blur-lg" />
                <Image
                  src="/logo.jpeg"
                  alt="AURA Logo"
                  width={40}
                  height={40}
                  className="relative object-contain rounded-xl bg-white/10 p-1"
                />
              </div>
              <div>
                <span className="text-xl font-bold text-white">AURA</span>
                <div className="text-[10px] tracking-wider text-white/60">LUXURY DELIVERY</div>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-white/70 mb-4 leading-relaxed">
              Premium fashion & beauty delivered with elegance and speed.
            </p>
            <div className="flex justify-center sm:justify-start gap-2 sm:gap-3">
              {/* Instagram Icon */}
              <a 
                href="#" 
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 flex items-center justify-center group"
                aria-label="Instagram"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/80 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85 0 3.205-.012 3.585-.069 4.85-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.85-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              
              {/* Facebook Icon */}
              <a 
                href="#" 
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 flex items-center justify-center group"
                aria-label="Facebook"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/80 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              
              {/* Twitter/X Icon */}
              <a 
                href="#" 
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 flex items-center justify-center group"
                aria-label="Twitter"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/80 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              
              {/* LinkedIn Icon */}
              <a 
                href="#" 
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 flex items-center justify-center group"
                aria-label="LinkedIn"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/80 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.203 0 22.225 0z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div className="text-center sm:text-left">
            <h3 className="font-semibold text-white mb-3 sm:mb-4 text-base sm:text-lg">Shop</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-white/70">
              <li><Link href="/products" className="hover:text-white transition-colors duration-300 inline-block hover:translate-x-0.5">All Products</Link></li>
              <li><Link href="/category/mens-fashion" className="hover:text-white transition-colors duration-300 inline-block hover:translate-x-0.5">Men&apos;s Fashion</Link></li>
              <li><Link href="/category/womens-fashion" className="hover:text-white transition-colors duration-300 inline-block hover:translate-x-0.5">Women&apos;s Fashion</Link></li>
              <li><Link href="/category/skincare" className="hover:text-white transition-colors duration-300 inline-block hover:translate-x-0.5">Skincare</Link></li>
              <li><Link href="/category/haircare" className="hover:text-white transition-colors duration-300 inline-block hover:translate-x-0.5">Haircare</Link></li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="text-center sm:text-left">
            <h3 className="font-semibold text-white mb-3 sm:mb-4 text-base sm:text-lg">Support</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-white/70">
              <li><Link href="/help" className="hover:text-white transition-colors duration-300 inline-block hover:translate-x-0.5">Help Center</Link></li>
              <li><Link href="/returns" className="hover:text-white transition-colors duration-300 inline-block hover:translate-x-0.5">Returns Policy</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors duration-300 inline-block hover:translate-x-0.5">Shipping Info</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors duration-300 inline-block hover:translate-x-0.5">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors duration-300 inline-block hover:translate-x-0.5">FAQs</Link></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="text-center sm:text-left">
            <h3 className="font-semibold text-white mb-3 sm:mb-4 text-base sm:text-lg">Stay Updated</h3>
            <p className="text-xs sm:text-sm text-white/70 mb-3 sm:mb-4">
              Get 10% off your first order
            </p>
            <div className="flex flex-col xs:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 sm:px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white text-xs sm:text-sm placeholder:text-white/50 focus:outline-none focus:border-white/40 transition-all"
              />
              <button className="px-4 sm:px-5 py-2 bg-white text-raspberry-700 rounded-xl text-xs sm:text-sm font-medium hover:bg-white/90 hover:scale-105 transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="pt-6 sm:pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4 text-center text-[11px] sm:text-sm text-white/50">
          <p>© 2026 AURA. All rights reserved.</p>
          <div className="flex gap-4 sm:gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span>Made with</span>
            <svg className="w-3 h-3 text-red-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span>by AURA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}