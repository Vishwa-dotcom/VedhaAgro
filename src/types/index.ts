// User and Authentication Types
export interface User {
  id: string;
  email: string;
  password?: string; // Only for internal use
  name: string;
  phone: string;
  role: 'customer' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  specifications: Record<string, string>;
  features: string[];
  images: string[];
  thumbnail: string;
  quantity: number;
  sku: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
}

// Cart Types
export interface CartItem {
  id: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
  addedAt: Date;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  updatedAt: Date;
}

// Order Types
export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface DeliveryAddress {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  deliveryAddress: DeliveryAddress;
  subtotal: number;
  tax: number;
  deliveryCharges: number;
  total: number;
  paymentMethod: 'UPI' | 'CARD' | 'NETBANKING' | 'COD';
  paymentStatus: 'pending' | 'completed' | 'failed';
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
