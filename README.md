# Vedha Agro - E-Commerce Platform for Agricultural Products

A modern, professional, and fully responsive e-commerce website for **Vedha Agro**, a leading supplier of agricultural equipment and pesticide sprayers in India.

## 🌟 Features

### Customer Features
- ✅ **Browse Products** - Search, filter, and sort products by category, price, and popularity
- ✅ **Product Details** - Comprehensive product information with specifications, features, and related products
- ✅ **Shopping Cart** - Add/remove items, update quantities with persistent storage
- ✅ **Checkout Process** - Multi-step checkout with delivery details and payment method selection
- ✅ **User Accounts** - Login/registration system with account management
- ✅ **Order Management** - View order history and track orders
- ✅ **Contact Us** - Contact form, location map, and customer support information
- ✅ **Responsive Design** - Fully optimized for mobile, tablet, and desktop

### Admin Dashboard
- 📊 **Dashboard Overview** - Real-time statistics on products, stock, and inventory value
- 📦 **Product Management** - Add, edit, and delete products with pricing and stock management
- 🛒 **Order Management** - View and manage customer orders
- 👥 **Customer Management** - Access customer information and order history
- 📈 **Sales Reports** - Track sales performance and metrics

## 🚀 Technology Stack

- **Frontend**: Next.js 16 with TypeScript
- **Styling**: Tailwind CSS with green agricultural theme
- **State Management**: React Context API for cart management
- **Icons**: Lucide React
- **Database**: In-memory sample data (easily integrable with any backend)
- **Payment Integration Ready**: Support for UPI, Credit/Debit Card, Net Banking, and Cash on Delivery

## 📁 Project Structure

```
vedha-agro/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── admin/             # Admin dashboard pages
│   │   ├── products/          # Product pages
│   │   │   └── [id]/          # Dynamic product details
│   │   ├── cart/              # Shopping cart page
│   │   ├── checkout/          # Checkout page
│   │   ├── account/           # User authentication
│   │   ├── contact/           # Contact page
│   │   ├── about/             # About page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   │
│   ├── components/            # Reusable React components
│   │   ├── Header.tsx         # Navigation header
│   │   ├── Footer.tsx         # Footer
│   │   └── ProductCard.tsx    # Product card component
│   │
│   ├── context/               # React Context for state management
│   │   └── CartContext.tsx    # Shopping cart context
│   │
│   ├── lib/                   # Utility functions and data
│   │   ├── utils.ts           # Helper functions
│   │   └── sampleData.ts      # Sample products and users
│   │
│   └── types/                 # TypeScript type definitions
│       └── index.ts           # All app types
│
├── package.json               # Project dependencies
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.ts         # Tailwind CSS configuration
└── README.md                  # This file
```

## 📦 Sample Data

The project includes realistic sample data with:
- **9 Products** across 6 categories:
  - Pesticide Sprayer Pumps
  - Battery Sprayers
  - Manual Sprayers
  - Agricultural Equipment
  - Spare Parts & Accessories
  - Other Farming Products

- **2 Demo Users**:
  - Customer: `customer@example.com` / `password`
  - Admin: `admin@vedhaagro.com`

## 🎨 Design Highlights

### Color Scheme
- **Primary Green**: `#16a34a` (Agricultural, trust, nature)
- **Dark Green**: `#15803d` (Farming, reliability)
- **Light Green**: `#f0fdf4` (Clean, fresh)
- **Neutrals**: Gray tones for balance

### Components
- Clean, card-based layout
- Smooth transitions and hover effects
- Mobile-first responsive design
- Professional agricultural imagery
- Trust badges and security indicators

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm 9+

### Getting Started

1. **Navigate to project directory**:
   ```bash
   cd vedha-agro
   ```

2. **Install dependencies** (already done):
   ```bash
   npm install
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   ```
   http://localhost:3000
   ```

### Build for Production
```bash
npm run build
npm start
```

## 📖 Page Routes

| Route | Purpose |
|-------|---------|
| `/` | Home page with hero, featured products, categories |
| `/products` | Product listing with filters and search |
| `/products/[id]` | Product details page |
| `/cart` | Shopping cart |
| `/checkout` | Multi-step checkout |
| `/account` | Login/Register and account management |
| `/contact` | Contact form and support info |
| `/about` | Company information and values |
| `/admin` | Admin dashboard |

## 💡 Key Features Explained

### Shopping Cart
- Uses React Context API for state management
- Persists to browser localStorage
- Real-time calculations for subtotal, tax, and total
- Easy quantity adjustment and item removal

### Product Filtering
- Filter by category
- Price range filtering
- Full-text search
- Sort by latest, price (low-high, high-low), popularity

### Checkout Flow
1. **Delivery Details** - Name, email, phone, address
2. **Payment Method** - UPI, Card, Net Banking, COD
3. **Order Review** - Confirm details and place order

### Admin Dashboard
- View real-time inventory metrics
- Quick access to product management
- Ready for backend integration

## 🔧 Customization Guide

### Adding New Products
Edit `src/lib/sampleData.ts` and add to the `products` array:

```typescript
{
  id: '10',
  name: 'Your Product Name',
  category: 'Category Name',
  price: 2999,
  originalPrice: 3999,
  description: 'Product description',
  specifications: { /* specs */ },
  features: ['Feature 1', 'Feature 2'],
  images: ['image-url-1', 'image-url-2'],
  thumbnail: 'image-url',
  quantity: 50,
  sku: 'SKU-001',
  createdAt: new Date(),
  updatedAt: new Date(),
}
```

### Changing Brand Colors
Edit `tailwind.config.ts` to modify the color theme:

```typescript
theme: {
  extend: {
    colors: {
      primary: '#16a34a', // Green
      // Add your colors here
    }
  }
}
```

### Adding Payment Integration
Update the checkout process in `src/app/checkout/page.tsx` to integrate with your payment provider (Razorpay, PayU, etc.).

## 📱 Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔐 Security Notes
- This is a frontend demo - implement backend validation for all operations
- Password storage is demo-only - use proper authentication
- Payment processing must be handled securely on the backend
- Input validation is present but should be reinforced server-side

## 📊 Performance
- Built with Next.js for optimized performance
- Image optimization with next/image
- CSS minification with Tailwind
- Production build: ~500KB gzipped

## 🚦 Future Enhancements
- Backend API integration (Node.js/Express, Python/Django, etc.)
- Real payment gateway integration (Razorpay, PayU)
- Email notifications for orders
- SMS tracking updates
- Advanced analytics dashboard
- Customer reviews and ratings
- Wishlist functionality
- Compare products feature
- Seasonal promotions and discounts

## 📞 Support

For the demo, customer support information:
- **Phone**: +91-9876543210
- **Email**: info@vedhaagro.com
- **Address**: Bangalore, Karnataka, India

## 📄 License

This project is created as a demonstration of a professional e-commerce platform for agricultural products.

## 🤝 Integration Ready

This frontend is ready to integrate with:
- RESTful APIs
- GraphQL backends
- Headless CMS systems
- Third-party payment providers
- Email/SMS services
- Analytics platforms

---

**Built with ❤️ for farmers and agricultural businesses**

Visit http://localhost:3000 to see the website in action!
