"use client";

import { useEffect } from "react";
import ProductBreadcrumb from "@/components/breadcrumb";
import ProductGallery from "@/components/product-gallery";
import ProductInfo from "@/components/product-info";
import Loading from "../loading";
import { useProducts } from "@/app/contexts/ProductsContext";
import { useParams } from "next/navigation";
import ProductTabs from "@/components/product-tab";
import RelatedProducts from "@/components/related-products";
import ProductFeatures from "@/components/product-feature";

export default function ProductDetail() {
  const { products, loading } = useProducts(); // use global products
  const { id } = useParams(); // id from URL

  if (loading) return <Loading />;

  // Convert id to string for comparison (supabase usually returns number)
  const product = products.find((p) => p.id.toString() === id);
  if (!product) return <p>Product not found</p>;

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  const handleAddToCart = (quantity, color, size) => {
    console.log(
      `Added to cart: ${quantity}x ${product.name} in ${color} size ${size}`
    );
  };

  return (
    <div className="min-h-screen w-full">
      <div className="pt-6 pb-4 px-4 md:px-8 max-w-7xl mx-auto">
        <ProductBreadcrumb productName={product.name} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          <ProductGallery
            images={product.images}
            productName={product.name}
            discount={discount}
          />
          <ProductInfo product={product} onAddToCart={handleAddToCart} />
        </div>
        <ProductFeatures />
        <ProductTabs />
        <RelatedProducts />
      </div>
    </div>
  );
}
