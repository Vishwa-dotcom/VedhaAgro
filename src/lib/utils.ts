// Common utility functions

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

export const calculateDiscount = (
  originalPrice: number,
  currentPrice: number
): number => {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Indian phone number validation
  const re = /^[6-9]\d{9}$/;
  return re.test(phone.replace(/\D/g, ''));
};

export const validatePincode = (pincode: string): boolean => {
  const re = /^\d{6}$/;
  return re.test(pincode);
};

export const truncateText = (text: string, length: number): string => {
  return text.length > length ? text.substring(0, length) + '...' : text;
};

export const generateOrderId = (): string => {
  return 'ORD-' + Date.now().toString().slice(-8);
};
