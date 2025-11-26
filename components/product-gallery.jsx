"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function ProductGallery() {
  const params = useParams(); // { id: '1' } if your route is /product/[id]
  const productId = params.id; // extract the ID

  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState({ price: 0, discount: 0, name: "" });

  useEffect(() => {
    if (!productId) return; // safety check

    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("image_urls, price, discount, name")
          .eq("id", productId)
          .single();

        if (error) throw error;

        const imgs = data.image_urls ? JSON.parse(data.image_urls) : [];
        setImages(imgs.length ? imgs : ["/placeholder.svg"]);
        setProduct({
          price: Number(data.price) || 0,
          discount: Number(data.discount) || 0,
          name: data.name || "",
        });
      } catch (err) {
        console.error("Error fetching product:", err.message);
        setImages(["/placeholder.svg"]);
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
