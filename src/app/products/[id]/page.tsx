'use client';

import { useProducts } from '@/context/ProductContext';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  formatCurrency,
  calculateDiscount,
  truncateText,
} from '@/lib/utils';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Heart, Check, Truck, Shield } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { products } = useProducts();
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    notFound();
  }

  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [addedToCart, setAddedToCart] = useState(false);

  const discount = product.originalPrice
    ? calculateDiscount(product.originalPrice, product.price)
    : 0;

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  // Related products (same category)
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-green-600">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-green-600">
            Products
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-semibold">{product.name}</span>
        </div>

        {/* Product Details */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Images */}
          <div>
            {/* Main Image */}
            <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4">
              <div className="relative w-full h-96">
                <Image
                  src={selectedImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Discount Badge */}
              {discount > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-2 rounded-lg font-bold">
                  {discount}% OFF
                </div>
              )}

              {/* Wishlist Button */}
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute top-4 left-4 bg-white rounded-full p-3 hover:bg-gray-100 transition"
              >
                <Heart
                  size={20}
                  className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                />
              </button>
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-20 border-2 rounded-lg overflow-hidden transition ${
                      selectedImage === img
                        ? 'border-green-600'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            {/* Title & Category */}
            <p className="text-sm text-green-600 font-semibold mb-2">
              {product.category}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {product.name}
            </h1>

            {/* Description */}
            <p className="text-gray-600 text-lg mb-6">{product.description}</p>

            {/* Price */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-3xl font-bold text-green-600">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      {formatCurrency(product.originalPrice)}
                    </span>
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">
                      Save {formatCurrency(product.originalPrice - product.price)}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Specifications */}
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-4 text-gray-800">Specifications</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between items-start p-3 bg-gray-50 rounded"
                  >
                    <span className="font-semibold text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span className="text-gray-600 text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-4 text-gray-800">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check size={20} className="text-green-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stock Status */}
            <div className="mb-8">
              <p
                className={`text-lg font-semibold ${
                  product.quantity > 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {product.quantity > 0
                  ? `${product.quantity} in stock`
                  : 'Out of Stock'}
              </p>
            </div>

            {/* Quantity & Add to Cart */}
            {product.quantity > 0 && (
              <div className="mb-8 flex gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-16 text-center py-2 focus:outline-none"
                    min="1"
                    max={product.quantity}
                  />
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.quantity, quantity + 1))
                    }
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold transition flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
              </div>
            )}

            {/* Buy Now Button */}
            {product.quantity > 0 && (
              <Link
                href="/checkout"
                className="block text-center border-2 border-green-600 hover:bg-green-50 text-green-600 py-3 rounded-lg font-bold transition mb-8"
              >
                Buy Now
              </Link>
            )}

            {/* Success Message */}
            {addedToCart && (
              <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg flex items-center gap-2">
                <Check size={20} />
                Added to cart successfully!
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex gap-3 items-start">
                <Truck size={24} className="text-blue-600 flex-shrink-0" />
                <div>
                  <p className="font-bold text-gray-800">Fast Delivery</p>
                  <p className="text-sm text-gray-600">2-3 days delivery</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <Shield size={24} className="text-blue-600 flex-shrink-0" />
                <div>
                  <p className="font-bold text-gray-800">Secure Payment</p>
                  <p className="text-sm text-gray-600">100% safe checkout</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              Related Products
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
