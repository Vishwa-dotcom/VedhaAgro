import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Leaf, Zap, Shield, Truck } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { products } from '@/lib/sampleData';

export default function Home() {
  // Get featured products (first 4)
  const featuredProducts = products.slice(0, 4);
  
  // Get top sellers (products with high stock and sales appeal)
  const topSellers = products
    .filter((p) => p.quantity > 0)
    .slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to Vedha Agro
            </h1>
            <p className="text-lg md:text-xl mb-4 text-green-100">
              Your trusted partner for agricultural pesticides, pump sprayers, and quality spare parts. We provide reliable products that help farmers improve crop protection and farming efficiency across India.
            </p>
            <p className="text-green-100 mb-6">
              Your trusted partner for agricultural pesticides, pump sprayers, and quality spare parts, we have everything
              you need for successful farming.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center bg-white text-green-600 hover:bg-green-50 px-6 py-3 rounded-lg font-bold transition"
              >
                Shop Now
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center border-2 border-white text-white hover:bg-white hover:text-green-600 px-6 py-3 rounded-lg font-bold transition"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative h-96">
            <Image
              src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600"
              alt="Agricultural farming"
              fill
              className="object-cover rounded-lg"
              unoptimized
            />
          </div>
        </div>
      </section>

      {/* Why Choose Vedha Agro Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800">
            Why Choose Vedha Agro?
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            We are committed to providing the best agricultural products and
            customer service in the industry.
          </p>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="text-green-600" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Quality Products</h3>
              <p className="text-gray-600 text-sm">
                All our products are tested for durability and effectiveness
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="text-green-600" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Fast Delivery</h3>
              <p className="text-gray-600 text-sm">
                Quick and reliable delivery across India
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-green-600" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Secure Payment</h3>
              <p className="text-gray-600 text-sm">
                Multiple payment options including UPI and Cash on Delivery
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="text-green-600" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Expert Support</h3>
              <p className="text-gray-600 text-sm">
                Our team is always ready to help with product guidance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                Featured Products
              </h2>
              <p className="text-gray-600 mt-2">
                Check out our most popular agricultural products
              </p>
            </div>
            <Link
              href="/products"
              className="hidden md:inline text-green-600 hover:text-green-700 font-bold flex items-center gap-2"
            >
              View All
              <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <Link
            href="/products"
            className="md:hidden mt-8 block text-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold transition"
          >
            View All Products
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-50 to-green-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Shop by Category
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Category 1 */}
            <Link
              href="/products?category=pesticide-sprayers"
              className="relative h-48 rounded-lg overflow-hidden hover:shadow-lg transition group cursor-pointer"
            >
              <Image
                src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500"
                alt="Pesticide Sprayers"
                fill
                className="object-cover group-hover:scale-110 transition"
                unoptimized
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition flex items-end">
                <div className="p-4 w-full">
                  <h3 className="text-white font-bold text-xl">
                    Pesticide Sprayer Pumps
                  </h3>
                </div>
              </div>
            </Link>

            {/* Category 2 */}
            <Link
              href="/products?category=battery-sprayers"
              className="relative h-48 rounded-lg overflow-hidden hover:shadow-lg transition group cursor-pointer"
            >
              <Image
                src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500"
                alt="Battery Sprayers"
                fill
                className="object-cover group-hover:scale-110 transition"
                unoptimized
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition flex items-end">
                <div className="p-4 w-full">
                  <h3 className="text-white font-bold text-xl">Battery Sprayers</h3>
                </div>
              </div>
            </Link>

            {/* Category 3 */}
            <Link
              href="/products?category=agricultural-equipment"
              className="relative h-48 rounded-lg overflow-hidden hover:shadow-lg transition group cursor-pointer"
            >
              <Image
                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad576?w=500"
                alt="Agricultural Equipment"
                fill
                className="object-cover group-hover:scale-110 transition"
                unoptimized
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition flex items-end">
                <div className="p-4 w-full">
                  <h3 className="text-white font-bold text-xl">
                    Agricultural Equipment
                  </h3>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Top Sellers Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Top Sellers
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {topSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/products"
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold transition"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 bg-green-600 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-green-100 mb-6">
            Subscribe to our newsletter for exclusive offers, product launches, and
            farming tips.
          </p>
          <form className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-800"
              required
            />
            <button
              type="submit"
              className="bg-white hover:bg-green-50 text-green-600 px-8 py-3 rounded-lg font-bold transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
