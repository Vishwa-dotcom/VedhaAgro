import catalogRows from '@/lib/pricelistCatalog.json';
import productSpecifications from '@/lib/pricelistSpecifications.json';
import { Category, Product, ProductPriceTier } from '@/types';

export const categories: Category[] = [
  {
    id: '1',
    name: 'Pesticide Sprayer Pumps',
    slug: 'pesticide-sprayers',
    description: 'Power sprayers for agricultural crop protection',
  },
  {
    id: '2',
    name: 'Battery Sprayers',
    slug: 'battery-sprayers',
    description: 'Battery-powered sprayers listed in the pricelist',
  },
  {
    id: '3',
    name: 'Manual Sprayers',
    slug: 'manual-sprayers',
    description: 'Manual sprayers and related equipment',
  },
  {
    id: '4',
    name: 'Agricultural Equipment',
    slug: 'agricultural-equipment',
    description: 'Agricultural equipment listed in the pricelist',
  },
  {
    id: '5',
    name: 'Spare Parts & Accessories',
    slug: 'spare-parts',
    description: 'Sprayer parts, batteries, motors, and accessories',
  },
  {
    id: '6',
    name: 'Other Farming Products',
    slug: 'other-products',
    description: 'Other farming products',
  },
];

interface PricelistRow {
  id: string;
  name: string;
  category: string;
  priceTiers: ProductPriceTier[];
}

const specificationsByPdfId = productSpecifications as Record<string, Record<string, string>>;

export const products: Product[] = [...(catalogRows as PricelistRow[])]
  .sort((first, second) => Number(first.id) - Number(second.id))
  .map((row) => {
  const priceTiers = [...row.priceTiers].sort(
    (first, second) => first.minimumQuantity - second.minimumQuantity
  );
  const minimumOrderTier = priceTiers[0];

  return {
    id: `pdf-${row.id}`,
    name: row.name,
    category: row.category,
    price: minimumOrderTier.price,
    description: 'Product information and quantity-based prices from the Vedha Agro 2026-2027 pricelist.',
    specifications: specificationsByPdfId[row.id] ?? {},
    features: [],
    images: Number(row.id) <= 34 ? [`/catalog/pdf-${row.id}.png`] : [],
    thumbnail: Number(row.id) <= 34 ? `/catalog/pdf-${row.id}.png` : '',
    quantity: null,
    sku: `PDF-${row.id}`,
    priceTiers,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  };
  });
