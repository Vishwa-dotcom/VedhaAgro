'use client';

import { Product } from '@/types';
import { formatCurrency, calculateDiscount } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const discount = product.originalPrice
    ? calculateDiscount(product.originalPrice, product.price)
    : 0;

  const handleAddToCart = () => {
    addItem(product, 1);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col h-full">
      {/* Image Container */}
      <Link href={`/products/${product.id}`} className="relative overflow-hidden">
        <div className="relative w-full h-48 bg-gray-100">
          <Image
            src={product.thumbnail || product.images[0]}
            alt={product.name}
            fill
            className="object-cover hover:scale-110 transition-transform duration-300"
            unoptimized
          />
        </div>

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
            {discount}% OFF
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-2 left-2 bg-white rounded-full p-2 hover:bg-gray-100 transition"
        >
          <Heart
            size={18}
            className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}
          />
        </button>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Category */}
        <p className="text-xs text-green-600 font-semibold mb-1">
          {product.category}
        </p>

        {/* Name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-green-600 transition mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-xs text-gray-600 line-clamp-2 mb-3 flex-grow">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-green-600">
            {formatCurrency(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <p
          className={`text-xs mb-3 ${
            product.quantity > 0
              ? 'text-green-600 font-semibold'
              : 'text-red-600 font-semibold'
          }`}
        >
          {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
        </p>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={product.quantity <= 0}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white py-2 rounded-md font-semibold text-sm transition flex items-center justify-center gap-2"
          >
            <ShoppingCart size={16} />
            Add
          </button>
          <Link
            href={`/products/${product.id}`}
            className="flex-1 border border-green-600 hover:bg-green-50 text-green-600 py-2 rounded-md font-semibold text-sm transition"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}
