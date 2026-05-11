'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheckIcon, TruckIcon, CreditCardIcon } from '@heroicons/react/24/outline';

// Create a separate component that uses useSearchParams
function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const { items, getSubtotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    notes: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/checkout');
      return;
    }
    if (user) {
      //eslint-disable-next-line
      setFormData(prev => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || '',
      }));
    }
  }, [user, authLoading, router]);

  const subtotal = getSubtotal();
  const shipping = subtotal > 500 ? 0 : 10;
  const total = subtotal + shipping;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Link href="/products" className="text-raspberry-600">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const shippingAddress = `${formData.address}, ${formData.city}, ${formData.state} - ${formData.zipCode}`;
    
    const orderItems = items.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      seller_id: 1,
    }));

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: orderItems,
          shippingAddress,
          phone: formData.phone,
          notes: formData.notes,
          totalAmount: total,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        clearCart();
        router.push(`/orders/${data.order.id}/confirmation`);
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-green-dark-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2 border border-green-dark-200 rounded-lg focus:outline-none focus:border-raspberry-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-green-dark-200 rounded-lg focus:outline-none focus:border-raspberry-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-green-dark-200 rounded-lg focus:outline-none focus:border-raspberry-300"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-green-dark-200 rounded-lg focus:outline-none focus:border-raspberry-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2 border border-green-dark-200 rounded-lg focus:outline-none focus:border-raspberry-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-4 py-2 border border-green-dark-200 rounded-lg focus:outline-none focus:border-raspberry-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
                <input
                  type="text"
                  required
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  className="w-full px-4 py-2 border border-green-dark-200 rounded-lg focus:outline-none focus:border-raspberry-300"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-green-dark-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Notes (Optional)</h2>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Special instructions for delivery..."
              className="w-full px-4 py-2 border border-green-dark-200 rounded-lg focus:outline-none focus:border-raspberry-300"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-raspberry-600 text-white rounded-full font-medium hover:bg-raspberry-700 transition-all shadow-lg shadow-raspberry-600/20 disabled:opacity-50"
          >
            {loading ? 'Placing Order...' : `Place Order - $${total.toFixed(2)}`}
          </button>
        </form>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl shadow-sm border border-green-dark-100 p-6 sticky top-24">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
          
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="relative w-12 h-12 bg-raspberry-50 rounded-lg overflow-hidden shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" unoptimized />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          
          <div className="border-t border-green-dark-100 pt-4 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping}`}</span>
            </div>
            <div className="border-t border-green-dark-100 pt-2 mt-2">
              <div className="flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span className="text-raspberry-600 text-xl">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <ShieldCheckIcon className="w-3 h-3" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-1">
              <TruckIcon className="w-3 h-3" />
              <span>Free Shipping over $50</span>
            </div>
            <div className="flex items-center gap-1">
              <CreditCardIcon className="w-3 h-3" />
              <span>100% Secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading fallback component
function CheckoutLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">Loading checkout...</div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/cart" className="text-gray-500 hover:text-raspberry-600 transition-colors">
            ← Back to Cart
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Checkout</h1>
        </div>

        <Suspense fallback={<CheckoutLoading />}>
          <CheckoutForm />
        </Suspense>
      </div>
    </div>
  );
}