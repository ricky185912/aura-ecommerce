'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { StarIcon, FireIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  original_price: number;
  rating: number;
  reviews: number;
  images: string[];
}

export default function TrendingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      // Sort by rating to show trending (highest rated first)
      const trending = [...data].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 8);
      setProducts(trending);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-green-dark-100 animate-pulse">
                <div className="aspect-square bg-linear-to-br from-raspberry-100 to-green-dark-100" />
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <FireIcon className="w-8 h-8 text-raspberry-600" />
            <h1 className="text-3xl font-bold text-gray-900">Trending Now</h1>
          </div>
          <p className="text-gray-500">Most popular items this week</p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-green-dark-100">
            <div className="text-6xl mb-4">🔥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Trending Products</h3>
            <p className="text-gray-500">Check back soon for popular items!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <div key={product.id} className="group">
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm border border-green-dark-100 hover:shadow-xl hover:border-raspberry-200 transition-all">
                  <div className="relative aspect-square bg-linear-to-br from-raspberry-50 to-green-dark-50 overflow-hidden">
                    {product.images && product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ShoppingBagIcon className="w-12 h-12 text-raspberry-300" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <div className="flex items-center gap-1 px-2 py-1 bg-raspberry-600 text-white text-xs rounded-full font-medium">
                        <FireIcon className="w-3 h-3" />
                        <span>Trending</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          i < Math.floor(product.rating || 0) ? (
                            <StarSolidIcon key={i} className="w-3 h-3 text-yellow-400" />
                          ) : (
                            <StarIcon key={i} className="w-3 h-3 text-gray-300" />
                          )
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">({product.reviews || 0})</span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-gray-400 mb-2">{product.category}</p>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-raspberry-600">${product.price}</span>
                      {product.original_price && (
                        <span className="text-sm text-gray-400 line-through">${product.original_price}</span>
                      )}
                    </div>

                    <button className="w-full mt-3 px-3 py-2 bg-raspberry-50 text-raspberry-600 rounded-full text-xs font-medium hover:bg-raspberry-600 hover:text-white transition-all">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}