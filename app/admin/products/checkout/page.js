"use client";

import React, { useState, useMemo } from "react";
import { useCart } from "@/app/contexts/CartContext";
import { useProducts } from "@/app/contexts/ProductsContext";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  CheckCircle,
  Lock,
  CreditCard,
  MapPin,
  User,
  ArrowLeft,
  Shield,
  DollarSign,
  Truck,
} from "lucide-react";

const CheckoutPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const { cart, clearCart } = useCart();
  const { products } = useProducts();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card"); // 'card' or 'cod'

  // Form state
  const [formData, setFormData] = useState({
    email: user?.emailAddresses?.[0]?.emailAddress || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  });

  // Calculate order summary
  const orderSummary = useMemo(() => {
    let subtotal = 0;
    let totalDiscount = 0;

    const items = cart
      .map((item) => {
        const product = products.find(
          (p) => p.id.toString() === item.product_id.toString()
        );
        if (!product) return null;

        const originalPrice = product.price;
        const discountPercentage = product.discount || 0;
        const discountedPrice = discountPercentage
          ? originalPrice - (originalPrice * discountPercentage) / 100
          : originalPrice;

        const itemTotal = discountedPrice * item.quantity;
        const itemDiscount = (originalPrice - discountedPrice) * item.quantity;

        subtotal += itemTotal;
        totalDiscount += itemDiscount;

        return {
          product_id: product.id,
          product_name: product.name,
          quantity: item.quantity,
          unit_price: discountedPrice,
          total_price: itemTotal,
          discount: itemDiscount,
          image_url: product.image_urls
            ? JSON.parse(product.image_urls)[0]
            : null,
        };
      })
      .filter(Boolean);

    const shipping = subtotal > 50 ? 0 : 4.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    return {
      items,
      subtotal,
      totalDiscount,
      shipping,
      tax,
      total,
    };
  }, [cart, products]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to complete your order");
      return;
    }

    // Validate required fields
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.zipCode
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Validate card details if paying by card
    if (paymentMethod === "card") {
      if (
        !formData.cardNumber ||
        !formData.expiryDate ||
        !formData.cvv ||
        !formData.cardName
      ) {
        alert("Please fill in all card details");
        return;
      }
    }

    setIsProcessing(true);

    try {
      console.log("Starting order submission...");

      // Prepare order data - REMOVED payment_method field since it doesn't exist in your table
      const orderData = {
        user_id: user.id,
        customer_email: formData.email,
        customer_name: `${formData.firstName} ${formData.lastName}`,
        customer_phone: formData.phone,
        shipping_address: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        order_items: orderSummary.items,
        subtotal: parseFloat(orderSummary.subtotal.toFixed(2)),
        discount: parseFloat(orderSummary.totalDiscount.toFixed(2)),
        shipping: parseFloat(orderSummary.shipping.toFixed(2)),
        tax: parseFloat(orderSummary.tax.toFixed(2)),
        total: parseFloat(orderSummary.total.toFixed(2)),
        status: "pending",
        payment_status: paymentMethod === "cod" ? "pending" : "paid",
        updated_a: new Date().toISOString(),
      };

      console.log("Order data prepared:", orderData);

      // Create order in Supabase
      const { data: order, error } = await supabase
        .from("orders")
        .insert([orderData])
        .select()
        .single();

      if (error) {
        console.error("Supabase insert error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        throw error;
      }

      console.log("Order created successfully:", order);

      // Clear cart after successful order
      await clearCart();

      // Set success state
      setOrderId(order.id);
      setOrderSuccess(true);

      // Redirect to success page after 3 seconds
      setTimeout(() => {
        router.push(`order-success/${order.id}`);
      }, 3000);
    } catch (error) {
      console.error("Full order submission error:", {
        error,
        message: error?.message,
        details: error?.details,
        stack: error?.stack,
      });

      let errorMessage = "Failed to process order. Please try again.";

      if (error?.message?.includes("null value in column")) {
        errorMessage =
          "Missing required information. Please check all fields and try again.";
      } else if (
        error?.message?.includes("network") ||
        error?.message?.includes("fetch")
      ) {
        errorMessage =
          "Network error. Please check your connection and try again.";
      } else if (error?.message?.includes("payment_method")) {
        errorMessage = "Database configuration error. Please contact support.";
      }

      alert(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h2>
          <p className="text-gray-600 mb-4">
            Thank you for your purchase. Your order has been received.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Order ID: <span className="font-mono">{orderId}</span>
          </p>
          {paymentMethod === "cod" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800">
                <strong>Cash on Delivery:</strong> Please have cash ready when
                your order arrives.
              </p>
            </div>
          )}
          <div className="animate-pulse text-sm text-green-600">
            Redirecting to order details...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#D4A574] hover:text-[#c1955e] mb-4"
          >
            <ArrowLeft size={20} />
            Back to Cart
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your purchase securely</p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmitOrder}>
              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User size={20} />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A574] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A574] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A574] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A574] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin size={20} />
                  Shipping Address
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A574] focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A574] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A574] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A574] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Payment Method
                </h3>

                <div className="space-y-4">
                  {/* Credit Card Option */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === "card"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-[#D4A574] focus:ring-[#D4A574]"
                      />
                      <CreditCard size={20} className="text-gray-600" />
                      <span className="font-medium">Credit/Debit Card</span>
                    </label>

                    {paymentMethod === "card" && (
                      <div className="mt-4 space-y-4 pl-7">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Card Number *
                          </label>
                          <input
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            placeholder="1234 5678 9012 3456"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A574] focus:border-transparent"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Expiry Date *
                            </label>
                            <input
                              type="text"
                              name="expiryDate"
                              value={formData.expiryDate}
                              onChange={handleInputChange}
                              placeholder="MM/YY"
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A574] focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              CVV *
                            </label>
                            <input
                              type="text"
                              name="cvv"
                              value={formData.cvv}
                              onChange={handleInputChange}
                              placeholder="123"
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A574] focus:border-transparent"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Name on Card *
                          </label>
                          <input
                            type="text"
                            name="cardName"
                            value={formData.cardName}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A574] focus:border-transparent"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Cash on Delivery Option */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-[#D4A574] focus:ring-[#D4A574]"
                      />
                      <DollarSign size={20} className="text-gray-600" />
                      <span className="font-medium">Cash on Delivery</span>
                    </label>

                    {paymentMethod === "cod" && (
                      <div className="mt-3 pl-7">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-sm text-blue-800">
                            Pay with cash when your order is delivered. An
                            additional verification call may be made before
                            delivery.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing || orderSummary.items.length === 0}
                className="w-full bg-[#D4A574] text-white py-4 rounded-lg font-semibold hover:bg-[#c1955e] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 mt-2"
              >
                {isProcessing ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : paymentMethod === "card" ? (
                  <Lock size={20} />
                ) : (
                  <Truck size={20} />
                )}
                {isProcessing
                  ? "Processing Order..."
                  : paymentMethod === "card"
                  ? `Pay $${orderSummary.total.toFixed(2)}`
                  : `Place Order - $${orderSummary.total.toFixed(2)}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h3>

              <div className="space-y-3 mb-6 max-h-80 overflow-y-auto">
                {orderSummary.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-start gap-3"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.product_name}
                          className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-2">
                          {item.product_name}
                        </p>
                        <p className="text-xs text-gray-600">
                          Qty: {item.quantity} × ${item.unit_price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-sm flex-shrink-0">
                      ${item.total_price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${orderSummary.subtotal.toFixed(2)}</span>
                </div>
                {orderSummary.totalDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-${orderSummary.totalDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>
                    {orderSummary.shipping === 0
                      ? "Free"
                      : `$${orderSummary.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${orderSummary.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span className="text-[#D4A574]">
                    ${orderSummary.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {paymentMethod === "cod" && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800 text-center">
                    <strong>Cash on Delivery:</strong> Pay when you receive your
                    order
                  </p>
                </div>
              )}

              <div className="mt-4 flex items-center gap-2 text-xs text-gray-600">
                <Shield size={14} />
                <span>Your information is secure and protected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
