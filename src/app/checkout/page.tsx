'use client';

import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrderContext';
import { formatCurrency, generateOrderId, validateEmail, validatePhone, validatePincode } from '@/lib/utils';
import Link from 'next/link';
import { useState } from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { Order } from '@/types';

export default function CheckoutPage() {
  const { items, getSubtotal, getTax, getTotal, clearCart } = useCart();
  const { addOrder } = useOrders();
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderId, setOrderId] = useState<string>('');

  // Form data
  const [deliveryDetails, setDeliveryDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING' | 'COD'>('COD');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (items.length === 0 && !isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle size={64} className="mx-auto text-red-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Cart is Empty</h1>
          <p className="text-gray-600 mb-6">
            Please add products to your cart before checkout.
          </p>
          <Link
            href="/products"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 mb-4">
            Thank you for your purchase. Your order has been confirmed.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Order ID: <span className="font-bold text-gray-800">{orderId}</span>
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/account/orders"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-bold transition"
            >
              View Your Orders
            </Link>
            <Link
              href="/"
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!deliveryDetails.name.trim()) newErrors.name = 'Name is required';
    if (!validateEmail(deliveryDetails.email))
      newErrors.email = 'Valid email is required';
    if (!validatePhone(deliveryDetails.phone))
      newErrors.phone = 'Valid phone number is required';
    if (!deliveryDetails.address.trim())
      newErrors.address = 'Address is required';
    if (!deliveryDetails.city.trim()) newErrors.city = 'City is required';
    if (!deliveryDetails.state.trim()) newErrors.state = 'State is required';
    if (!validatePincode(deliveryDetails.pincode))
      newErrors.pincode = 'Valid pincode is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const newOrderId = generateOrderId();
      
      // Create order object
      const newOrder: Order = {
        id: newOrderId,
        userId: 'guest-user', // In a real app, this would be the logged-in user
        items: items.map((item) => ({
          id: item.id,
          productId: item.productId,
          productName: item.product?.name || 'Unknown Product',
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity,
        })),
        deliveryAddress: {
          name: deliveryDetails.name,
          email: deliveryDetails.email,
          phone: deliveryDetails.phone,
          address: deliveryDetails.address,
          city: deliveryDetails.city,
          state: deliveryDetails.state,
          pincode: deliveryDetails.pincode,
          isDefault: false,
        },
        subtotal: getSubtotal(),
        tax: getTax(),
        deliveryCharges: 0,
        total: getTotal(),
        paymentMethod: paymentMethod,
        paymentStatus: 'completed',
        orderStatus: 'confirmed',
        notes: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Save order and clear cart
      addOrder(newOrder);
      setOrderId(newOrderId);
      setIsSubmitted(true);
      clearCart();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  s <= step
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {s}
              </div>
              <div
                className={`flex-1 h-1 mx-2 ${
                  s < step ? 'bg-green-600' : 'bg-gray-300'
                }`}
              />
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {/* Step 1: Delivery Details */}
            {step === 1 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Delivery Details
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={deliveryDetails.name}
                      onChange={(e) =>
                        setDeliveryDetails({ ...deliveryDetails, name: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={deliveryDetails.email}
                        onChange={(e) =>
                          setDeliveryDetails({
                            ...deliveryDetails,
                            email: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="john@example.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={deliveryDetails.phone}
                        onChange={(e) =>
                          setDeliveryDetails({
                            ...deliveryDetails,
                            phone: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="9876543210"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Address *
                    </label>
                    <textarea
                      value={deliveryDetails.address}
                      onChange={(e) =>
                        setDeliveryDetails({
                          ...deliveryDetails,
                          address: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="House No., Street, Colony..."
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={deliveryDetails.city}
                        onChange={(e) =>
                          setDeliveryDetails({
                            ...deliveryDetails,
                            city: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Bangalore"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        value={deliveryDetails.state}
                        onChange={(e) =>
                          setDeliveryDetails({
                            ...deliveryDetails,
                            state: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Karnataka"
                      />
                      {errors.state && (
                        <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        value={deliveryDetails.pincode}
                        onChange={(e) =>
                          setDeliveryDetails({
                            ...deliveryDetails,
                            pincode: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="560001"
                      />
                      {errors.pincode && (
                        <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {step === 2 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Payment Method
                </h2>

                <div className="space-y-4 mb-6">
                  {['UPI', 'CARD', 'NETBANKING', 'COD'].map((method) => (
                    <label
                      key={method}
                      className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method}
                        checked={paymentMethod === method}
                        onChange={(e) =>
                          setPaymentMethod(e.target.value as typeof paymentMethod)
                        }
                        className="w-4 h-4"
                      />
                      <span className="ml-3 font-semibold text-gray-800">
                        {method === 'UPI' && '📱 UPI'}
                        {method === 'CARD' && '💳 Credit/Debit Card'}
                        {method === 'NETBANKING' && '🏦 Net Banking'}
                        {method === 'COD' && '💵 Cash on Delivery'}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> For this demo, no actual payment processing
                    will occur. You can proceed with any payment method.
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-lg transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition"
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review Order */}
            {step === 3 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Review Your Order
                </h2>

                {/* Delivery Details Summary */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold text-gray-800 mb-3">Delivery To</h3>
                  <p className="text-gray-700">{deliveryDetails.name}</p>
                  <p className="text-gray-600">{deliveryDetails.address}</p>
                  <p className="text-gray-600">
                    {deliveryDetails.city}, {deliveryDetails.state} -{' '}
                    {deliveryDetails.pincode}
                  </p>
                  <p className="text-gray-600">{deliveryDetails.phone}</p>
                </div>

                {/* Payment Method Summary */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold text-gray-800 mb-2">Payment Method</h3>
                  <p className="text-gray-700">
                    {paymentMethod === 'UPI' && '📱 UPI'}
                    {paymentMethod === 'CARD' && '💳 Credit/Debit Card'}
                    {paymentMethod === 'NETBANKING' && '🏦 Net Banking'}
                    {paymentMethod === 'COD' && '💵 Cash on Delivery'}
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-lg transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.product?.name} x {item.quantity}
                    </span>
                    <span className="font-semibold text-gray-800">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>{formatCurrency(getSubtotal())}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (5%)</span>
                  <span>{formatCurrency(getTax())}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Delivery</span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-green-600">{formatCurrency(getTotal())}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
