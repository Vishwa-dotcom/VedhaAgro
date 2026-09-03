'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Clock,
  Share2,
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-green-100 text-lg">
            We're here to help you with any questions about our products and services
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Contact Info Cards */}
          {/* Phone */}
          <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Call Us</h3>
            <p className="text-gray-600 mb-4">
              Our team is available Monday to Saturday, 9 AM to 6 PM
            </p>
            <a
              href="tel:+918494868403"
              className="text-green-600 hover:text-green-700 font-bold text-lg"
            >
              +91-8494868403
            </a>
          </div>

          {/* Email */}
          <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Email Us</h3>
            <p className="text-gray-600 mb-4">
              We'll respond to your emails within 24 hours
            </p>
            <a
              href="mailto:info@vedhaagro.com"
              className="text-green-600 hover:text-green-700 font-bold text-lg break-all"
            >
              info@vedhaagro.com
            </a>
          </div>

          {/* Location */}
          <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Visit Us</h3>
            <p className="text-gray-600 mb-4">
              Vedha Agro, Ghataprabha
            </p>
            <address className="text-green-600 hover:text-green-700 font-bold not-italic">
              Opposite to JG Co-Operative Hospital<br />
              Ghataprabha, Karnataka 591306<br />
            </address>
          </div>
        </div>

        {/* Contact Form & Map */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Send us a Message
            </h2>

            {submitted && (
              <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
                Thank you for your message! We'll get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Your Name"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Your Phone Number"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="product-inquiry">Product Inquiry</option>
                  <option value="bulk-order">Bulk Order</option>
                  <option value="support">Customer Support</option>
                  <option value="partnership">Partnership</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Your message here..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                <MessageSquare size={20} />
                Send Message
              </button>
            </form>
          </div>

          {/* Additional Info */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Why Contact Us?
            </h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="text-green-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Quick Response</h3>
                  <p className="text-gray-600">
                    We aim to respond to all inquiries within 24 hours
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="text-green-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Expert Support</h3>
                  <p className="text-gray-600">
                    Our experts can help you choose the right products
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="text-green-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Multiple Channels</h3>
                  <p className="text-gray-600">
                    Reach us via phone, email, or WhatsApp for your convenience
                  </p>
                </div>
              </div>
            </div>

            {/* WhatsApp & Social Links */}
            <div className="mt-12 p-6 bg-green-50 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-4">Connect With Us</h3>
              <div className="space-y-3 mb-4">
                <a
                  href="https://wa.me/918494868493"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold"
                >
                  💬 WhatsApp: +91-8494868493
                </a>
              </div>

              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-green-100 transition text-lg"
                >
                  f
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-green-100 transition text-lg"
                >
                  𝕏
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-green-100 transition text-lg"
                >
                  in
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Location</h2>
          <div className="w-full h-96 bg-gray-200 rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps?q=16.238963575050068,74.752250898992&z=15&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
