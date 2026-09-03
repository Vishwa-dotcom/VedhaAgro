# 🛠️ Developer's Guide - Customization & Backend Integration

## Table of Contents
1. [Project Structure](#project-structure)
2. [Customization Guide](#customization-guide)
3. [Adding Features](#adding-features)
4. [Backend Integration](#backend-integration)
5. [Deployment](#deployment)
6. [Troubleshooting](#troubleshooting)

---

## 📁 Project Structure

```
vedha-agro/
│
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                  # Auth-related pages
│   │   ├── admin/                   # Admin dashboard
│   │   ├── products/                # Products routes
│   │   │   ├── page.tsx            # Product listing
│   │   │   └── [id]/               # Dynamic product detail
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── contact/
│   │   ├── about/
│   │   ├── layout.tsx              # Root layout with providers
│   │   ├── page.tsx                # Home page
│   │   └── globals.css             # Global styles
│   │
│   ├── components/                  # Reusable components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ProductCard.tsx
│   │
│   ├── context/                     # React Context
│   │   └── CartContext.tsx         # Cart state management
│   │
│   ├── lib/
│   │   ├── sampleData.ts           # Mock data (replace with API)
│   │   └── utils.ts                # Helper functions
│   │
│   └── types/
│       └── index.ts                # TypeScript interfaces
│
├── public/                          # Static assets
│
├── tailwind.config.ts              # Tailwind configuration
├── tsconfig.json                   # TypeScript config
├── next.config.ts                  # Next.js config
├── package.json                    # Dependencies
└── README.md                        # Documentation
```

---

## 🎨 Customization Guide

### 1. Change Brand Colors

Edit `tailwind.config.ts`:

```typescript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#16a34a',      // Change primary color
        secondary: '#15803d',    // Change secondary color
        accent: '#f0fdf4',       // Change accent color
      },
    },
  },
}
```

Then update Tailwind color references in components:
- Replace `green-600` with `primary`
- Replace `green-700` with `secondary`
- Replace `green-50` with `accent`

### 2. Modify Company Information

Edit the following files:

**Company Name**: `src/components/Header.tsx` and `src/components/Footer.tsx`
**Company Contact**: `src/app/contact/page.tsx`
**Company Description**: `src/app/about/page.tsx`

### 3. Update Logo & Branding

In `src/components/Header.tsx`:
```typescript
// Replace text logo with image
import Image from 'next/image';

<Image src="/logo.png" alt="Logo" width={40} height={40} />
```

### 4. Customize Home Page Sections

Edit `src/app/page.tsx`:

```typescript
// Modify hero section
const heroTitle = "Your Custom Title";
const heroSubtitle = "Your Custom Subtitle";

// Modify features
const features = [
  { icon: IconComponent, title: "Feature 1", description: "..." },
  // Add more features
];
```

### 5. Add/Remove Product Categories

Edit `src/lib/sampleData.ts`:

```typescript
export const categories: Category[] = [
  {
    id: '1',
    name: 'New Category',
    description: 'Category description',
    image: 'image-url',
  },
  // Add more categories
];
```

### 6. Modify Pricing & Taxes

Edit `src/lib/utils.ts`:

```typescript
// Change tax rate
export const TAX_RATE = 0.05; // 5% tax

// Change currency
export const CURRENCY = 'INR';
```

### 7. Customize Form Validation

Edit validation functions in `src/lib/utils.ts`:

```typescript
export const validateEmail = (email: string): boolean => {
  // Modify regex pattern
  const pattern = /^[your-pattern]$/;
  return pattern.test(email);
};
```

---

## ➕ Adding Features

### Add a New Page

1. Create directory: `src/app/new-page/`
2. Create file: `src/app/new-page/page.tsx`
3. Add content:

```typescript
'use client';

import Link from 'next/link';

export default function NewPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900">New Page</h1>
        {/* Your content */}
      </div>
    </div>
  );
}
```

4. Add link in `src/components/Header.tsx`

### Add New Product Properties

1. Update `src/types/index.ts`:

```typescript
export interface Product {
  // ... existing fields
  customField: string;
  anotherField: number;
}
```

2. Update `src/lib/sampleData.ts` with new fields

3. Update `ProductCard.tsx` to display new fields:

```typescript
<div>
  <p>{product.customField}</p>
</div>
```

### Add Product Reviews

1. Update types in `src/types/index.ts`:

```typescript
export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
}

export interface Product {
  // ... existing fields
  reviews: Review[];
}
```

2. Create `src/components/ReviewSection.tsx`:

```typescript
'use client';

interface ReviewSectionProps {
  productId: string;
  reviews: Review[];
}

export default function ReviewSection({ productId, reviews }: ReviewSectionProps) {
  return (
    <div className="mt-8 border-t pt-8">
      <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>
      {/* Display reviews */}
    </div>
  );
}
```

3. Add to product details page

### Add Wishlist Feature

1. Create `src/context/WishlistContext.tsx`:

```typescript
'use client';

import { createContext, useContext, useState } from 'react';

const WishlistContext = createContext<any>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
      );
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
```

2. Add to layout providers in `src/app/layout.tsx`

3. Use in ProductCard

---

## 🔌 Backend Integration

### 1. Replace Sample Data with API

**Before** (sampleData.ts):
```typescript
export const products: Product[] = [
  { id: '1', name: 'Product 1', ... },
  // Hard-coded data
];
```

**After** (API calls):
```typescript
export async function getProducts(): Promise<Product[]> {
  const response = await fetch('https://api.vedhaagro.com/products');
  if (!response.ok) throw new Error('Failed to fetch');
  return response.json();
}
```

### 2. Update Products Page to Use API

In `src/app/products/page.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    // Render products
  );
}
```

### 3. Create API Routes

Create `src/app/api/products/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Call your backend API
    const response = await fetch('https://your-backend.com/api/products', {
      headers: {
        'Authorization': `Bearer ${process.env.API_KEY}`,
      },
    });

    const products = await response.json();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
```

### 4. Add Authentication

Create `src/app/api/auth/login/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  try {
    const response = await fetch('https://your-backend.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    // Set auth token
    const res = NextResponse.json(data);
    res.cookies.set('auth-token', data.token, { httpOnly: true });
    return res;
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}
```

### 5. Update Cart Context to Use Backend

```typescript
// Add to CartContext.tsx

const saveCartToServer = async (cart: CartItem[]) => {
  await fetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: cart }),
  });
};

// Call when cart changes
useEffect(() => {
  saveCartToServer(items);
}, [items]);
```

### 6. Integrate Payment Gateway

```typescript
// In src/app/checkout/page.tsx

const processPayment = async (paymentMethod: string) => {
  if (paymentMethod === 'upi') {
    // Razorpay integration
    const response = await fetch('/api/payment/razorpay', {
      method: 'POST',
      body: JSON.stringify({
        amount: total,
        currency: 'INR',
      }),
    });

    const { orderId } = await response.json();
    // Open Razorpay payment window
  }
};
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add API_KEY
vercel env add DATABASE_URL

# Deploy production
vercel --prod
```

### Deploy to Other Platforms

**Netlify:**
```bash
npm install -D netlify-cli
netlify deploy --prod --dir=.next
```

**AWS Amplify:**
```bash
amplify init
amplify add hosting
amplify publish
```

**Docker:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=https://api.vedhaagro.com
DATABASE_URL=postgres://user:pass@localhost/db
API_KEY=your-secret-key
PAYMENT_KEY=razorpay-key
```

---

## 🐛 Troubleshooting

### Issue: Build Error - Module not found
**Solution:**
```bash
npm install [missing-package]
npm run build
```

### Issue: TypeScript Errors
**Solution:**
```bash
npm run type-check
# Fix type errors in console
```

### Issue: Styling Not Applied
**Solution:**
- Clear cache: `rm -rf .next`
- Rebuild: `npm run build`
- Check Tailwind config

### Issue: Cart Not Persisting
**Solution:**
- Check if localStorage is enabled
- Verify CartContext is wrapped in layout
- Check browser storage limit

### Issue: API Call Failing
**Solution:**
```typescript
// Add error handling
try {
  const response = await fetch('/api/endpoint');
  if (!response.ok) {
    console.error('HTTP Error:', response.status);
  }
} catch (error) {
  console.error('Fetch Error:', error);
}
```

---

## 📦 Useful Commands

```bash
# Development
npm run dev          # Start dev server
npm run lint         # Run linter
npm run type-check   # Check TypeScript

# Production
npm run build        # Build for production
npm start            # Start production server
npm run build && npm start

# Database
npm run db:seed      # Seed sample data
npm run db:migrate   # Run migrations

# Testing
npm test             # Run tests
npm test -- --watch  # Watch mode
```

---

## 🔐 Security Checklist

- [ ] Remove console.logs from production
- [ ] Add CORS headers
- [ ] Validate all inputs server-side
- [ ] Use environment variables for secrets
- [ ] Enable HTTPS only
- [ ] Add rate limiting
- [ ] Implement CSRF protection
- [ ] Sanitize user inputs
- [ ] Use secure cookies (HttpOnly, Secure, SameSite)
- [ ] Add Content Security Policy

---

## 📈 Performance Optimization

1. **Image Optimization**:
   ```typescript
   import Image from 'next/image';
   
   <Image
     src={url}
     alt="alt"
     width={400}
     height={400}
     priority={false}
   />
   ```

2. **Code Splitting**:
   ```typescript
   import dynamic from 'next/dynamic';
   
   const AdminPanel = dynamic(() => import('./AdminPanel'), {
     loading: () => <p>Loading...</p>
   });
   ```

3. **Caching**:
   ```typescript
   export const revalidate = 3600; // ISR: Revalidate every hour
   ```

---

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)
- [Vercel Deployment](https://vercel.com/docs)

---

## 🎓 Best Practices

1. Keep components small and focused
2. Use TypeScript for type safety
3. Implement proper error handling
4. Write meaningful commit messages
5. Use environment variables for config
6. Test before deploying
7. Document custom functions
8. Follow naming conventions
9. DRY principle (Don't Repeat Yourself)
10. Regular security updates

---

Happy coding! 🚀
