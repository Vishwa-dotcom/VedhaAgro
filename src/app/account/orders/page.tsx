'use client';

import { useOrders } from '@/context/OrderContext';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { Package, AlertCircle, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function OrdersPage() {
  const { orders } = useOrders();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-8">
            <Link
              href="/account"
              className="text-green-600 hover:text-green-700 font-semibold"
            >
              Account
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-700 font-semibold">Orders</span>
          </div>

          <div className="text-center py-16">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">No Orders Yet</h1>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders yet. Start shopping now!
            </p>
            <Link
              href="/products"
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold transition"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-8">
          <Link
            href="/account"
            className="text-green-600 hover:text-green-700 font-semibold"
          >
            Account
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-700 font-semibold">Orders</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Orders</h1>

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
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Order ID</p>
                        <p className="font-bold text-gray-800">{order.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Date</p>
                        <p className="font-semibold text-gray-800">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="font-bold text-green-600 text-lg">
                          {formatCurrency(order.total)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus.charAt(0).toUpperCase() +
                            order.orderStatus.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight
                    size={24}
                    className={`text-gray-400 transition transform ${
                      expandedOrderId === order.id ? 'rotate-90' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Order Details */}
              {expandedOrderId === order.id && (
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  {/* Items */}
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-800 mb-4">Items</h3>
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center bg-white p-4 rounded-lg"
                        >
                          <div>
                            <p className="font-semibold text-gray-800">
                              {item.productName}
                            </p>
                            <p className="text-sm text-gray-600">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-800">
                              {formatCurrency(item.subtotal)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatCurrency(item.price)} each
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-800 mb-4">
                      Delivery Address
                    </h3>
                    <div className="bg-white p-4 rounded-lg text-gray-700">
                      <p className="font-semibold">{order.deliveryAddress.name}</p>
                      <p>{order.deliveryAddress.address}</p>
                      <p>
                        {order.deliveryAddress.city},{' '}
                        {order.deliveryAddress.state} -{' '}
                        {order.deliveryAddress.pincode}
                      </p>
                      <p className="mt-2">{order.deliveryAddress.phone}</p>
                      <p className="text-sm text-gray-600">
                        {order.deliveryAddress.email}
                      </p>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-800 mb-4">
                      Price Breakdown
                    </h3>
                    <div className="bg-white p-4 rounded-lg space-y-2">
                      <div className="flex justify-between text-gray-700">
                        <span>Subtotal</span>
                        <span>{formatCurrency(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>Tax (5%)</span>
                        <span>{formatCurrency(order.tax)}</span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>Delivery Charges</span>
                        <span className="text-green-600 font-semibold">FREE</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t border-gray-200">
                        <span>Total</span>
                        <span className="text-green-600">
                          {formatCurrency(order.total)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment & Order Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                      <p className="font-semibold text-gray-800">
                        {order.paymentMethod === 'UPI' && '📱 UPI'}
                        {order.paymentMethod === 'CARD' && '💳 Credit/Debit Card'}
                        {order.paymentMethod === 'NETBANKING' && '🏦 Net Banking'}
                        {order.paymentMethod === 'COD' && '💵 Cash on Delivery'}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        Payment Status:{' '}
                        <span className="font-semibold text-green-600">
                          {order.paymentStatus.charAt(0).toUpperCase() +
                            order.paymentStatus.slice(1)}
                        </span>
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Order Status</p>
                      <p
                        className={`font-semibold ${getStatusColor(
                          order.orderStatus
                        ).replace('bg-', 'text-').split(' ')[0]}`}
                      >
                        {order.orderStatus.charAt(0).toUpperCase() +
                          order.orderStatus.slice(1)}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        Last Updated:{' '}
                        <span className="font-semibold">
                          {formatDate(order.updatedAt)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Back to Account */}
        <div className="mt-8">
          <Link
            href="/account"
            className="text-green-600 hover:text-green-700 font-semibold flex items-center gap-2"
          >
            ← Back to Account
          </Link>
        </div>
      </div>
    </div>
  );
}
