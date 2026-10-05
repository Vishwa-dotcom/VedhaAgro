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
const CATALOG_VERSION = 'vedha-pricelist-2026-2027-pdf-import-v6';

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
        const catalogVersion = localStorage.getItem('vedha-catalog-version');
        const savedCatalog = new Map(
          Array.isArray(parsedProducts)
            ? parsedProducts
                .filter((product: Product) => product.id.startsWith('pdf-'))
                .map((product: Product) => [product.id, product])
            : []
        );
        const hasCurrentPdfCatalog = savedCatalog.size === initialProducts.length
          && initialProducts.every((product) => {
            const savedProduct = savedCatalog.get(product.id);
            return savedProduct?.name === product.name
              && savedProduct?.thumbnail === product.thumbnail
              && JSON.stringify(savedProduct?.images) === JSON.stringify(product.images)
              && JSON.stringify(savedProduct?.specifications) === JSON.stringify(product.specifications)
              && JSON.stringify(savedProduct?.priceTiers) === JSON.stringify(product.priceTiers);
          });
        const isCurrentCatalog = catalogVersion === CATALOG_VERSION && hasCurrentPdfCatalog;
        const adminProducts = isCurrentCatalog
          ? []
          : parsedProducts.filter(
              (product: Product) => product.id.startsWith('product-')
            );
        const productsToLoad = isCurrentCatalog
          ? parsedProducts
          : [...initialProducts, ...adminProducts];
        // Convert date strings back to Date objects
        const productsWithDates = productsToLoad.map((product: Product) => ({
          ...product,
          createdAt: new Date(product.createdAt),
          updatedAt: new Date(product.updatedAt),
        }));
        setProducts(productsWithDates);
        localStorage.setItem('vedha-catalog-version', CATALOG_VERSION);
      } catch (error) {
        console.error('Failed to load products:', error);
        setProducts(initialProducts);
        localStorage.setItem('vedha-catalog-version', CATALOG_VERSION);
      }
    } else {
      localStorage.setItem('vedha-catalog-version', CATALOG_VERSION);
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
