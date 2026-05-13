'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  XMarkIcon,
  PhotoIcon,
  ShoppingBagIcon,
  ArrowPathIcon as RefreshIcon,
  CheckCircleIcon,
  TruckIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import Hero from '@/components/Hero';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  original_price: number;
  category: string;
  images: string[];
  stock: number;
  is_new: boolean;
  seller_id: number;
  created_at: string;
}

interface Order {
  id: number;
  order_number: string;
  product_id: number;
  product_name: string;
  product_images: string[];
  quantity: number;
  price: number;
  status: string;
  tracking_number: string;
  estimated_delivery: string;
  user_name: string;
  user_email: string;
  shipping_address: string;
  phone: string;
  created_at: string;
  order_date: string;
}

export default function SellerDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    stock: '',
    isNew: false,
  });

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch('/api/seller/orders');
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && (!user || (user.role !== 'seller' && user.role !== 'admin'))) {
      router.push('/');
      return;
    }
    
    if (user && (user.role === 'seller' || user.role === 'admin')) {
      //eslint-disable-next-line 
      fetchProducts();
      fetchOrders();
    }
  }, [user, authLoading, router, fetchProducts, fetchOrders]);

  const updateOrderStatus = async (orderId: number, status: string, trackingNumber?: string, estimatedDelivery?: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, trackingNumber, estimatedDelivery }),
      });
      if (res.ok) {
        await fetchOrders();
        alert('Order status updated successfully!');
      } else {
        alert('Failed to update order');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      category: formData.category,
      images: imageUrls,
      stock: parseInt(formData.stock) || 0,
      isNew: formData.isNew,
    };
    
    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      
      if (res.ok) {
        await fetchProducts();
        resetForm();
        alert(editingProduct ? 'Product updated!' : 'Product added!');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchProducts();
        alert('Product deleted!');
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const resetForm = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      category: '',
      stock: '',
      isNew: false,
    });
    setImageUrls([]);
    setImageInput('');
  };

  const editProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      originalPrice: product.original_price?.toString() || '',
      category: product.category,
      stock: product.stock.toString(),
      isNew: product.is_new,
    });
    setImageUrls(product.images || []);
    setShowModal(true);
  };

  const addImage = () => {
    if (imageInput && !imageUrls.includes(imageInput)) {
      setImageUrls([...imageUrls, imageInput]);
      setImageInput('');
    }
  };

  const removeImage = (url: string) => {
    setImageUrls(imageUrls.filter(img => img !== url));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'shipped': return 'bg-purple-100 text-purple-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircleIcon className="w-4 h-4" />;
      case 'shipped': return <TruckIcon className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-raspberry-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cream-700">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || (user.role !== 'seller' && user.role !== 'admin')) {
    return null;
  }

  const userProducts = products.filter(p => p.seller_id === user.id || user.role === 'admin');
  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.price * o.quantity), 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white">
      <Hero />
      
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-cream-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cream-700 mb-1">Total Products</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800">{userProducts.length}</p>
              </div>
              <div className="w-10 h-10 bg-raspberry-50 rounded-full flex items-center justify-center">
                <ShoppingBagIcon className="w-5 h-5 text-raspberry-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-cream-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cream-700 mb-1">Pending Orders</p>
                <p className="text-2xl sm:text-3xl font-bold text-amber-600">{pendingOrdersCount}</p>
              </div>
              <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center">
                <ClockIcon className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-cream-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cream-700 mb-1">Total Revenue</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-600">₹{totalRevenue.toLocaleString('en-IN')}</p>
              </div>
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Seller Dashboard</h1>
            <p className="text-sm text-cream-700 mt-1">Manage your products and track orders</p>
          </div>
          <div className="flex gap-3">
            {activeTab === 'orders' && (
              <button
                onClick={() => fetchOrders()}
                className="flex items-center gap-2 px-4 py-2 bg-cream-100 text-cream-700 rounded-full hover:bg-cream-200 transition-all text-sm font-medium"
              >
                <RefreshIcon className="w-4 h-4" />
                Refresh
              </button>
            )}
            {activeTab === 'products' && (
              <button
                onClick={() => {
                  setEditingProduct(null);
                  resetForm();
                  setShowModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-raspberry-600 to-raspberry-700 text-white rounded-full hover:shadow-lg transition-all text-sm font-medium"
              >
                <PlusIcon className="w-4 h-4" />
                Add Product
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mb-8 border-b border-cream-200">
          <button
            onClick={() => {
              setActiveTab('products');
              fetchProducts();
            }}
            className={`pb-3 px-1 font-medium transition-colors text-sm sm:text-base ${
              activeTab === 'products'
                ? 'text-raspberry-600 border-b-2 border-raspberry-600'
                : 'text-cream-700 hover:text-gray-800'
            }`}
          >
            My Products
          </button>
          <button
            onClick={() => {
              setActiveTab('orders');
              fetchOrders();
            }}
            className={`pb-3 px-1 font-medium transition-colors text-sm sm:text-base relative ${
              activeTab === 'orders'
                ? 'text-raspberry-600 border-b-2 border-raspberry-600'
                : 'text-cream-700 hover:text-gray-800'
            }`}
          >
            Orders
            {pendingOrdersCount > 0 && (
              <span className="absolute -top-1 -right-4 px-1.5 py-0.5 text-xs bg-raspberry-500 text-white rounded-full">
                {pendingOrdersCount}
              </span>
            )}
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <>
            {userProducts.length === 0 ? (
              <div className="text-center py-16 sm:py-20 bg-white rounded-2xl border border-cream-200">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">No Products Yet</h3>
                <p className="text-sm text-cream-700 mb-6">Start adding your first product</p>
                <button
                  onClick={() => setShowModal(true)}
                  className="px-6 py-2.5 bg-gradient-to-r from-raspberry-600 to-raspberry-700 text-white rounded-full hover:shadow-lg transition-all"
                >
                  Add Product
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {userProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-cream-200 overflow-hidden hover:shadow-md transition-all group">
                    <div className="relative h-48 bg-gradient-to-br from-cream-100 to-cream-50 overflow-hidden">
                      {product.images && product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          unoptimized
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <PhotoIcon className="w-12 h-12 text-cream-400" />
                        </div>
                      )}
                      {product.is_new && (
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-1 bg-gradient-to-r from-raspberry-500 to-raspberry-600 text-white text-xs font-medium rounded-full shadow-sm">NEW</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">{product.name}</h3>
                      <p className="text-xs text-cream-700 mb-2">{product.category}</p>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-bold text-raspberry-600">₹{product.price.toLocaleString('en-IN')}</span>
                        {product.original_price && (
                          <span className="text-xs text-cream-500 line-through">₹{product.original_price.toLocaleString('en-IN')}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          Stock: {product.stock}
                        </span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => editProduct(product)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            {ordersLoading ? (
              <div className="text-center py-10">
                <div className="animate-pulse text-cream-700">Loading orders...</div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 sm:py-20 bg-white rounded-2xl border border-cream-200">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">No Orders Yet</h3>
                <p className="text-sm text-cream-700">Orders will appear here when customers purchase your products</p>
                <button
                  onClick={() => fetchOrders()}
                  className="mt-6 px-4 py-2 bg-gradient-to-r from-raspberry-600 to-raspberry-700 text-white rounded-full hover:shadow-lg transition-all"
                >
                  Refresh
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const orderTotal = order.price * order.quantity;
                  const statusColor = getStatusColor(order.status);
                  
                  return (
                    <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-cream-200 p-5 sm:p-6 hover:shadow-md transition-all">
                      <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                        <div>
                          <p className="text-sm font-semibold text-raspberry-600">
                            Order #{order.order_number || order.id}
                          </p>
                          <p className="text-xs text-cream-600 mt-1">
                            {new Date(order.created_at || order.order_date).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                            {getStatusIcon(order.status)}
                            <span className="capitalize">{order.status}</span>
                          </span>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value, order.tracking_number, order.estimated_delivery)}
                            className="px-3 py-1.5 text-sm border border-cream-200 rounded-lg focus:outline-none focus:border-raspberry-300 bg-white"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirm Order</option>
                            <option value="shipped">Mark as Shipped</option>
                            <option value="delivered">Mark as Delivered</option>
                            <option value="cancelled">Cancel Order</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="flex gap-4 mb-4">
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-cream-100 to-cream-50 rounded-xl overflow-hidden shrink-0">
                          {order.product_images && order.product_images[0] ? (
                            <Image
                              src={order.product_images[0]}
                              alt={order.product_name}
                              fill
                              className="object-cover"
                              sizes="80px"
                              unoptimized
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <ShoppingBagIcon className="w-6 h-6 sm:w-8 sm:h-8 text-cream-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1">{order.product_name}</h3>
                          <p className="text-xs text-cream-700">Quantity: {order.quantity}</p>
                          <p className="text-xs text-cream-700">Price: ₹{order.price.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-raspberry-600">₹{orderTotal.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                      
                      <div className="border-t border-cream-200 pt-4">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Customer:</span> {order.user_name} ({order.user_email})
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          <span className="font-medium">Shipping Address:</span> {order.shipping_address}
                        </p>
                        {order.phone && (
                          <p className="text-sm text-gray-700 mt-1">
                            <span className="font-medium">Phone:</span> {order.phone}
                          </p>
                        )}
                        
                        {order.status === 'shipped' && (
                          <div className="mt-3 p-3 bg-cream-50 rounded-lg">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Tracking Number</label>
                            <input
                              type="text"
                              placeholder="Enter tracking number"
                              defaultValue={order.tracking_number}
                              onBlur={(e) => updateOrderStatus(order.id, order.status, e.target.value, order.estimated_delivery)}
                              className="w-full max-w-md px-3 py-1.5 text-sm border border-cream-200 rounded-lg focus:outline-none focus:border-raspberry-300"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Add/Edit Product Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-cream-200 p-4 flex justify-between items-center">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={resetForm} className="p-2 hover:bg-cream-100 rounded-full transition-colors">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-cream-200 rounded-lg focus:outline-none focus:border-raspberry-300 focus:ring-1 focus:ring-raspberry-300 transition-all"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-cream-200 rounded-lg focus:outline-none focus:border-raspberry-300 focus:ring-1 focus:ring-raspberry-300 transition-all"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      step="1"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2 border border-cream-200 rounded-lg focus:outline-none focus:border-raspberry-300 focus:ring-1 focus:ring-raspberry-300 transition-all"
                      required
                    />
                    <p className="text-xs text-cream-600 mt-1">Price in Indian Rupees (₹)</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (₹)</label>
                    <input
                      type="number"
                      step="1"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      className="w-full px-4 py-2 border border-cream-200 rounded-lg focus:outline-none focus:border-raspberry-300 focus:ring-1 focus:ring-raspberry-300 transition-all"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-cream-200 rounded-lg focus:outline-none focus:border-raspberry-300 focus:ring-1 focus:ring-raspberry-300 transition-all"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Men's Fashion">Men&apos;s Fashion</option>
                      <option value="Women's Fashion">Women&apos;s Fashion</option>
                      <option value="Skincare">Skincare</option>
                      <option value="Haircare">Haircare</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full px-4 py-2 border border-cream-200 rounded-lg focus:outline-none focus:border-raspberry-300 focus:ring-1 focus:ring-raspberry-300 transition-all"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isNew}
                      onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                      className="w-4 h-4 text-raspberry-600 rounded focus:ring-raspberry-500"
                    />
                    <span className="text-sm text-gray-700">Mark as New Arrival</span>
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="url"
                      value={imageInput}
                      onChange={(e) => setImageInput(e.target.value)}
                      placeholder="Enter image URL"
                      className="flex-1 px-4 py-2 border border-cream-200 rounded-lg focus:outline-none focus:border-raspberry-300 focus:ring-1 focus:ring-raspberry-300 transition-all text-sm"
                    />
                    <button
                      type="button"
                      onClick={addImage}
                      className="px-4 py-2 bg-cream-100 text-cream-700 rounded-lg hover:bg-cream-200 transition-colors text-sm font-medium"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {imageUrls.map((url, idx) => (
                      <div key={idx} className="relative w-16 h-16">
                        <Image
                          src={url}
                          alt={`Product ${idx + 1}`}
                          fill
                          className="object-cover rounded-lg"
                          sizes="64px"
                          unoptimized
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(url)}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-cream-600 mt-2">Supports external image URLs from any source</p>
                </div>
                
                <div className="sticky bottom-0 bg-white pt-4 border-t border-cream-200">
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-raspberry-600 to-raspberry-700 text-white rounded-full font-medium hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                  >
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}