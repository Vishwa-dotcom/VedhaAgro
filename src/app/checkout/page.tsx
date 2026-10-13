'use client';

import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrderContext';
import { formatCurrency, generateOrderId, validateEmail, validatePhone, validatePincode } from '@/lib/utils';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { Order } from '@/types';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          'expired-callback': () => void;
          'error-callback': () => void;
        }
      ) => string;
      remove: (widgetId: string) => void;
    };
  }
}

type SmsStatus = 'not-configured' | 'sending' | 'sent' | 'failed';

const smsEndpoint = process.env.NEXT_PUBLIC_ORDER_SMS_ENDPOINT;
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export default function CheckoutPage() {
  const { items, getSubtotal, getTax, getTotal, clearCart } = useCart();
  const { addOrder } = useOrders();
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderId, setOrderId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [smsStatus, setSmsStatus] = useState<SmsStatus>('not-configured');
  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileContainer = useRef<HTMLDivElement>(null);

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

  const paymentMethod = 'COD' as const;
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (step !== 3 || !smsEndpoint || !turnstileSiteKey || !turnstileContainer.current) return;

    let widgetId: string | undefined;
    let isActive = true;
    const renderWidget = () => {
      if (!isActive || !window.turnstile || !turnstileContainer.current) return;
      widgetId = window.turnstile.render(turnstileContainer.current, {
        sitekey: turnstileSiteKey,
        callback: setTurnstileToken,
        'expired-callback': () => setTurnstileToken(''),
        'error-callback': () => setTurnstileToken(''),
      });
    };

    const existingScript = document.querySelector<HTMLScriptElement>('script[data-turnstile]');
    if (window.turnstile) {
      renderWidget();
    } else if (existingScript) {
      existingScript.addEventListener('load', renderWidget, { once: true });
    } else {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.dataset.turnstile = 'true';
      script.addEventListener('load', renderWidget, { once: true });
      document.head.appendChild(script);
    }

    return () => {
      isActive = false;
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
      setTurnstileToken('');
    };
  }, [step]);

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
          <div className="mb-6 rounded-lg bg-gray-50 p-4 text-left text-sm" role="status" aria-live="polite">
            {smsStatus === 'sent' && (
              <p className="text-green-700">The admin has been notified by SMS.</p>
            )}
            {smsStatus === 'sending' && (
              <p className="text-gray-700">Sending the admin order notification…</p>
            )}
            {smsStatus === 'failed' && (
              <p className="text-amber-800">Your order is saved, but the admin SMS could not be sent. Please contact Vedha Agro with your order ID.</p>
            )}
            {smsStatus === 'not-configured' && (
              <p className="text-gray-700">Your order is saved. Admin SMS notifications are not configured for this deployment.</p>
            )}
          </div>
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

    if (deliveryDetails.name.trim().length < 2 || deliveryDetails.name.trim().length > 100)
      newErrors.name = 'Enter your name (2 to 100 characters).';
    if (!validateEmail(deliveryDetails.email))
      newErrors.email = 'Enter a valid email address.';
    if (!validatePhone(deliveryDetails.phone))
      newErrors.phone = 'Enter a valid phone number (10 to 12 digits).';
    if (deliveryDetails.address.trim().length < 5 || deliveryDetails.address.trim().length > 240)
      newErrors.address = 'Enter an address (5 to 240 characters).';
    if (deliveryDetails.city.trim().length < 2 || deliveryDetails.city.trim().length > 80)
      newErrors.city = 'Enter a valid city.';
    if (deliveryDetails.state.trim().length < 2 || deliveryDetails.state.trim().length > 80)
      newErrors.state = 'Enter a valid state.';
    if (!validatePincode(deliveryDetails.pincode))
      newErrors.pincode = 'Enter a valid 6-digit pincode.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (items.length === 0 || isSubmitting) {
      return;
    }

    if (!validateForm()) {
      setStep(1);
      setOrderError('Please correct the highlighted delivery details before placing your order.');
      return;
    }

    setIsSubmitting(true);
    setOrderError('');
    const newOrderId = generateOrderId();
    const orderItems = items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.product?.name || 'Unknown Product',
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity,
    }));
    const subtotal = getSubtotal();
    const tax = getTax();
    const total = getTotal();
    const newOrder: Order = {
      id: newOrderId,
      userId: 'guest-user',
      items: orderItems,
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
      subtotal,
      tax,
      deliveryCharges: 0,
      total,
      paymentMethod,
      paymentStatus: 'completed',
      orderStatus: 'confirmed',
      notes: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      addOrder(newOrder);
    } catch (error) {
      console.error('Failed to save order:', error);
      setOrderError('We could not save your order. Please try again; your cart and details are still here.');
      setIsSubmitting(false);
      return;
    }

    const notification = {
      id: `notification-${Date.now()}`,
      title: 'New order received',
      orderId: newOrder.id,
      customerName: newOrder.deliveryAddress.name,
      totalAmount: formatCurrency(newOrder.total),
      createdAt: new Date().toISOString(),
    };

    try {
      const storedNotifications = JSON.parse(
        localStorage.getItem('vedha-admin-notifications') || '[]'
      );
      const updatedNotifications = [notification, ...storedNotifications].slice(0, 20);
      localStorage.setItem('vedha-admin-notifications', JSON.stringify(updatedNotifications));
      window.dispatchEvent(new CustomEvent('admin-notification', { detail: notification }));
    } catch (error) {
      console.error('Order saved, but local admin notification could not be stored:', error);
    }

    setOrderId(newOrderId);
    setIsSubmitted(true);
    clearCart();
    setSmsStatus(smsEndpoint && turnstileSiteKey ? 'sending' : 'not-configured');

    if (smsEndpoint && turnstileSiteKey) {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 8000);
      try {
        const response = await fetch(smsEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            turnstileToken,
            order: {
              id: newOrder.id,
              customer: {
                name: newOrder.deliveryAddress.name,
                phone: newOrder.deliveryAddress.phone,
                email: newOrder.deliveryAddress.email,
                address: newOrder.deliveryAddress.address,
                city: newOrder.deliveryAddress.city,
                state: newOrder.deliveryAddress.state,
                pincode: newOrder.deliveryAddress.pincode,
              },
              items: newOrder.items.map((item) => ({
                name: item.productName,
                quantity: item.quantity,
                unitPrice: item.price,
              })),
              total: newOrder.total,
            },
          }),
          signal: controller.signal,
        });
        setSmsStatus(response.ok ? 'sent' : 'failed');
      } catch (error) {
        console.error('Order saved, but admin SMS notification failed:', error);
        setSmsStatus('failed');
      } finally {
        window.clearTimeout(timeoutId);
      }
    }

    setIsSubmitting(false);
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
            {orderError && (
              <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800" role="alert">
                <AlertCircle size={20} className="mt-0.5 shrink-0" />
                <p>{orderError}</p>
              </div>
            )}

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
                      id="delivery-name"
                      type="text"
                      value={deliveryDetails.name}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? 'delivery-name-error' : undefined}
                      onChange={(e) =>
                        setDeliveryDetails({ ...deliveryDetails, name: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p id="delivery-name-error" className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        id="delivery-email"
                        type="email"
                        value={deliveryDetails.email}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? 'delivery-email-error' : undefined}
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
                        <p id="delivery-email-error" className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        id="delivery-phone"
                        type="tel"
                        value={deliveryDetails.phone}
                        aria-invalid={Boolean(errors.phone)}
                        aria-describedby={errors.phone ? 'delivery-phone-error' : undefined}
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
                        <p id="delivery-phone-error" className="text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Address *
                    </label>
                    <textarea
                      id="delivery-address"
                      value={deliveryDetails.address}
                      aria-invalid={Boolean(errors.address)}
                      aria-describedby={errors.address ? 'delivery-address-error' : undefined}
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
                      <p id="delivery-address-error" className="text-red-500 text-sm mt-1">{errors.address}</p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        id="delivery-city"
                        type="text"
                        value={deliveryDetails.city}
                        aria-invalid={Boolean(errors.city)}
                        aria-describedby={errors.city ? 'delivery-city-error' : undefined}
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
                        <p id="delivery-city-error" className="text-red-500 text-sm mt-1">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        State *
                      </label>
                      <input
                        id="delivery-state"
                        type="text"
                        value={deliveryDetails.state}
                        aria-invalid={Boolean(errors.state)}
                        aria-describedby={errors.state ? 'delivery-state-error' : undefined}
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
                        <p id="delivery-state-error" className="text-red-500 text-sm mt-1">{errors.state}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Pincode *
                      </label>
                      <input
                        id="delivery-pincode"
                        type="text"
                        value={deliveryDetails.pincode}
                        aria-invalid={Boolean(errors.pincode)}
                        aria-describedby={errors.pincode ? 'delivery-pincode-error' : undefined}
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
                        <p id="delivery-pincode-error" className="text-red-500 text-sm mt-1">{errors.pincode}</p>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (validateForm()) {
                      setOrderError('');
                      setStep(2);
                    } else {
                      setOrderError('Please correct the highlighted delivery details.');
                    }
                  }}
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

                <div className="mb-6 flex items-center gap-3 rounded-lg border border-green-600 bg-green-50 p-4">
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked
                    readOnly
                    aria-label="Cash on Delivery"
                    className="h-4 w-4 accent-green-700"
                  />
                  <span className="font-semibold text-gray-800">Cash on Delivery</span>
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
                  <p className="text-gray-700">Cash on Delivery</p>
                </div>

                {smsEndpoint && turnstileSiteKey ? (
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Security check for admin SMS</p>
                    <div ref={turnstileContainer} />
                  </div>
                ) : (
                  <p className="mb-6 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
                    Admin SMS is not configured for this deployment. Orders can still be placed.
                  </p>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-lg transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:cursor-wait disabled:opacity-60 text-white font-bold py-3 rounded-lg transition"
                  >
                    {isSubmitting ? 'Saving order…' : 'Place Order'}
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
