'use client';

import { useState, useEffect } from 'react';
import { useProducts } from '@/context/ProductContext';
import { useOrders } from '@/context/OrderContext';
import {
  Plus,
  Edit2,
  Trash2,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  Eye,
} from 'lucide-react';
import Link from 'next/link';
import { Order } from '@/types';
import { formatCurrency } from '@/lib/utils';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'orders' | 'customers'
  >('overview');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const { products, addProduct, deleteProduct } = useProducts();
  const { orders } = useOrders();
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    quantity: '',
    sku: '',
  });

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.quantity, 0);
  const totalValue = products.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.category && newProduct.price && newProduct.quantity && newProduct.sku) {
      addProduct({
        name: newProduct.name,
        category: newProduct.category,
        price: parseInt(newProduct.price),
        description: newProduct.description || 'No description provided',
        quantity: parseInt(newProduct.quantity),
        sku: newProduct.sku,
        originalPrice: parseInt(newProduct.price),
        specifications: {},
        features: [],
        images: ['https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500'],
        thumbnail: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500',
      });
      setShowAddProduct(false);
      setNewProduct({
        name: '',
        category: '',
        price: '',
        description: '',
        quantity: '',
        sku: '',
      });
      alert('Product added successfully!');
    } else {
      alert('Please fill in all required fields');
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId);
      alert('Product deleted successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-6 mb-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-green-100">Vedha Agro Management System</p>
          </div>
          <Link
            href="/"
            className="bg-white hover:bg-green-50 text-green-600 px-6 py-2 rounded-lg font-bold transition"
          >
            Back to Store
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-12">
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'orders', label: 'Orders', icon: ShoppingBag },
            { id: 'customers', label: 'Customers', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                  activeTab === tab.id
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-5 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-2">Total Products</p>
                    <p className="text-4xl font-bold text-gray-800">
                      {totalProducts}
                    </p>
                  </div>
                  <Package size={40} className="text-blue-500 opacity-20" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-2">Total Stock</p>
                    <p className="text-4xl font-bold text-gray-800">{totalStock}</p>
                  </div>
                  <Package size={40} className="text-green-500 opacity-20" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-2">Inventory Value</p>
                    <p className="text-2xl font-bold text-gray-800">
                      ₹{(totalValue / 100000).toFixed(1)}L
                    </p>
                  </div>
                  <BarChart3 size={40} className="text-purple-500 opacity-20" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-2">Total Orders</p>
                    <p className="text-4xl font-bold text-gray-800">{totalOrders}</p>
                  </div>
                  <ShoppingBag size={40} className="text-orange-500 opacity-20" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-2">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-600">
                      ₹{(totalRevenue / 100000).toFixed(1)}L
                    </p>
                  </div>
                  <BarChart3 size={40} className="text-green-500 opacity-20" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <button
                  onClick={() => {
                    setActiveTab('products');
                    setShowAddProduct(true);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold transition flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Add Product
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition">
                  View Orders
                </button>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-bold transition">
                  Manage Customers
                </button>
                <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-bold transition">
                  Reports
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Products</h2>
              <button
                onClick={() => setShowAddProduct(!showAddProduct)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold transition flex items-center gap-2"
              >
                <Plus size={20} />
                Add Product
              </button>
            </div>

            {/* Add Product Form */}
            {showAddProduct && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Add New Product
                </h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Product Name *"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="text"
                    placeholder="Category *"
                    value={newProduct.category}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, category: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <div className="grid md:grid-cols-3 gap-4">
                    <input
                      type="number"
                      placeholder="Price (₹) *"
                      value={newProduct.price}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, price: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <input
                      type="number"
                      placeholder="Quantity *"
                      value={newProduct.quantity}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, quantity: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <input
                      type="text"
                      placeholder="SKU *"
                      value={newProduct.sku}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, sku: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <textarea
                    placeholder="Description"
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, description: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={3}
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleAddProduct}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition"
                    >
                      Save Product
                    </button>
                    <button
                      onClick={() => setShowAddProduct(false)}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 rounded-lg transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Products Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-bold text-gray-800">
                        Product Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-gray-800">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-gray-800">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-gray-800">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-gray-800">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-800">
                            {product.name}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-800">
                          ₹{product.price}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-bold ${
                              product.quantity > 0
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {product.quantity}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button className="text-blue-600 hover:text-blue-700 font-bold" title="Edit (Coming Soon)">
                              <Edit2 size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 hover:text-red-700 font-bold"
                              title="Delete Product"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Recent Orders</h2>
              <span className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold">
                Total: {orders.length} orders
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg mb-4">
                  No orders yet. Orders will appear here when customers make purchases.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    {/* Order Header */}
                    <div
                      className="p-6 cursor-pointer hover:bg-gray-50 transition"
                      onClick={() =>
                        setExpandedOrderId(
                          expandedOrderId === order.id ? null : order.id
                        )
                      }
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-grow">
                          <div className="grid md:grid-cols-5 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">Order ID</p>
                              <p className="font-bold text-gray-800 text-sm">
                                {order.id}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Customer</p>
                              <p className="font-semibold text-gray-800">
                                {order.deliveryAddress.name}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Total</p>
                              <p className="font-bold text-green-600 text-lg">
                                {formatCurrency(order.total)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Items</p>
                              <p className="font-semibold text-gray-800">
                                {order.items.length} item(s)
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Status</p>
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                  order.orderStatus === 'confirmed'
                                    ? 'bg-purple-100 text-purple-800'
                                    : order.orderStatus === 'processing'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : order.orderStatus === 'shipped'
                                    ? 'bg-blue-100 text-blue-800'
                                    : order.orderStatus === 'delivered'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {order.orderStatus.charAt(0).toUpperCase() +
                                  order.orderStatus.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Eye
                          size={24}
                          className={`text-gray-400 transition transform ${
                            expandedOrderId === order.id ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </div>

                    {/* Order Details */}
                    {expandedOrderId === order.id && (
                      <div className="border-t border-gray-200 p-6 bg-gray-50">
                        <div className="grid md:grid-cols-2 gap-6">
                          {/* Items */}
                          <div>
                            <h3 className="font-bold text-gray-800 mb-4">Items</h3>
                            <div className="space-y-2">
                              {order.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex justify-between p-2 bg-white rounded"
                                >
                                  <span className="text-gray-800">
                                    {item.productName} x {item.quantity}
                                  </span>
                                  <span className="font-semibold text-gray-800">
                                    {formatCurrency(item.subtotal)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Delivery Details */}
                          <div>
                            <h3 className="font-bold text-gray-800 mb-4">
                              Delivery Address
                            </h3>
                            <div className="bg-white p-4 rounded text-sm text-gray-700 space-y-1">
                              <p className="font-semibold">
                                {order.deliveryAddress.name}
                              </p>
                              <p>{order.deliveryAddress.address}</p>
                              <p>
                                {order.deliveryAddress.city},{' '}
                                {order.deliveryAddress.state} -{' '}
                                {order.deliveryAddress.pincode}
                              </p>
                              <p>{order.deliveryAddress.phone}</p>
                              <p>{order.deliveryAddress.email}</p>
                            </div>
                          </div>
                        </div>

                        {/* Payment & Price Info */}
                        <div className="grid md:grid-cols-3 gap-4 mt-6">
                          <div className="bg-white p-4 rounded">
                            <p className="text-sm text-gray-600 mb-2">
                              Payment Method
                            </p>
                            <p className="font-semibold text-gray-800">
                              {order.paymentMethod === 'UPI' && '📱 UPI'}
                              {order.paymentMethod === 'CARD' &&
                                '💳 Credit/Debit Card'}
                              {order.paymentMethod === 'NETBANKING' &&
                                '🏦 Net Banking'}
                              {order.paymentMethod === 'COD' &&
                                '💵 Cash on Delivery'}
                            </p>
                            <p className="text-xs text-gray-600 mt-2">
                              Status:{' '}
                              <span className="font-semibold text-green-600">
                                {order.paymentStatus.charAt(0).toUpperCase() +
                                  order.paymentStatus.slice(1)}
                              </span>
                            </p>
                          </div>

                          <div className="bg-white p-4 rounded">
                            <p className="text-sm text-gray-600 mb-2">
                              Price Breakdown
                            </p>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span>{formatCurrency(order.subtotal)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Tax (5%):</span>
                                <span>{formatCurrency(order.tax)}</span>
                              </div>
                              <div className="flex justify-between font-bold text-base pt-2 border-t">
                                <span>Total:</span>
                                <span className="text-green-600">
                                  {formatCurrency(order.total)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white p-4 rounded">
                            <p className="text-sm text-gray-600 mb-2">Dates</p>
                            <div className="space-y-1 text-sm">
                              <p>
                                <span className="text-gray-600">Placed:</span>{' '}
                                <span className="font-semibold">
                                  {new Date(
                                    order.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </p>
                              <p>
                                <span className="text-gray-600">Updated:</span>{' '}
                                <span className="font-semibold">
                                  {new Date(order.updatedAt).toLocaleDateString()}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Customers</h2>
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Users size={64} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg mb-4">
                No customer data available yet.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
