'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { StarIcon, TruckIcon, ShieldCheckIcon, ArrowLeftIcon, ShoppingBagIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { useCartStore } from '@/store/cartStore';
import Toast from '@/components/Toast';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  original_price: number;
  rating: number;
  reviews: number;
  description: string;
  images: string[];
  stock: number;
  is_new: boolean;
}

export default function ProductPage() {
  const params = useParams();
  const id = Number(params.id);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCart = () => {
    if (!product) return;
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images?.[0] || '',
      category: product.category,
    });
    
    setToastMessage(`${quantity} × ${product.name} added to cart`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 border-4 border-raspberry-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-500 mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-raspberry-600 text-white rounded-full hover:bg-raspberry-700 transition-all">
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <Link href="/products" className="inline-flex items-center gap-2 text-gray-500 hover:text-raspberry-600 mb-6 transition-colors">
            <ArrowLeftIcon className="w-4 h-4" /> Back to Products
          </Link>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-linear-to-br from-raspberry-50 to-green-dark-50 rounded-2xl overflow-hidden">
                {product.images && product.images[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ShoppingBagIcon className="w-24 h-24 text-raspberry-300" />
                  </div>
                )}
                
                {product.is_new && (
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-raspberry-600 text-white text-xs rounded-full font-medium shadow-lg">
                      NEW
                    </span>
                  </div>
                )}
                
                {product.original_price && (
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-green-dark-600 text-white text-xs rounded-full font-medium shadow-lg">
                      -{Math.round((1 - product.price / product.original_price) * 100)}%
                    </span>
                  </div>
                )}
              </div>
              
              {product.images && product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.slice(0, 4).map((img, idx) => (
                    <div key={idx} className="relative w-20 h-20 bg-raspberry-50 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-raspberry-600 transition-all">
                      <Image src={img} alt={`${product.name} view ${idx + 1}`} fill className="object-cover" sizes="80px" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-2">
                <span className="text-sm text-raspberry-600 font-medium uppercase tracking-wider">{product.category}</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      i < Math.floor(product.rating || 0) ? (
                        <StarSolidIcon key={i} className="w-5 h-5 text-yellow-400" />
                      ) : (
                        <StarIcon key={i} className="w-5 h-5 text-gray-300" />
                      )
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-1">{product.rating || 0} out of 5</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-sm text-gray-500">{product.reviews || 0} reviews</span>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-raspberry-600">${product.price}</span>
                {product.original_price && (
                  <>
                    <span className="text-lg text-gray-400 line-through">${product.original_price}</span>
                    <span className="px-2 py-1 bg-green-dark-100 text-green-dark-700 text-sm rounded-full">
                      Save ${(product.original_price - product.price).toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">
                {product.description || 'Experience luxury and elegance with this premium product from AURA. Crafted with the finest materials, this piece is designed to elevate your style and provide unmatched comfort.'}
              </p>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Select Size</h3>
                <div className="flex flex-wrap gap-3">
                  {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-full border-2 transition-all ${
                        selectedSize === size 
                          ? 'bg-raspberry-600 text-white border-raspberry-600 shadow-md' 
                          : 'border-green-dark-200 text-gray-700 hover:border-raspberry-300 hover:bg-raspberry-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Quantity</h3>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full border-2 border-green-dark-200 hover:border-raspberry-300 hover:bg-raspberry-50 transition-all text-xl font-semibold"
                  >
                    -
                  </button>
                  <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                    className="w-10 h-10 rounded-full border-2 border-green-dark-200 hover:border-raspberry-300 hover:bg-raspberry-50 transition-all text-xl font-semibold"
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {product.stock > 0 ? `${product.stock} items available` : 'Out of stock'}
                </p>
              </div>

              <button 
                onClick={addToCart}
                disabled={product.stock === 0}
                className={`w-full py-4 rounded-full font-semibold text-lg transition-all mb-4 ${
                  product.stock > 0
                    ? 'bg-raspberry-600 text-white hover:bg-raspberry-700 shadow-lg shadow-raspberry-600/30 hover:shadow-xl hover:scale-[1.02]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {product.stock > 0 ? `Add to Cart - $${(product.price * quantity).toFixed(2)}` : 'Out of Stock'}
              </button>

              <div className="flex flex-wrap gap-4 text-sm text-gray-500 border-t border-green-dark-100 pt-6">
                <div className="flex items-center gap-2">
                  <TruckIcon className="w-5 h-5 text-green-dark-600" />
                  <span>Free Shipping on orders over $50</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="w-5 h-5 text-green-dark-600" />
                  <span>2 Year Warranty</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
}