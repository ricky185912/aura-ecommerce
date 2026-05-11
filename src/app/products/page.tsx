'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { StarIcon, ClockIcon, ShoppingBagIcon, HeartIcon, EyeIcon, FireIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
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

  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(p => p.category.toLowerCase() === filter);

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="product-glass animate-pulse">
                <div className="aspect-square bg-raspberry-700/30" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-raspberry-700/30 rounded w-3/4" />
                  <div className="h-3 bg-raspberry-700/30 rounded w-1/2" />
                  <div className="h-5 bg-raspberry-700/30 rounded w-1/3" />
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
        <div className="section-header">
          <h1 className="section-title">All Products</h1>
          <div className="divider-glow" />
          <p className="section-subtitle">Discover our curated collection</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {['all', "men's fashion", "women's fashion", 'skincare', 'haircare'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === cat
                  ? 'bg-gradient-to-r from-raspberry-500 to-raspberry-600 text-white shadow-lg shadow-raspberry-500/30'
                  : 'glass-premium text-cream/70 hover:text-cream hover:border-raspberry-400/30'
              }`}
            >
              {cat === 'all' ? 'All Products' : cat}
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 glass-premium">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-cream mb-2">No Products Found</h3>
            <p className="text-cream/40">Try a different category</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-glass group">
                <div className="relative aspect-square bg-gradient-to-br from-raspberry-700/50 to-green-dark-700/50 overflow-hidden">
                  {!imageErrors[product.id] && product.images && product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={() => setImageErrors(prev => ({ ...prev, [product.id]: true }))}
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ShoppingBagIcon className="w-12 h-12 text-raspberry-400/50" />
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center gap-3 pb-5">
                    <button className="p-2.5 bg-cream rounded-full hover:bg-raspberry-500 hover:text-white transition-all transform hover:scale-110 shadow-lg">
                      <HeartIcon className="w-5 h-5" />
                    </button>
                    <Link href={`/product/${product.id}`}>
                      <button className="p-2.5 bg-cream rounded-full hover:bg-raspberry-500 hover:text-white transition-all transform hover:scale-110 shadow-lg">
                        <EyeIcon className="w-5 h-5" />
                      </button>
                    </Link>
                  </div>

                  {product.is_new && (
                    <div className="absolute top-3 left-3">
                      <span className="badge-new">NEW</span>
                    </div>
                  )}
                  
                  {product.original_price && (
                    <div className="absolute top-3 right-3">
                      <span className="badge-discount">
                        -{Math.round((1 - product.price / product.original_price) * 100)}%
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        i < Math.floor(product.rating || 0) ? (
                          <StarSolidIcon key={i} className="w-3.5 h-3.5 text-yellow-400" />
                        ) : (
                          <StarIcon key={i} className="w-3.5 h-3.5 text-cream/30" />
                        )
                      ))}
                    </div>
                    <span className="text-xs text-cream/40">({product.reviews || 0})</span>
                  </div>
                  
                  <h3 className="font-semibold text-cream text-base mb-1 line-clamp-1">
                    {product.name}
                  </h3>
                  
                  <p className="text-xs text-cream/40 mb-2">{product.category}</p>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-raspberry-400">${product.price}</span>
                    {product.original_price && (
                      <span className="text-sm text-cream/30 line-through">${product.original_price}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-1 text-xs text-green-dark-300">
                      <ClockIcon className="w-3 h-3" />
                      <span>Fast delivery</span>
                    </div>
                    <button className="px-4 py-2 bg-raspberry-500/20 border border-raspberry-400/30 text-raspberry-300 rounded-full text-xs font-medium hover:bg-raspberry-500/40 hover:text-cream transition-all">
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