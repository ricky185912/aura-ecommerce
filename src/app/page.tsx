'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  StarIcon, 
  ShoppingBagIcon,
  SparklesIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import Hero from '@/components/Hero';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  original_price: number;
  rating: number;
  reviews: number;
  is_new: boolean;
  images: string[];
  stock: number;
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [visibleProducts, setVisibleProducts] = useState(8);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const loadMore = () => {
    setVisibleProducts(prev => prev + 4);
  };

  const handleImageError = (productId: number) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Hero />
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="bg-white rounded-xl border border-cream-200 animate-pulse overflow-hidden shadow-sm">
                <div className="aspect-square bg-cream-100" />
                <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                  <div className="h-3 sm:h-4 bg-cream-100 rounded w-3/4" />
                  <div className="h-2 sm:h-3 bg-cream-100 rounded w-1/2" />
                  <div className="h-4 sm:h-5 bg-cream-100 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white">
      <Hero />
      
      {/* Products Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              Featured Products
            </h2>
            <div className="w-20 h-0.5 bg-gradient-to-r from-raspberry-400 to-green-400 mx-auto mb-4" />
            <p className="text-sm sm:text-base text-cream-700 max-w-2xl mx-auto">
              Hand-picked luxury essentials just for you
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12 sm:py-20 bg-white rounded-2xl border border-cream-200">
              <div className="text-5xl sm:text-6xl mb-4">🛍️</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">No Products Yet</h3>
              <p className="text-sm sm:text-base text-cream-700">Check back soon for amazing products!</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
                {products.slice(0, visibleProducts).map((product, idx) => (
                  <Link 
                    key={product.id} 
                    href={`/product/${product.id}`}
                    className="group bg-white rounded-xl border border-cream-200 overflow-hidden hover:shadow-lg hover:border-raspberry-200 transition-all duration-300 block"
                    onMouseEnter={() => setHoveredProduct(product.id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                  >
                    <div className="relative aspect-square bg-gradient-to-br from-cream-50 to-cream-100 overflow-hidden">
                      {!imageErrors[product.id] && product.images && product.images[0] ? (
                        <Image
                          src={hoveredProduct === product.id && product.images[1] ? product.images[1] : product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={() => handleImageError(product.id)}
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          unoptimized
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <ShoppingBagIcon className="w-8 h-8 sm:w-10 sm:h-10 text-cream-400" />
                        </div>
                      )}

                      {product.is_new && (
                        <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                          <span className="bg-gradient-to-r from-raspberry-500 to-raspberry-600 text-white text-[10px] sm:text-xs font-medium px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full shadow-sm">
                            NEW
                          </span>
                        </div>
                      )}
                      
                      {product.original_price && product.original_price > product.price && (
                        <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                          <span className="bg-gradient-to-r from-green-600 to-green-700 text-white text-[10px] sm:text-xs font-medium px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full shadow-sm">
                            -{Math.round((1 - product.price / product.original_price) * 100)}%
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-3 sm:p-4">
                      <div className="flex items-center gap-1 mb-1 sm:mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            i < Math.floor(product.rating || 0) ? (
                              <StarSolidIcon key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
                            ) : (
                              <StarIcon key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cream-300" />
                            )
                          ))}
                        </div>
                        <span className="text-[10px] sm:text-xs text-cream-600">({product.reviews || 0})</span>
                      </div>
                      
                      <h3 className="font-semibold text-gray-800 text-xs sm:text-sm md:text-base mb-0.5 line-clamp-1">
                        {product.name}
                      </h3>
                      
                      <p className="text-[10px] sm:text-xs text-cream-600 mb-1.5 sm:mb-2">{product.category}</p>
                      
                      <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                        <span className="text-sm sm:text-base md:text-lg font-bold text-raspberry-600">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.original_price && product.original_price > product.price && (
                          <span className="text-[10px] sm:text-xs text-cream-500 line-through">
                            ₹{product.original_price.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          // Add to cart logic
                        }}
                        className="w-full py-1.5 sm:py-2 bg-cream-50 hover:bg-raspberry-600 text-raspberry-600 hover:text-white rounded-lg text-[11px] sm:text-xs font-medium transition-all duration-300 border border-cream-200 hover:border-raspberry-600"
                      >
                        Quick Add
                      </button>
                    </div>
                  </Link>
                ))}
              </div>

              {visibleProducts < products.length && (
                <div className="text-center mt-10 sm:mt-12 md:mt-14">
                  <button 
                    onClick={loadMore}
                    className="group inline-flex items-center gap-2 px-6 py-2.5 sm:px-7 sm:py-3 border-2 border-raspberry-200 text-raspberry-600 font-semibold rounded-full text-sm sm:text-base hover:bg-raspberry-50 hover:border-raspberry-400 hover:scale-105 transition-all duration-300"
                  >
                    Load More Products
                    <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}