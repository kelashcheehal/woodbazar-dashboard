"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Heart,
  Share2,
  CheckCircle,
  Loader2,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { useProducts } from "@/app/contexts/ProductsContext";
import StarRating from "./star-rating";
import { useCart } from "@/app/contexts/CartContext";

export default function ProductInfo() {
  const { id: productId } = useParams();
  const { products, loading: productsLoading } = useProducts();
  const {
    addToCart,
    isInCart,
    getItemQuantity,
    loading: cartLoading,
  } = useCart();

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Memoized product data
  const product = useMemo(
    () => products.find((p) => p.id.toString() === productId) || {},
    [products, productId]
  );

  // Memoized price calculations
  const { discountedPrice, hasDiscount, savings } = useMemo(() => {
    if (!product?.price)
      return {
        discountedPrice: 0,
        hasDiscount: false,
        savings: 0,
      };

    const discount = product.discount || 0;
    const discounted = discount
      ? product.price - (product.price * discount) / 100
      : product.price;

    return {
      discountedPrice: discounted,
      hasDiscount: discount > 0,
      savings: product.price - discounted,
    };
  }, [product]);

  // Initialize selected options when product loads
  useEffect(() => {
    if (product?.colors?.length) {
      setSelectedColor(product.colors[0].name);
    }
    if (product?.sizes?.length) {
      setSelectedSize(product.sizes[0].toLowerCase());
    }
  }, [product]);

  // Handle add to cart with proper loading states
  const handleAddToCart = useCallback(async () => {
    if (!product?.id || isAddingToCart || product.stock === 0) return;

    setIsAddingToCart(true);
    try {
      const result = await addToCart(product.id);

      if (result.success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
      // No need to handle failure here - it's handled in the context
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  }, [product?.id, isAddingToCart, product?.stock, addToCart]);

  // Quantity handlers
  const incrementQuantity = useCallback(() => {
    setQuantity((prev) => Math.min(prev + 1, product.stock || 10));
  }, [product.stock]);

  const decrementQuantity = useCallback(() => {
    setQuantity((prev) => Math.max(1, prev - 1));
  }, []);

  // Loading state
  if (productsLoading || cartLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4A574]" />
        <span className="ml-2 text-gray-600">Loading product...</span>
      </div>
    );
  }

  // Product not found
  if (!product?.id) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-2xl">❌</span>
        </div>
        <p className="text-gray-600">Product not found</p>
      </div>
    );
  }

  const itemInCart = isInCart(product.id);
  const itemQuantity = getItemQuantity(product.id);
  const canAddToCart = product.stock > 0 && !itemInCart;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Header Section */}
      <div className="space-y-3">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-tight">
          {product.name}
        </h1>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <StarRating rating={product.rating || 0} size="md" />
            <span className="text-sm text-gray-600">
              ({product.reviewCount || 0} reviews)
            </span>
          </div>
          {product.stock > 0 ? (
            <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full">
              In Stock
            </span>
          ) : (
            <span className="text-xs font-medium bg-red-100 text-red-800 px-2 py-1 rounded-full">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Price Section */}
      <div className="py-4 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <span className="text-3xl font-bold text-[#D4A574]">
            ${discountedPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <>
              <span className="text-lg line-through text-gray-400">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-sm font-medium bg-red-100 text-red-800 px-2 py-1 rounded">
                Save {product.discount}%
              </span>
            </>
          )}
        </div>
        {hasDiscount && (
          <p className="text-sm text-green-600 font-medium mb-2">
            You save ${savings.toFixed(2)}
          </p>
        )}
        <p
          className={`text-sm font-medium ${
            product.stock > 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {product.stock > 0
            ? `✓ ${product.stock} available • Free shipping over $50`
            : "Currently unavailable"}
        </p>
      </div>

      {/* Description */}
      {product.description && (
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-600 leading-relaxed">{product.description}</p>
        </div>
      )}

      {/* Color Selection */}
      {product.colors?.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Color:{" "}
              <span className="text-gray-600 normal-case">{selectedColor}</span>
            </label>
          </div>
          <div className="flex gap-3 flex-wrap">
            {product.colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                className={`relative w-12 h-12 rounded-full border-2 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:ring-offset-2 ${
                  selectedColor === color.name
                    ? "border-[#D4A574] ring-2 ring-[#D4A574] ring-offset-1"
                    : "border-gray-300"
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.label}
                aria-label={`Select color ${color.label}`}
              >
                {selectedColor === color.name && (
                  <CheckCircle
                    className="absolute -top-1 -right-1 text-[#D4A574] bg-white rounded-full"
                    size={16}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {product.sizes?.length > 0 && (
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-900 uppercase tracking-wide block">
            Size:{" "}
            <span className="text-gray-600 normal-case">{selectedSize}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size.toLowerCase())}
                className={`px-4 py-3 rounded-lg font-medium text-sm border transition-all duration-200 hover:scale-105 min-w-[60px] ${
                  selectedSize === size.toLowerCase()
                    ? "bg-gray-900 text-white border-gray-900 shadow-md"
                    : "bg-white text-gray-900 border-gray-300 hover:border-gray-400"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity & Add to Cart */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
            <button
              onClick={decrementQuantity}
              disabled={quantity <= 1}
              className="px-4 py-3 bg-gray-50 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="px-6 py-3 text-lg font-bold text-gray-900 min-w-[60px] text-center">
              {quantity}
            </span>
            <button
              onClick={incrementQuantity}
              disabled={quantity >= (product.stock || 10)}
              className="px-4 py-3 bg-gray-50 text-[#D4A574] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!canAddToCart || isAddingToCart}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
              canAddToCart
                ? "bg-[#D4A574] hover:bg-[#c1955e] active:scale-95"
                : "bg-gray-400 cursor-not-allowed"
            } ${showSuccess ? "bg-green-600 hover:bg-green-700" : ""}`}
          >
            {isAddingToCart ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Adding...
              </>
            ) : showSuccess ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Added to Cart!
              </>
            ) : itemInCart ? (
              `In Cart (${itemQuantity})`
            ) : product.stock === 0 ? (
              "Out of Stock"
            ) : (
              "Add to Cart"
            )}
          </button>
        </div>

        {showSuccess && (
          <p className="text-green-600 text-sm font-medium text-center animate-pulse">
            ✓ Product added to your cart successfully!
          </p>
        )}
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <Truck className="w-6 h-6 mx-auto mb-2 text-[#D4A574]" />
          <p className="text-xs font-medium text-gray-900">Free Shipping</p>
          <p className="text-xs text-gray-600">Over $50</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <RotateCcw className="w-6 h-6 mx-auto mb-2 text-[#D4A574]" />
          <p className="text-xs font-medium text-gray-900">Easy Returns</p>
          <p className="text-xs text-gray-600">30 Days</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <Shield className="w-6 h-6 mx-auto mb-2 text-[#D4A574]" />
          <p className="text-xs font-medium text-gray-900">Secure Payment</p>
          <p className="text-xs text-gray-600">Protected</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className={`flex-1 py-3 rounded-lg font-semibold border transition-all duration-200 flex items-center justify-center gap-2 ${
            isWishlisted
              ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Heart size={18} className={isWishlisted ? "fill-red-600" : ""} />
          {isWishlisted ? "Liked" : "Wishlist"}
        </button>

        <button
          className="flex-1 py-3 rounded-lg font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
          onClick={() =>
            navigator
              .share?.({
                title: product.name,
                url: window.location.href,
              })
              .catch(() => {
                navigator.clipboard.writeText(window.location.href);
                // You could add a toast notification here
              })
          }
        >
          <Share2 size={18} />
          Share
        </button>
      </div>
    </div>
  );
}
