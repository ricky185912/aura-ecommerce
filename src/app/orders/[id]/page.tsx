'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { 
  ClockIcon, 
  TruckIcon, 
  CheckCircleIcon, 
  MapPinIcon,
  CalendarIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

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
  seller_id: number;
  order_date: string;
  shipping_address: string;
}

const statusSteps = [
  { key: 'pending', label: 'Order Placed', icon: ClockIcon, description: 'Your order has been received' },
  { key: 'confirmed', label: 'Order Confirmed', icon: CheckCircleIcon, description: 'Seller has confirmed your order' },
  { key: 'shipped', label: 'Shipped', icon: TruckIcon, description: 'Your order is on the way' },
  { key: 'delivered', label: 'Delivered', icon: CheckCircleIcon, description: 'Your order has been delivered' },
];

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = Number(params.id);
  const [order, setOrder] = useState<OrderItem | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrderDetails = useCallback(async () => {
    try {
      const res = await fetch(`/api/orders/track/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  const getCurrentStepIndex = () => {
    if (!order) return 0;
    const index = statusSteps.findIndex(step => step.key === order.status);
    return index >= 0 ? index : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <Link href="/orders" className="text-raspberry-600 hover:text-raspberry-700">Back to Orders</Link>
        </div>
      </div>
    );
  }

  const currentStep = getCurrentStepIndex();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/orders" className="inline-flex items-center gap-2 text-gray-500 hover:text-raspberry-600 mb-6 transition-colors">
          <ArrowLeftIcon className="w-4 h-4" /> Back to Orders
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-green-dark-100 p-6 mb-6">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Tracking</h1>
              <p className="text-gray-500">Order #{order.id}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Placed on</p>
              <p className="font-medium text-gray-900">{new Date(order.order_date).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-green-dark-100 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Order Status</h2>
          <div className="relative">
            {statusSteps.map((step, idx) => {
              const isCompleted = idx <= currentStep;
              const isCurrent = idx === currentStep;
              const Icon = step.icon;
              
              return (
                <div key={step.key} className="relative flex gap-4 pb-8 last:pb-0">
                  {idx < statusSteps.length - 1 && (
                    <div className={`absolute left-5 top-10 w-0.5 h-16 ${isCompleted ? 'bg-raspberry-500' : 'bg-gray-200'}`} />
                  )}
                  
                  <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    isCompleted ? 'bg-raspberry-600 text-white' : 'bg-gray-200 text-gray-400'
                  } ${isCurrent ? 'ring-4 ring-raspberry-200' : ''}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 pt-1">
                    <h3 className={`font-semibold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.label}
                    </h3>
                    <p className={`text-sm ${isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                      {step.description}
                    </p>
                    {isCurrent && order.tracking_number && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Tracking Number</p>
                        <p className="text-sm font-mono text-gray-900">{order.tracking_number}</p>
                      </div>
                    )}
                    {isCurrent && order.estimated_delivery && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-green-dark-600">
                        <CalendarIcon className="w-4 h-4" />
                        <span>Estimated Delivery: {new Date(order.estimated_delivery).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-green-dark-100 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Product Details</h2>
          <div className="flex gap-4">
            <div className="relative w-24 h-24 bg-raspberry-50 rounded-xl overflow-hidden shrink-0">
              <Image src={order.product_image || '/logo.jpeg'} alt={order.product_name} fill className="object-cover" sizes="96px" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">{order.product_name}</h3>
              <p className="text-sm text-gray-500">Quantity: {order.quantity}</p>
              <p className="text-sm text-gray-500">Price: ${order.price}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-raspberry-600">${(order.price * order.quantity).toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-green-dark-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Shipping Address</h2>
          <div className="flex items-start gap-3">
            <MapPinIcon className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
            <p className="text-gray-600">{order.shipping_address}</p>
          </div>
        </div>
      </div>
    </div>
  );
}