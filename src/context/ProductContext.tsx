'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as initialProducts } from '@/lib/sampleData';
import { Product } from '@/types';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  deleteProduct: (productId: string) => void;
  updateProduct: (productId: string, product: Partial<Product>) => void;
  getProductById: (productId: string) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [mounted, setMounted] = useState(false);

  // Load products from localStorage on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('vedha-products');
    if (savedProducts) {
      try {
        const parsedProducts = JSON.parse(savedProducts);
        // Convert date strings back to Date objects
        const productsWithDates = parsedProducts.map((product: any) => ({
          ...product,
          createdAt: new Date(product.createdAt),
          updatedAt: new Date(product.updatedAt),
        }));
        setProducts(productsWithDates);
      } catch (error) {
        console.error('Failed to load products:', error);
        setProducts(initialProducts);
      }
    }
    setMounted(true);
  }, []);

  // Save products to localStorage whenever they change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('vedha-products', JSON.stringify(products));
    }
  }, [products, mounted]);

  const addProduct = (
    product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const newProduct: Product = {
      ...product,
      id: `product-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  const deleteProduct = (productId: string) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== productId)
    );
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, ...updates, updatedAt: new Date() }
          : product
      )
    );
  };

  const getProductById = (productId: string) => {
    return products.find((product) => product.id === productId);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        deleteProduct,
        updateProduct,
        getProductById,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
