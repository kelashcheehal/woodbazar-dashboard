"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useProducts } from "@/app/contexts/ProductsContext";
import Loading from "@/app/admin/products/loading";

export default function ProductGallery() {
  const { products, loading } = useProducts(); // use global products
  const { id } = useParams(); // id from URL
  const [selectedImage, setSelectedImage] = useState(0);

  if (loading) return <Loading />;

  // find product from context
  const product = products.find((p) => p.id.toString() === id);
  if (!product) return <p>Product not found</p>;

  // parse image URLs if stored as JSON string
  const images = product.image_urls
    ? JSON.parse(product.image_urls)
    : ["/placeholder.svg"];

  const discountedPrice = product.discount
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  const prevImage = () =>
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const nextImage = () =>
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <div className="space-y-3 animate-in fade-in slide-in-from-left-4 duration-700">
      {/* Main Image */}
      <div className="relative w-full aspect-square bg-[#f9f7f4] rounded-xl overflow-hidden group shadow-md transition-all duration-500 hover:shadow-lg">
        <img
          src={images[selectedImage]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {product.discount > 0 && (
          <div className="absolute top-3 right-3 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#D4A574]">
            SALE {product.discount}%
          </div>
        )}

        <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 px-3 py-1 rounded-md text-sm font-semibold text-[#2C1810]">
          ${discountedPrice.toFixed(2)}
          {product.discount > 0 && (
            <span className="ml-2 text-red-600 line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Navigation */}
        <button
          onClick={prevImage}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
        >
          <ChevronLeft className="w-6 h-6 text-[#2C1810]" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
        >
          <ChevronRight className="w-6 h-6 text-[#2C1810]" />
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex justify-center flex-wrap gap-3 mt-2">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedImage(idx)}
            className={`w-16 h-16 rounded border-2 overflow-hidden ${
              selectedImage === idx
                ? "border-[#D4A574] scale-105 shadow-md"
                : "border-gray-200 hover:scale-105"
            }`}
          >
            <img
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
