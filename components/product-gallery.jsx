"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CornerRightUp,
  Heart,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function ProductGallery({ productId }) {
  const [images, setImages] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState({ price: 0, discount: 0 });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("image_urls, price, discount")
          .eq("id", productId)
          .single();

        if (error) throw error;

        const imgs = data.image_urls ? JSON.parse(data.image_urls) : [];
        setImages(imgs.length > 0 ? imgs : ["/placeholder.svg"]);
        setProduct({
          price: Number(data.price) || 0,
          discount: Number(data.discount) || 0,
        });
      } catch (err) {
        console.error("Error fetching product:", err.message);
        setImages(["/placeholder.svg"]);
        setProduct({ price: 0, discount: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Loader2 className="w-12 h-12 animate-spin text-[#D4A574]" />
      </div>
    );
  }

  const handlePrevMain = () =>
    setMainImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  const handleNextMain = () =>
    setMainImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  const discountedPrice = product.discount
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  return (
    <div className="flex flex-col gap-4 items-center w-full">

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-[600px] space-y-4">

        {/* Main Image */}
        <div className="animate-in fade-in slide-in-from-left-4 duration-700 relative w-full aspect-square bg-[#f9f7f4] rounded-2xl overflow-hidden group shadow-lg hover:shadow-xl transition-all">
          <img
            src={images[mainImageIndex] || "/placeholder.svg"}
            alt={`Product image ${mainImageIndex + 1}`}
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
            className="group-hover:scale-105 transition-transform duration-700"
          />

          {/* Discount Badge */}
          {product.discount > 0 && (
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white bg-[#D4A574]">
              SALE {product.discount}%
            </div>
          )}

          {/* Price Overlay */}
          <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 px-3 py-1 rounded-md text-sm font-semibold text-[#2C1810]">
            ${discountedPrice.toFixed(2)}
            {product.discount > 0 && (
              <span className="ml-2 text-red-600 line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-row sm:flex-col items-center justify-between w-full sm:w-[50px] gap-2 p-2 max-h-[492px] bg-[#D4A57415] rounded-md">
          <div className="flex flex-row sm:flex-col gap-2">
            <Link
              href="/admin/products"
              className="rounded-md p-2 bg-white hover:bg-gray-100 transition shadow"
            >
              <CornerRightUp className="w-6 h-6 text-[#2C1810]" strokeWidth={1.5} />
            </Link>
            <button
              onClick={handleNextMain}
              className="rounded-md p-2 bg-white hover:bg-gray-100 transition shadow"
            >
              <Heart className="w-6 h-6 text-red-600" strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex flex-row sm:flex-col gap-2 mt-0 sm:mt-auto">
            <button
              onClick={handlePrevMain}
              className="rounded-md p-2 bg-white hover:bg-gray-100 transition shadow"
            >
              <ChevronLeft className="w-6 h-6 text-[#2C1810]" strokeWidth={1.5} />
            </button>
            <button
              onClick={handleNextMain}
              className="rounded-md p-2 bg-white hover:bg-gray-100 transition shadow"
            >
              <ChevronRight className="w-6 h-6 text-[#2C1810]" strokeWidth={1.5} />
            </button>
          </div>
        </div>

      </div>

      {/* Thumbnails */}
      <div className="flex justify-center flex-wrap mt-2 gap-3">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setMainImageIndex(idx)}
            className={`relative w-16 sm:w-20 h-16 sm:h-20 rounded border-2 overflow-hidden transition ${
              mainImageIndex === idx ? "border-[#D4A574]" : "border-gray-200"
            }`}
          >
            <img
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
              className="hover:scale-110 transition-transform"
            />
          </button>
        ))}
      </div>

    </div>
  );
}
