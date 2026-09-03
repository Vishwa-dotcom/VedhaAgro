'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, getTax, getTotal } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">
            Add some products to get started with your farming needs!
          </p>
          <Link
            href="/products"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-6 border-b border-gray-200 flex gap-4 hover:bg-gray-50 transition"
                >
                  {/* Product Image */}
                  <Link href={`/products/${item.productId}`}>
                    <div className="relative w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 cursor-pointer hover:opacity-80 transition">
                      <Image
                        src={item.product?.thumbnail || item.product?.images[0] || 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500'}
                        alt={item.product?.name || 'Product'}
                        fill
                        className="object-cover rounded-lg"
                        unoptimized
                      />
                    </div>
                  </Link>

                  {/* Product Details */}
                  <div className="flex-grow">
                    <Link href={`/products/${item.productId}`}>
                      <h3 className="font-bold text-gray-800 hover:text-green-600 transition">
                        {item.product?.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">
                      SKU: {item.product?.sku}
                    </p>
                    <p className="text-lg font-bold text-green-600 mt-2">
                      {formatCurrency(item.price)}
                    </p>
                  </div>

                  {/* Quantity Control */}
                  <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-1">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      className="p-1 text-gray-600 hover:bg-gray-100 rounded transition"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.quantity + 1
                        )
                      }
                      className="p-1 text-gray-600 hover:bg-gray-100 rounded transition"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right">
                    <p className="font-bold text-gray-800">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="mt-2 text-red-600 hover:text-red-700 text-sm font-semibold flex items-center gap-1 transition"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/products"
              className="mt-4 text-green-600 hover:text-green-700 font-semibold"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>{formatCurrency(getSubtotal())}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (5%)</span>
                  <span>{formatCurrency(getTax())}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Delivery</span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>

                <div className="border-t border-gray-200 pt-4 flex justify-between text-lg font-bold text-gray-800">
                  <span>Total</span>
                  <span className="text-green-600">{formatCurrency(getTotal())}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition text-center block mb-3"
              >
                Proceed to Checkout
              </Link>

              <button className="w-full border border-green-600 text-green-600 hover:bg-green-50 font-bold py-3 rounded-lg transition">
                Continue Shopping
              </button>

              {/* Trust Info */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg text-sm text-gray-700">
                <p className="font-semibold mb-2">✓ Why shop with us?</p>
                <ul className="space-y-1 text-xs">
                  <li>• 100% authentic products</li>
                  <li>• Secure checkout</li>
                  <li>• Fast delivery across India</li>
                  <li>• Easy returns policy</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
