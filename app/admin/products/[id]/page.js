"use client";

import StarRating from "@/components/star-rating";
import {
  Heart,
  Bookmark,
  Share2,
  Truck,
  RotateCcw,
  Loader2,
  Star,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ProductGallery from "@/components/product-gallery";
import DescriptionContent from "@/components/description-content";
import CustomerFeedback from "@/components/customer-feedback";
import ReviewsList from "@/components/review-list";
import ReviewForm from "@/components/review-form";
import Breadcrumb from "@/components/breadcrumb";
export default function ProductInfo() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    if (!params.id) return;

    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", Number(params.id))
          .single();
        if (error) throw error;
        setProduct(data);
      } catch (err) {
        alert("Failed to fetch product");
        router.push("/admin/products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-[#2C1810]" />
      </div>
    );

  if (!product)
    return (
      <p className="text-center mt-10 text-gray-500">Product not found.</p>
    );

  const price = Number(product.price) || 0;
  const discountPrice = product.discount
    ? price - (price * Number(product.discount)) / 100
    : null;

  const rating = Number(product.rating) || 0;
  const reviews = Number(product.reviews) || 0;
  const recommendationPercentage =
    Number(product.recommendationPercentage) || 0;

  const colors = product.colors || [];
  const sizes = product.sizes || [];

  return (
    <div className="flex flex-col lg:flex-row gap-12 p-4 bg-white text-[#2C1810]">
      <div className="lg:w-1/2 w-full">
        <ProductGallery productId={product.id} />
      </div>

      <div className="lg:w-1/2 w-full flex flex-col">
        {/* Breadcrumb */}
        <Breadcrumb name={product?.name} />

        {/* Product Title + Icons */}
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
          <div>
            <h1
              className="text-4xl font-bold mb-4"
              style={{ color: "var(--primary-dark)" }}
            >
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className="fill-current"
                    style={{
                      color:
                        i < Math.floor(product.rating)
                          ? "var(--primary-gold)"
                          : "#ddd",
                    }}
                  />
                ))}
              </div>
              <span
                className="font-semibold"
                style={{ color: "var(--primary-dark)" }}
              >
                {product.rating}
              </span>
              <span style={{ color: "#999" }}>({product.reviews} reviews)</span>
            </div>
          </div>

          <div
            className="py-4 border-b-dotted"
            style={{ borderColor: "var(--bg-light)" }}
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-[#2C1810]">
                ${discountPrice ? discountPrice.toFixed(2) : price.toFixed(2)}
              </span>
              {discountPrice && (
                <span className="text-lg text-red-600 line-through">
                  ${price.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-sm font-medium" style={{ color: "#00a86b" }}>
              ✓ In Stock - Free Shipping
            </p>
          </div>

          <p
            className="text-base border-t-dotted border-black leading-relaxed pt-2"
            style={{ color: "#666" }}
          >
            {product.description}
          </p>
        </div>

        {/* Price & Rating */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <StarRating rating={rating} size="lg" />
            <span className="font-medium">{rating.toFixed(1)}</span>
            <span>{reviews} Reviews</span>
            <span className="text-green-600">
              {recommendationPercentage}% Recommended
            </span>
          </div>
        </div>

        {/* Colors */}
        {colors.length > 0 && (
          <div>
            <p className="font-semibold mb-2">Choose a Color</p>
            <div className="flex gap-3 flex-wrap">
              {colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`w-10 h-10 rounded-full border transition ${
                    selectedColor === color.name
                      ? "border-[#D4A574] scale-105"
                      : "border-gray-300 hover:border-[#D4A574]"
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Sizes */}
        {sizes.length > 0 && (
          <div>
            <p className="font-semibold mb-2">Choose a Size</p>
            <div className="flex gap-2 flex-wrap">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size.toLowerCase())}
                  className={`px-4 py-2 rounded border text-sm transition ${
                    selectedSize === size.toLowerCase()
                      ? "bg-[#D4A574] text-white border-[#D4A574]"
                      : "border-gray-300 hover:border-[#D4A574]"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity + Add to Cart */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center border rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 py-2 text-lg hover:bg-gray-100 transition-colors"
            >
              −
            </button>
            <span className="px-6 py-2 font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-4 py-2 text-lg hover:bg-gray-100 transition-colors"
            >
              +
            </button>
          </div>

          <button className="w-full sm:w-auto bg-[#D4A574] text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity">
            🛒 Add To Cart
          </button>
        </div>

        {/* Delivery Info */}
        <div className="border-t pt-6 space-y-4 text-sm text-gray-600">
          <div className="flex gap-4">
            <Truck className="w-6 h-6 text-[#D4A574]" />
            <div>
              <p className="font-semibold text-[#2C1810]">Free Delivery</p>
              <p>Enter your postal code to check availability</p>
            </div>
          </div>
          <div className="flex gap-4">
            <RotateCcw className="w-6 h-6 text-[#D4A574]" />
            <div>
              <p className="font-semibold text-[#2C1810]">30-Day Returns</p>
              <p>
                Free return shipping.{" "}
                <span className="text-[#D4A574] cursor-pointer hover:underline">
                  Details
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Description & Reviews */}
        <DescriptionContent productId={product.id} />
        <CustomerFeedback />
        <ReviewForm />
        <ReviewsList />
      </div>
    </div>
  );
}
