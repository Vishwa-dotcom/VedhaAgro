import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Vedha Agro</h3>
            <p className="text-sm text-gray-400 mb-4">
              Your trusted partner in agricultural solutions and farming equipment.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition text-lg">
                f
              </a>
              <a href="#" className="hover:text-white transition text-lg">
                𝕏
              </a>
              <a href="#" className="hover:text-white transition text-lg">
                in
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-bold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/cart" className="hover:text-white transition">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-white transition">
                  My Account
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Track Order
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Returns & FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <Phone size={16} className="text-green-500 mt-1 flex-shrink-0" />
                <span>+91-9876543210</span>
              </li>
              <li className="flex gap-2">
                <Mail size={16} className="text-green-500 mt-1 flex-shrink-0" />
                <span>info@vedhaagro.com</span>
              </li>
              <li className="flex gap-2">
                <MapPin size={16} className="text-green-500 mt-1 flex-shrink-0" />
                <span>Bangalore, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; {currentYear} Vedha Agro. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white transition">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
