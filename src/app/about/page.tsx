import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, Users, Trophy, Leaf } from 'lucide-react';

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Vedha Agro</h1>
          <p className="text-green-100 text-lg">
            Empowering farmers with modern agricultural solutions since 2015
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Vedha Agro was founded with a simple mission: to provide farmers with high-quality
              agricultural pesticides, durable pump sprayers, and reliable spare parts that
              enhance productivity and crop protection. What began as a small enterprise has
              grown into a trusted name in the agricultural sector, serving farmers with
              innovative solutions and dependable products across India.
            </p>
            <p className="text-gray-600 mb-4">
              We believe every farmer deserves access to effective agricultural pesticides,
              reliable pump sprayers, and quality spare parts that improve crop protection
              and farming efficiency. Our commitment to quality and customer satisfaction
              has made us a trusted supplier for farmers across India.
            </p>
            <p className="text-gray-600">
              Today, we serve thousands of farmers across the country with trusted,
              durable products and excellent customer support.
            </p>
          </div>

          <div className="relative h-96">
            <Image
              src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600"
              alt="Our team"
              fill
              className="object-cover rounded-lg"
              unoptimized
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-8 mb-16 py-12 bg-green-50 rounded-lg px-8">
          <div className="text-center">
            <p className="text-4xl font-bold text-green-600 mb-2">10,000+</p>
            <p className="text-gray-700 font-semibold">Happy Customers</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-green-600 mb-2">15+</p>
            <p className="text-gray-700 font-semibold">Years in Business</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-green-600 mb-2">50+</p>
            <p className="text-gray-700 font-semibold">Product Categories</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-green-600 mb-2">100%</p>
            <p className="text-gray-700 font-semibold">Quality Guarantee</p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            Our Values
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="text-green-600" size={32} />
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Sustainability</h3>
              <p className="text-gray-600">
                We promote eco-friendly farming practices and sustainable agriculture
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-green-600" size={32} />
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Quality</h3>
              <p className="text-gray-600">
                Every product is thoroughly tested for durability and effectiveness
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-green-600" size={32} />
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Community</h3>
              <p className="text-gray-600">
                We support farmers and agricultural communities through education and
                assistance
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="text-green-600" size={32} />
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Excellence</h3>
              <p className="text-gray-600">
                We strive for excellence in every aspect of our business operations
              </p>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-green-50 p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h3>
            <p className="text-gray-700">
              To provide high-quality, affordable agricultural equipment and products
              that empower farmers to increase productivity, reduce labor costs, and
              adopt sustainable farming practices. We are committed to being the trusted
              partner for every farmer's agricultural needs.
            </p>
          </div>

          <div className="bg-green-50 p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h3>
            <p className="text-gray-700">
              To become the leading provider of agricultural solutions in India,
              recognized for innovation, quality, and customer excellence. We envision
              a future where every farmer has access to the tools they need for
              successful and sustainable agriculture.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Grow With Us?</h2>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            Join thousands of farmers who trust Vedha Agro for their agricultural
            equipment and products.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-block bg-white hover:bg-green-50 text-green-600 px-8 py-3 rounded-lg font-bold transition"
            >
              Shop Now
            </Link>
            <Link
              href="/contact"
              className="inline-block border-2 border-white hover:bg-white hover:text-green-600 text-white px-8 py-3 rounded-lg font-bold transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
