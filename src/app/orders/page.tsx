'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
  status: string;
  tracking_number: string;
  estimated_delivery: string;
}

interface Order {
  id: number;
  order_number: string;
  total_amount: number | string;
  status: string;
  created_at: string;
  items: OrderItem[];
}

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'bg-yellow-500' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-500' },
  shipped: { label: 'Shipped', color: 'bg-purple-500' },
  delivered: { label: 'Delivered', color: 'bg-green-500' },
  cancelled: { label: 'Cancelled', color: 'bg-red-500' },
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setError(null);
      const res = await fetch('/api/orders');
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders. Please try again.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      //eslint-disable-next-line
      fetchOrders();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const getStatusInfo = (status: string) => {
    return statusConfig[status] || statusConfig.pending;
  };

  const formatPrice = (price: number | string): string => {
    const num = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Login</h2>
          <p className="text-gray-500 mb-6">You need to be logged in to view your orders</p>
          <Link href="/login" className="px-6 py-3 bg-raspberry-600 text-white rounded-full">Login</Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button 
            onClick={fetchOrders} 
            className="px-6 py-3 bg-raspberry-600 text-white rounded-full hover:bg-raspberry-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-green-dark-100">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h3>
            <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
            <Link href="/products" className="px-6 py-3 bg-raspberry-600 text-white rounded-full">Shop Now</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-green-dark-100 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-green-dark-100 flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Order #{order.order_number}</p>
                    <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusInfo(order.status).color}`}>
                      {getStatusInfo(order.status).label}
                    </span>
                    <Link href={`/orders/${order.id}`}>
                      <button className="px-4 py-1.5 text-sm border border-raspberry-200 text-raspberry-600 rounded-full hover:bg-raspberry-50 transition-all">
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-3">
                    {order.items && order.items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="relative w-16 h-16 bg-raspberry-50 rounded-lg overflow-hidden shrink-0">
                          <Image src={item.product_image || '/logo.jpeg'} alt={item.product_name} fill className="object-cover" sizes="64px" unoptimized />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.product_name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className={`w-2 h-2 rounded-full ${getStatusInfo(item.status).color}`} />
                            <p className="text-xs text-gray-400">{getStatusInfo(item.status).label}</p>
                          </div>
                        </div>
                        <p className="font-semibold text-gray-900">${formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-green-dark-100 mt-4 pt-4 flex justify-end">
                    <p className="font-bold text-gray-900">
                      Total: <span className="text-raspberry-600">${formatPrice(order.total_amount)}</span>
                    </p>
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