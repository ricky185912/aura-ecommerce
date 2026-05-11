'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  StarIcon, 
  ClockIcon, 
  ShoppingBagIcon,
  HeartIcon,
  EyeIcon,
  FireIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';

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
        <div className="container mx-auto px-4 py-4 sm:py-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="product-card animate-pulse">
                <div className="aspect-square bg-cream-200" />
                <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                  <div className="h-3 sm:h-4 bg-cream-200 rounded w-3/4" />
                  <div className="h-2 sm:h-3 bg-cream-200 rounded w-1/2" />
                  <div className="h-4 sm:h-5 bg-cream-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Hero />
      
    
      {/* Products Section */}
      <section className="py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="section-header">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FireIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-raspberry-500" />
              <h2 className="section-title text-2xl sm:text-3xl md:text-4xl">Featured Products</h2>
            </div>
            <div className="divider" />
            <p className="section-subtitle text-sm sm:text-base">Hand-picked luxury essentials</p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12 sm:py-20 glass-card">
              <div className="text-5xl sm:text-6xl mb-4">🛍️</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">No Products Yet</h3>
              <p className="text-sm sm:text-base text-cream-700">Check back soon for amazing products!</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {products.slice(0, visibleProducts).map((product, idx) => (
                  <div 
                    key={product.id} 
                    className="product-card animate-fade-up"
                    style={{ animationDelay: `${idx * 50}ms` }}
                    onMouseEnter={() => setHoveredProduct(product.id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                  >
                    <div className="relative aspect-square bg-gradient-to-br from-raspberry-50 to-green-50 overflow-hidden">
                      {!imageErrors[product.id] && product.images && product.images[0] ? (
                        <Image
                          src={hoveredProduct === product.id && product.images[1] ? product.images[1] : product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          onError={() => handleImageError(product.id)}
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          unoptimized
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <ShoppingBagIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-raspberry-300" />
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center gap-2 sm:gap-3 pb-2 sm:pb-3 md:pb-4">
                        <button className="p-1.5 sm:p-2 bg-white rounded-full hover:bg-raspberry-500 hover:text-white transition-all transform hover:scale-110 shadow-lg">
                          <HeartIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                        </button>
                        <Link href={`/product/${product.id}`}>
                          <button className="p-1.5 sm:p-2 bg-white rounded-full hover:bg-raspberry-500 hover:text-white transition-all transform hover:scale-110 shadow-lg">
                            <EyeIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                          </button>
                        </Link>
                      </div>

                      {product.is_new && (
                        <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                          <span className="badge-new text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1">NEW</span>
                        </div>
                      )}
                      
                      {product.original_price && (
                        <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                          <span className="badge-discount text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1">
                            -{Math.round((1 - product.price / product.original_price) * 100)}%
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-2 sm:p-3 md:p-4">
                      <div className="flex items-center gap-1 mb-1 sm:mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            i < Math.floor(product.rating || 0) ? (
                              <StarSolidIcon key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-400" />
                            ) : (
                              <StarIcon key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cream-400" />
                            )
                          ))}
                        </div>
                        <span className="text-[10px] sm:text-xs text-cream-700">({product.reviews || 0})</span>
                      </div>
                      
                      <h3 className="font-semibold text-gray-800 text-xs sm:text-sm md:text-base mb-1 line-clamp-1">
                        {product.name}
                      </h3>
                      
                      <p className="text-[10px] sm:text-xs text-cream-700 mb-1 sm:mb-2">{product.category}</p>
                      
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="text-sm sm:text-base md:text-lg font-bold text-raspberry-600">${product.price}</span>
                        {product.original_price && (
                          <span className="text-[10px] sm:text-xs text-cream-600 line-through">${product.original_price}</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2 sm:mt-3">
                        <div className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs text-green-600">
                          <ClockIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          <span className="hidden xs:inline">Fast delivery</span>
                        </div>
                        <button className="px-2 py-1 sm:px-3 sm:py-1.5 bg-raspberry-50 text-raspberry-600 rounded-full text-[10px] sm:text-xs font-medium hover:bg-raspberry-600 hover:text-white transition-all">
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {visibleProducts < products.length && (
                <div className="text-center mt-8 sm:mt-10 md:mt-12">
                  <button 
                    onClick={loadMore}
                    className="btn-outline inline-flex items-center gap-2 text-sm sm:text-base px-5 py-2 sm:px-6 sm:py-2.5"
                  >
                    Load More Products
                    <ArrowRightIcon className="w-3 h-3 sm:w-4 sm:h-4" />
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