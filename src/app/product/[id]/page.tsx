'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { StarIcon, TruckIcon, ShieldCheckIcon, ArrowLeftIcon, ShoppingBagIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { useCartStore } from '@/store/cartStore';
import Toast from '@/components/Toast';
import Hero from '@/components/Hero';

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
  const [mainImage, setMainImage] = useState('');
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          if (data.images && data.images[0]) {
            setMainImage(data.images[0]);
          }
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
          <div className="w-16 h-16 border-4 border-raspberry-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cream-700">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-cream-700 mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-raspberry-600 to-raspberry-700 text-white rounded-full hover:shadow-lg transition-all">
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const savings = product.original_price ? product.original_price - product.price : 0;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white">
        <Hero />
        
        <div className="container mx-auto px-4 py-8 sm:py-12">
          {/* Back Button */}
          <Link href="/products" className="inline-flex items-center gap-2 text-cream-700 hover:text-raspberry-600 mb-6 transition-colors group">
            <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Products</span>
          </Link>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images Section */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-gradient-to-br from-cream-100 to-cream-50 rounded-2xl overflow-hidden shadow-lg">
                {mainImage ? (
                  <Image
                    src={mainImage}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    unoptimized
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ShoppingBagIcon className="w-24 h-24 text-cream-400" />
                  </div>
                )}
                
                {product.is_new && (
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-raspberry-500 to-raspberry-600 text-white text-xs font-medium rounded-full shadow-lg">
                      NEW
                    </span>
                  </div>
                )}
                
                {product.original_price && (
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-green-600 to-green-700 text-white text-xs font-medium rounded-full shadow-lg">
                      -{Math.round((1 - product.price / product.original_price) * 100)}%
                    </span>
                  </div>
                )}
              </div>
              
              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.slice(0, 4).map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setMainImage(img)}
                      className={`relative w-20 h-20 bg-cream-100 rounded-lg overflow-hidden transition-all ${
                        mainImage === img 
                          ? 'ring-2 ring-raspberry-500 shadow-md' 
                          : 'hover:ring-2 hover:ring-cream-300'
                      }`}
                    >
                      <Image src={img} alt={`${product.name} view ${idx + 1}`} fill className="object-cover" sizes="80px" unoptimized />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info Section */}
            <div className="space-y-6">
              <div>
                <span className="text-xs sm:text-sm text-raspberry-600 font-semibold uppercase tracking-wider bg-raspberry-50 px-3 py-1 rounded-full">
                  {product.category}
                </span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 leading-tight">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    i < Math.floor(product.rating || 0) ? (
                      <StarSolidIcon key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                    ) : (
                      <StarIcon key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-cream-300" />
                    )
                  ))}
                </div>
                <span className="text-sm text-cream-700">{product.rating || 0} out of 5</span>
                <span className="text-cream-300">|</span>
                <span className="text-sm text-cream-700">{product.reviews || 0} reviews</span>
              </div>

              {/* Price - Direct INR */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl sm:text-4xl font-bold text-raspberry-600">₹{product.price.toLocaleString('en-IN')}</span>
                  {product.original_price && (
                    <>
                      <span className="text-lg text-cream-500 line-through">₹{product.original_price.toLocaleString('en-IN')}</span>
                      <span className="px-2 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full">
                        Save ₹{savings.toLocaleString('en-IN')}
                      </span>
                    </>
                  )}
                </div>
                <p className="text-xs text-green-600">Inclusive of all taxes</p>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base text-cream-700 leading-relaxed border-t border-cream-200 pt-4">
                {product.description || 'Experience luxury and elegance with this premium product from AURA. Crafted with the finest materials, this piece is designed to elevate your style and provide unmatched comfort.'}
              </p>

              {/* Size Selection */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800 text-sm">Select Size</h3>
                <div className="flex flex-wrap gap-3">
                  {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-11 h-11 rounded-full border-2 transition-all duration-300 text-sm font-medium ${
                        selectedSize === size 
                          ? 'bg-raspberry-600 text-white border-raspberry-600 shadow-md' 
                          : 'border-cream-300 text-gray-700 hover:border-raspberry-400 hover:bg-raspberry-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800 text-sm">Quantity</h3>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full border-2 border-cream-300 hover:border-raspberry-400 hover:bg-raspberry-50 transition-all text-xl font-semibold text-gray-600"
                  >
                    -
                  </button>
                  <span className="text-xl font-semibold w-12 text-center text-gray-800">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                    className="w-10 h-10 rounded-full border-2 border-cream-300 hover:border-raspberry-400 hover:bg-raspberry-50 transition-all text-xl font-semibold text-gray-600"
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-cream-600">
                  {product.stock > 0 ? `${product.stock} items available` : 'Out of stock'}
                </p>
              </div>

              {/* Add to Cart Button */}
              <button 
                onClick={addToCart}
                disabled={product.stock === 0}
                className={`w-full py-4 rounded-full font-semibold text-lg transition-all duration-300 ${
                  product.stock > 0
                    ? 'bg-gradient-to-r from-raspberry-600 to-raspberry-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]'
                    : 'bg-cream-200 text-cream-500 cursor-not-allowed'
                }`}
              >
                {product.stock > 0 ? `Add to Cart · ₹{(product.price * quantity).toLocaleString('en-IN')}` : 'Out of Stock'}
              </button>

              {/* Delivery & Warranty Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-cream-200 pt-6">
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 rounded-full bg-raspberry-50">
                    <TruckIcon className="w-4 h-4 text-raspberry-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Free Shipping</p>
                    <p className="text-xs text-cream-600">On orders over ₹4,250</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 rounded-full bg-green-50">
                    <ShieldCheckIcon className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">2 Year Warranty</p>
                    <p className="text-xs text-cream-600">Manufacturer warranty</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 rounded-full bg-raspberry-50">
                    <ClockIcon className="w-4 h-4 text-raspberry-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Express Delivery</p>
                    <p className="text-xs text-cream-600">2-4 business days</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 rounded-full bg-green-50">
                    <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Easy Returns</p>
                    <p className="text-xs text-cream-600">14 days return policy</p>
                  </div>
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