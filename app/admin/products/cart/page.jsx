"use client";

import React, { useMemo, useState } from "react";
import { useCart } from "@/app/contexts/CartContext";
import { useProducts } from "@/app/contexts/ProductsContext";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  Trash2,
  Plus,
  Minus,
  Truck,
  Shield,
  RotateCcw,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

const CartPage = () => {
  const router = useRouter();
  const { cart, loading: cartLoading, updateQuantity, removeItem, clearCart } = useCart();
  const { products, loading: productsLoading } = useProducts();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const cartDetails = useMemo(() => {
    let subtotal = 0;
    let totalDiscount = 0;
    let totalItems = 0;

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
        totalItems += item.quantity;

        return {
          ...item,
          product,
          originalPrice,
          discountedPrice,
          itemTotal,
          itemDiscount,
          images: product.image_urls ? JSON.parse(product.image_urls) : [],
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
      totalItems,
      shipping,
      tax,
      total,
    };
  }, [cart, products]);

  const handleCheckout = async () => {
    if (cartDetails.items.length === 0) return;

    setIsCheckingOut(true);
    try {
      // Navigate to checkout page with cart data
      router.push('checkout');
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const continueShopping = () => {
    router.push('products');
  };

  if (cartLoading || productsLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4A574]"></div>
      </div>
    );

  if (!cart.length)
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Start shopping to add items to your cart
          </p>
          <button
            onClick={continueShopping}
            className="bg-[#D4A574] text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto"
          >
            <ArrowRight size={20} />
            Continue Shopping
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600 mt-2">
              {cartDetails.totalItems}{" "}
              {cartDetails.totalItems === 1 ? "item" : "items"}
            </p>
          </div>
          <button
            onClick={continueShopping}
            className="text-[#D4A574] hover:text-[#c1955e] font-semibold flex items-center gap-2"
          >
            <ArrowRight size={20} />
            Continue Shopping
          </button>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="max-h-[600px] overflow-y-auto">
                {cartDetails.items.map((item) => (
                  <div
                    key={item.id}
                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                  >
                    <div className="p-4 sm:p-6">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={item.images[0] || "/placeholder.png"}
                            alt={item.product.name}
                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-lg line-clamp-2 hover:text-[#D4A574] transition-colors cursor-pointer"
                              onClick={() => router.push(`/product/${item.product.id}`)}>
                            {item.product.name}
                          </h3>

                          {/* Price Display */}
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            {item.product.discount > 0 && (
                              <>
                                <span className="text-2xl font-bold text-gray-900">
                                  ${item.discountedPrice.toFixed(2)}
                                </span>
                                <span className="text-sm text-gray-500 line-through">
                                  ${item.originalPrice.toFixed(2)}
                                </span>
                                <span className="text-xs font-medium bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                  -{item.product.discount}% OFF
                                </span>
                              </>
                            )}
                            {!item.product.discount && (
                              <span className="text-2xl font-bold text-gray-900">
                                ${item.originalPrice.toFixed(2)}
                              </span>
                            )}
                          </div>

                          {/* Savings */}
                          {item.itemDiscount > 0 && (
                            <p className="text-sm text-green-600 font-medium mt-1">
                              You save ${item.itemDiscount.toFixed(2)}
                            </p>
                          )}

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    Math.max(1, item.quantity - 1)
                                  )
                                }
                                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                                disabled={item.quantity <= 1}
                              >
                                <Minus size={16} />
                              </button>
                              <span className="w-12 text-center font-medium bg-gray-50 py-1 rounded">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                <Plus size={16} />
                              </button>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-lg font-bold text-gray-900">
                                ${item.itemTotal.toFixed(2)}
                              </span>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors hover:bg-red-50 rounded-lg"
                                title="Remove item"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                <Truck size={24} className="mx-auto text-[#D4A574] mb-2" />
                <p className="text-sm font-medium text-gray-900">
                  Free Shipping
                </p>
                <p className="text-xs text-gray-600">Over $50</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                <RotateCcw size={24} className="mx-auto text-[#D4A574] mb-2" />
                <p className="text-sm font-medium text-gray-900">
                  Easy Returns
                </p>
                <p className="text-xs text-gray-600">30 Days</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                <Shield size={24} className="mx-auto text-[#D4A574] mb-2" />
                <p className="text-sm font-medium text-gray-900">
                  Secure Checkout
                </p>
                <p className="text-xs text-gray-600">Protected</p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Subtotal ({cartDetails.totalItems} items)
                  </span>
                  <span className="font-medium">
                    ${cartDetails.subtotal.toFixed(2)}
                  </span>
                </div>

                {cartDetails.totalDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Discounts</span>
                    <span className="font-medium text-green-600">
                      -${cartDetails.totalDiscount.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {cartDetails.shipping === 0
                      ? "Free"
                      : `$${cartDetails.shipping.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">
                    ${cartDetails.tax.toFixed(2)}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-[#D4A574]">
                      ${cartDetails.total.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Including ${cartDetails.tax.toFixed(2)} in taxes
                  </p>
                </div>

                {/* Shipping Progress */}
                {cartDetails.subtotal < 50 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800 font-medium">
                      Add ${(50 - cartDetails.subtotal).toFixed(2)} more for
                      free shipping!
                    </p>
                    <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(
                            (cartDetails.subtotal / 50) * 100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut || cartDetails.items.length === 0}
                  className="w-full bg-[#D4A574] text-white py-4 rounded-lg font-semibold hover:bg-[#c1955e] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 mt-6"
                >
                  {isCheckingOut ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <CheckCircle size={20} />
                  )}
                  {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
                </button>

                <p className="text-center text-xs text-gray-600 mt-4">
                  🔒 Secure checkout guaranteed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
