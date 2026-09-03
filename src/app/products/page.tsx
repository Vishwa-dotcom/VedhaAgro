'use client';

import { useState, useMemo } from 'react';
import { categories } from '@/lib/sampleData';
import { useProducts } from '@/context/ProductContext';
import ProductCard from '@/components/ProductCard';
import { Search, X } from 'lucide-react';

export default function ProductsPage() {
  const { products } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'latest' | 'price-low' | 'price-high' | 'popular'>(
    'latest'
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 15000]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = products;

    // Search filter
    if (searchTerm) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Price range filter
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sorting
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'popular':
          return b.quantity - a.quantity;
        case 'latest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return result;
  }, [products, searchTerm, selectedCategory, sortBy, priceRange]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Our Products</h1>
          <p className="text-gray-600">
            Browse our wide range of agricultural products and farming equipment
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="font-bold text-lg mb-4">Filters</h2>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Search Products
                </label>
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-3 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Category
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-3 py-2 rounded transition ${
                      selectedCategory === null
                        ? 'bg-green-100 text-green-700 font-semibold'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                        selectedCategory === cat.name
                          ? 'bg-green-100 text-green-700 font-semibold'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Price Range
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      max="15000"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([parseInt(e.target.value), priceRange[1]])
                      }
                      className="w-1/2 px-2 py-2 border border-gray-300 rounded text-sm"
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      min="0"
                      max="15000"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="w-1/2 px-2 py-2 border border-gray-300 rounded text-sm"
                      placeholder="Max"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    ₹{priceRange[0]} - ₹{priceRange[1]}
                  </p>
                </div>
              </div>

              {/* Clear Filters */}
              {(searchTerm || selectedCategory || priceRange[0] !== 0 || priceRange[1] !== 15000) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory(null);
                    setPriceRange([0, 15000]);
                  }}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded transition flex items-center justify-center gap-2"
                >
                  <X size={16} />
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="md:col-span-3">
            {/* Sort Options */}
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">
                Showing {filteredProducts.length} products
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="latest">Latest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>

            {/* Products */}
            {filteredProducts.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-lg">
                <p className="text-gray-500 text-lg">No products found</p>
                <p className="text-gray-400 mt-2">
                  Try adjusting your filters or search term
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
