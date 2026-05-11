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
  ArrowPathIcon as RefreshIcon
} from '@heroicons/react/24/outline';

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
      console.log('Fetched orders:', data); // Debug log
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
      // eslint-disable-next-line
      fetchProducts();
      fetchOrders(); // Also fetch orders on initial load
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
        // Refresh orders after update
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

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  // Auth check (after hooks)
  if (!user || (user.role !== 'seller' && user.role !== 'admin')) {
    return null;
  }

  const userProducts = products.filter(p => p.seller_id === user.id || user.role === 'admin');
  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage your products and orders</p>
          </div>
          <div className="flex gap-3">
            {activeTab === 'orders' && (
              <button
                onClick={() => fetchOrders()}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-all"
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
                className="flex items-center gap-2 px-4 py-2 bg-raspberry-600 text-white rounded-full hover:bg-raspberry-700 transition-all"
              >
                <PlusIcon className="w-5 h-5" />
                Add Product
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-green-dark-100">
          <button
            onClick={() => {
              setActiveTab('products');
              fetchProducts();
            }}
            className={`pb-3 px-4 font-medium transition-colors ${
              activeTab === 'products'
                ? 'text-raspberry-600 border-b-2 border-raspberry-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Products
          </button>
          <button
            onClick={() => {
              setActiveTab('orders');
              fetchOrders();
            }}
            className={`pb-3 px-4 font-medium transition-colors ${
              activeTab === 'orders'
                ? 'text-raspberry-600 border-b-2 border-raspberry-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Orders
            {pendingOrdersCount > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-raspberry-100 text-raspberry-600 rounded-full">
                {pendingOrdersCount} new
              </span>
            )}
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <>
            {userProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-green-dark-100">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Yet</h3>
                <p className="text-gray-500 mb-6">Start adding your first product</p>
                <button
                  onClick={() => setShowModal(true)}
                  className="px-6 py-2 bg-raspberry-600 text-white rounded-full hover:bg-raspberry-700"
                >
                  Add Product
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-green-dark-100 overflow-hidden hover:shadow-md transition-all">
                    <div className="relative h-48 bg-linear-to-br from-raspberry-50 to-green-dark-50">
                      {product.images && product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          unoptimized
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <PhotoIcon className="w-12 h-12 text-gray-300" />
                        </div>
                      )}
                      {product.is_new && (
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-1 bg-raspberry-600 text-white text-xs rounded-full">NEW</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl font-bold text-raspberry-600">${product.price}</span>
                        {product.original_price && (
                          <span className="text-sm text-gray-400 line-through">${product.original_price}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Stock: {product.stock}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => editProduct(product)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
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
                <div className="animate-pulse">Loading orders...</div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-green-dark-100">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h3>
                <p className="text-gray-500">Orders will appear here when customers purchase your products</p>
                <button
                  onClick={() => fetchOrders()}
                  className="mt-4 px-4 py-2 bg-raspberry-600 text-white rounded-full hover:bg-raspberry-700"
                >
                  Refresh
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-green-dark-100 p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                      <div>
                        <p className="text-sm font-semibold text-raspberry-600">
                          Order #{order.order_number || order.id}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(order.created_at || order.order_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                          order.status === 'pending' ? 'bg-yellow-500' :
                          order.status === 'confirmed' ? 'bg-blue-500' :
                          order.status === 'shipped' ? 'bg-purple-500' :
                          order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-500'
                        }`}>
                          {order.status || 'pending'}
                        </span>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value, order.tracking_number, order.estimated_delivery)}
                          className="px-3 py-1 text-sm border border-green-dark-200 rounded-lg focus:outline-none focus:border-raspberry-300 bg-white"
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
                      <div className="relative w-20 h-20 bg-linear-to-br from-raspberry-50 to-green-dark-50 rounded-xl overflow-hidden shrink-0">
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
                            <ShoppingBagIcon className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
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
                    
                    <div className="border-t border-green-dark-100 pt-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Customer:</span> {order.user_name} ({order.user_email})
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Shipping Address:</span> {order.shipping_address}
                      </p>
                      {order.phone && (
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-medium">Phone:</span> {order.phone}
                        </p>
                      )}
                      
                      {order.status === 'shipped' && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number</label>
                          <input
                            type="text"
                            placeholder="Enter tracking number"
                            defaultValue={order.tracking_number}
                            onBlur={(e) => updateOrderStatus(order.id, order.status, e.target.value, order.estimated_delivery)}
                            className="w-full max-w-md px-3 py-1.5 text-sm border border-green-dark-200 rounded-lg focus:outline-none focus:border-raspberry-300"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add/Edit Product Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-green-dark-100 p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-full">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-green-dark-200 rounded-lg focus:outline-none focus:border-raspberry-300"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-green-dark-200 rounded-lg focus:outline-none focus:border-raspberry-300"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2 border border-green-dark-200 rounded-lg focus:outline-none focus:border-raspberry-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Original Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      className="w-full px-4 py-2 border border-green-dark-200 rounded-lg focus:outline-none focus:border-raspberry-300"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-green-dark-200 rounded-lg focus:outline-none focus:border-raspberry-300"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Men&apos;s Fashion">Men&apos;s Fashion</option>
                      <option value="Women&apos;s Fashion">Women&apos;s Fashion</option>
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
                      className="w-full px-4 py-2 border border-green-dark-200 rounded-lg focus:outline-none focus:border-raspberry-300"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isNew}
                      onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                      className="w-4 h-4 text-raspberry-600"
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
                      placeholder="Enter image URL (Unsplash, etc.)"
                      className="flex-1 px-4 py-2 border border-green-dark-200 rounded-lg focus:outline-none focus:border-raspberry-300"
                    />
                    <button
                      type="button"
                      onClick={addImage}
                      className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
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
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="sticky bottom-0 bg-white pt-4 border-t border-green-dark-100">
                  <button
                    type="submit"
                    className="w-full py-3 bg-raspberry-600 text-white rounded-full font-medium hover:bg-raspberry-700 transition-all"
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