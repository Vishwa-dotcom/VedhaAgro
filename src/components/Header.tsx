'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { getTotalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartItems = getTotalItems();

  return (
    <header className="sticky top-0 z-40 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <span className="hidden sm:inline font-bold text-lg text-gray-800">
              Vedha Agro
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-green-600 transition"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-gray-700 hover:text-green-600 transition"
            >
              Products
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-green-600 transition"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-green-600 transition"
            >
              Contact
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <Link href="/account" className="text-gray-700 hover:text-green-600">
              Account
            </Link>
            <Link
              href="/cart"
              className="relative text-gray-700 hover:text-green-600"
            >
              <ShoppingCart size={24} />
              {cartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 pt-2 space-y-2">
            <Link
              href="/"
              className="block px-4 py-2 text-gray-700 hover:bg-green-50 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/products"
              className="block px-4 py-2 text-gray-700 hover:bg-green-50 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 text-gray-700 hover:bg-green-50 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block px-4 py-2 text-gray-700 hover:bg-green-50 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
