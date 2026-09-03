'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, User, Phone } from 'lucide-react';

export default function AccountPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      if (email === 'customer@example.com' && password === 'password') {
        setIsLoggedIn(true);
      } else {
        alert('Invalid credentials. Try: customer@example.com / password');
      }
    } else {
      setIsLoggedIn(true);
    }
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-800">My Account</h1>
              <button
                onClick={() => {
                  setIsLoggedIn(false);
                  setEmail('');
                  setPassword('');
                }}
                className="text-red-600 hover:text-red-700 font-semibold"
              >
                Logout
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Profile Section */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Profile Information
                </h2>
                <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-800">{email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-semibold text-gray-800">Rajesh Kumar</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold text-gray-800">+91-9876543210</p>
                  </div>
                  <button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition">
                    Edit Profile
                  </button>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Quick Links
                </h2>
                <div className="space-y-2">
                  <Link
                    href="/account/orders"
                    className="block p-4 bg-gray-50 hover:bg-green-50 text-gray-800 hover:text-green-600 rounded-lg transition font-semibold"
                  >
                    📦 My Orders
                  </Link>
                  <Link
                    href="/addresses"
                    className="block p-4 bg-gray-50 hover:bg-green-50 text-gray-800 hover:text-green-600 rounded-lg transition font-semibold"
                  >
                    � Saved Addresses
                  </Link>
                  <Link
                    href="/wishlist"
                    className="block p-4 bg-gray-50 hover:bg-green-50 text-gray-800 hover:text-green-600 rounded-lg transition font-semibold"
                  >
                    ❤️ My Wishlist
                  </Link>
                  <Link
                    href="/settings"
                    className="block p-4 bg-gray-50 hover:bg-green-50 text-gray-800 hover:text-green-600 rounded-lg transition font-semibold"
                  >
                    ⚙️ Account Settings
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h2>
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <p className="text-gray-600">No orders yet</p>
                <Link
                  href="/products"
                  className="text-green-600 hover:text-green-700 font-semibold mt-2 inline-block"
                >
                  Start Shopping →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 to-green-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 px-4 font-bold rounded-lg transition ${
              isLogin
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 px-4 font-bold rounded-lg transition ${
              !isLogin
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name (Register Only) */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>
          )}

          {/* Phone (Register Only) */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="9876543210"
                  required
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="customer@example.com"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition mt-6"
          >
            {isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>

        {/* Demo Credentials */}
        {isLogin && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
            <p className="font-semibold mb-2">Demo Credentials:</p>
            <p>Email: customer@example.com</p>
            <p>Password: password</p>
          </div>
        )}

        {/* Footer Links */}
        {isLogin && (
          <div className="mt-6 text-center">
            <a href="#" className="text-green-600 hover:text-green-700 text-sm">
              Forgot password?
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
