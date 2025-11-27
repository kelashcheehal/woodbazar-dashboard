"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Heart, Share2, CheckCircle, Stars } from "lucide-react";
import { useProducts } from "@/app/contexts/ProductsContext";
import StarRating from "./star-rating";
export default function ProductInfo({ onAddToCart }) {
  const { id: productId } = useParams();
  const { products, loading } = useProducts();

  const product = products.find((p) => p.id.toString() === productId) || {};

  const [selectedColor, setSelectedColor] = useState(
    product?.colors?.[0]?.name || ""
  );
  const [selectedSize, setSelectedSize] = useState(
    product?.sizes?.[0]?.toLowerCase() || ""
  );
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const discountedPrice = useMemo(() => {
    if (!product?.price) return 0;
    return product.discount
      ? product.price - (product.price * product.discount) / 100
      : product.price;
  }, [product]);

  const handleAddToCart = () => {
    setAddedToCart(true);
    onAddToCart?.(quantity, selectedColor, selectedSize);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <div className="w-12 h-12 animate-spin text-[#D4A574]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-700">
      {/* Title */}
      <h4 className="text-2xl md:text-2xl font-medium mb-1">
        {product.name || (
          <span className="text-red-600 text-xs">No product name</span>
        )}
      </h4>

      {/* Rating & Reviews */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-0.5">
          <StarRating rating={product.rating || 0} size="md" />
        </div>
      </div>

      {/* Price & Stock */}
      {product?.price != null && (
        <div className="py-4 border-b" style={{ borderColor: "#f0f0f0" }}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl md:text-4xl font-bold text-[#D4A574]">
              $
              {product.discount
                ? discountedPrice.toFixed(2)
                : product.price.toFixed(2)}
            </span>
            {product.discount ? (
              <span className="text-lg line-through text-[#bbb]">
                ${product.price.toFixed(2)}
              </span>
            ) : null}
          </div>
          <p
            className={`text-xs font-semibold ${
              product?.stock ? "text-green-600" : "text-red-600"
            }`}
          >
            {product?.stock
              ? `✓ ${product.stock} In Stock - Free Shipping on Orders Over $50`
              : "Out of stock"}
          </p>
        </div>
      )}

      {/* Description */}
      <p
        className="text-sm leading-relaxed"
        style={{ color: "#666", lineHeight: "1.6" }}
      >
        {product?.description || (
          <span className="text-red-600">No description available</span>
        )}
      </p>

      {/* Colors */}
      <div className="animate-in fade-in slide-in-from-left-2 duration-700 delay-100">
        <label
          className="block text-xs font-bold mb-2 uppercase tracking-wider"
          style={{ color: "var(--primary-dark)" }}
        >
          Color
        </label>
        {product?.colors?.length > 0 ? (
          <div className="flex gap-3">
            {product.colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                className="relative w-11 h-11 rounded-full border-2 transition-all duration-300 hover:scale-110 focus:outline-none"
                style={{
                  backgroundColor: color.hex,
                  borderColor:
                    selectedColor === color.name
                      ? "var(--primary-gold)"
                      : "#e5e5e5",
                }}
                title={color.label}
              >
                {selectedColor === color.name && (
                  <span
                    className="absolute inset-1 border-2 rounded-full animate-pulse"
                    style={{ borderColor: "var(--primary-gold)" }}
                  />
                )}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-red-600 text-xs">No colors available</p>
        )}
      </div>

      {/* Sizes */}
      <div className="animate-in fade-in slide-in-from-left-2 duration-700 delay-150">
        <label
          className="block text-xs font-bold mb-2 uppercase tracking-wider"
          style={{ color: "var(--primary-dark)" }}
        >
          Size
        </label>
        {product?.sizes?.length > 0 ? (
          <div className="flex gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size.toLowerCase())}
                className="px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm border-2 hover:scale-105"
                style={{
                  backgroundColor:
                    selectedSize === size.toLowerCase()
                      ? "var(--primary-dark)"
                      : "white",
                  color:
                    selectedSize === size.toLowerCase()
                      ? "white"
                      : "var(--primary-dark)",
                  borderColor:
                    selectedSize === size.toLowerCase()
                      ? "var(--primary-dark)"
                      : "#e5e5e5",
                }}
              >
                {size}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-red-600 text-xs">No sizes available</p>
        )}
      </div>

      {/* Quantity & Add to Cart */}
      <div className="animate-in fade-in slide-in-from-left-2 duration-700 delay-200 flex flex-col sm:flex-row gap-3 pt-2 w-full max-w-md mx-auto">
        {/* Quantity Selector */}
        <div className="flex w-full sm:w-auto justify-center items-center border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-lg font-semibold text-center"
          >
            −
          </button>
          <span className="flex-1 px-4 py-2 text-lg font-bold text-gray-800 text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="flex-1 px-4 py-2 bg-gray-100 text-[#D4A574] hover:bg-gray-200 transition-colors text-lg font-semibold text-center"
          >
            +
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className={`flex-1 py-2.5 rounded-lg font-medium text-white transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-sm md:text-base`}
          style={{
            backgroundColor: addedToCart ? "#2C1810" : "#D4A574",
          }}
        >
          {addedToCart ? (
            <>
              <CheckCircle size={18} />
              Added to Cart
            </>
          ) : (
            "🛒 Add to Cart"
          )}
        </button>
      </div>

      {/* Wishlist & Share */}
      <div
        className="flex gap-2 pt-2 border-t"
        style={{ borderColor: "#f0f0f0" }}
      >
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="flex-1 py-2 rounded-lg font-semibold border-2 transition-all duration-300 flex items-center justify-center gap-2 text-sm hover:scale-105"
          style={{
            borderColor: isWishlisted ? "var(--primary-gold)" : "#e5e5e5",
            color: isWishlisted ? "var(--primary-gold)" : "var(--primary-dark)",
            backgroundColor: isWishlisted
              ? "rgba(212, 165, 116, 0.05)"
              : "white",
          }}
        >
          <Heart size={18} className={isWishlisted ? "fill-current" : ""} />
          {isWishlisted ? "Liked" : "Wishlist"}
        </button>
        <button
          className="flex-1 py-2 rounded-lg font-semibold border-2 transition-all duration-300 flex items-center justify-center gap-2 text-sm hover:scale-105"
          style={{ borderColor: "#e5e5e5", color: "var(--primary-dark)" }}
        >
          <Share2 size={18} /> Share
        </button>
      </div>
      {/* <RelatedProducts /> */}
    </div>
  );
}
