'use client';

import Link from 'next/link';
import { ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 to-green-100 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-green-600 px-6 py-8 text-white">
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck size={28} />
            <h1 className="text-3xl font-bold">Guest Checkout</h1>
          </div>
          <p className="text-green-50 text-lg">
            No sign-in or registration is required to shop with Vedha Agro.
          </p>
        </div>

        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Link
              href="/products"
              className="group flex items-center justify-between rounded-xl border border-green-200 bg-green-50 p-6 hover:bg-green-100 transition"
            >
              <div>
                <p className="text-sm uppercase tracking-wide text-green-700 font-semibold">
                  Shop now
                </p>
                <h2 className="text-2xl font-bold text-gray-800 mt-2">Browse Products</h2>
              </div>
              <ArrowRight className="text-green-700 group-hover:translate-x-1 transition" />
            </Link>

            <Link
              href="/cart"
              className="group flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-6 hover:bg-gray-100 transition"
            >
              <div>
                <p className="text-sm uppercase tracking-wide text-gray-600 font-semibold">
                  Quick access
                </p>
                <h2 className="text-2xl font-bold text-gray-800 mt-2">View Cart</h2>
              </div>
              <ShoppingBag className="text-gray-700 group-hover:scale-105 transition" />
            </Link>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">How ordering works</h2>
            <ol className="space-y-3 text-gray-700 list-decimal list-inside">
              <li>Browse products and add items to your cart.</li>
              <li>Go to checkout without creating an account.</li>
              <li>Fill in your delivery details and place the order.</li>
              <li>The admin receives an immediate notification with the order details.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
