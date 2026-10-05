import { ReactNode } from 'react';
import { products } from '@/lib/sampleData';

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export default function ProductDetailsLayout({ children }: { children: ReactNode }) {
  return children;
}