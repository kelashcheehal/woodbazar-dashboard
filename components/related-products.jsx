"use client";

import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useProducts } from "@/app/contexts/ProductsContext";
import { useMemo, useRef } from "react";
import Image from "next/image";

// Add your domain here
const DOMAIN = "https://yourdomain.com";

export default function RelatedProducts() {
  const { id } = useParams();
  const router = useRouter();
  const { products = [], loading } = useProducts();
  const scrollRef = useRef(null);

  if (loading) return <p>Loading related products...</p>;
  if (!Array.isArray(products) || products.length === 0)
    return <p>No products found</p>;

  const currentProduct = useMemo(
    () => products.find((p) => p.id.toString() === id),
    [products, id]
  );
  if (!currentProduct) return <p>No related products found</p>;

  const relatedProducts = useMemo(() => {
    let sameCategory = products.filter(
      (p) =>
        p.id !== currentProduct.id && p.category === currentProduct.category
    );

    if (sameCategory.length < 6 && currentProduct.tags) {
      const tagMatches = products.filter(
        (p) =>
          p.id !== currentProduct.id &&
          p.category !== currentProduct.category &&
          p.tags &&
          p.tags.some((tag) => currentProduct.tags.includes(tag))
      );
      sameCategory = [...sameCategory, ...tagMatches];
    }

    if (sameCategory.length < 6) {
      const remaining = products.filter(
        (p) =>
          p.id !== currentProduct.id &&
          !sameCategory.some((sc) => sc.id === p.id)
      );
      const needed = 6 - sameCategory.length;
      const shuffled = remaining
        .sort(() => Math.random() - 0.5)
        .slice(0, needed);
      sameCategory = [...sameCategory, ...shuffled];
    }

    return sameCategory.slice(0, 6);
  }, [products, currentProduct]);

  const productImagesMap = useMemo(() => {
    const map = {};
    relatedProducts.forEach((p) => {
      try {
        const imgs = p.image_urls ? JSON.parse(p.image_urls) : [];
        map[p.id] =
          imgs.length > 0
            ? imgs.map((img) =>
                img.startsWith("http") ? img : `${DOMAIN}${img}`
              )
            : [`${DOMAIN}/placeholder.svg`];
      } catch {
        map[p.id] = [`${DOMAIN}/placeholder.svg`];
      }
    });
    return map;
  }, [relatedProducts]);

  const scrollNext = () => {
    if (scrollRef.current)
      scrollRef.current.scrollBy({
        left: scrollRef.current.clientWidth * 0.9,
        behavior: "smooth",
      });
  };

  const scrollPrev = () => {
    if (scrollRef.current)
      scrollRef.current.scrollBy({
        left: -scrollRef.current.clientWidth * 0.9,
        behavior: "smooth",
      });
  };

  return (
    <div className="pb-8 px-4 md:px-6 lg:px-8 ">
      <div className="flex justify-between items-center mb-4">
        <h2
          className="text-xl md:text-2xl font-bold"
          style={{ color: "var(--primary-dark)" }}
        >
          Related Products
        </h2>
        <div className="flex gap-2">
          <button
            onClick={scrollPrev}
            className="bg-[#eee] p-2 rounded-full shadow hover:bg-[#d4a574] hover:text-white transition"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={scrollNext}
            className="bg-[#eee] p-2 rounded-full shadow hover:bg-[#d4a574] hover:text-white transition"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {relatedProducts.map((product, idx) => (
          <div
            key={product.id}
            className="shrink-0 w-[48%] sm:w-[32%] lg:w-[23%] snap-start cursor-pointer group animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: `${idx * 100}ms` }}
            onClick={() => router.push(`/admin/products/${product.id}`)}
          >
            <div className="relative aspect-square rounded-lg overflow-hidden bg-[#f9f7f4] mb-3 shadow-sm transition-all duration-500 hover:shadow-md">
              <img
                src={productImagesMap[product.id]?.[0] || "/placeholder.svg"}
                alt={product.name}
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 640px) 48vw, (max-width: 1024px) 32vw, 23vw"
              />
            </div>
            <h3
              className="font-bold text-sm mb-2 group-hover:text-[#d4a574] transition-colors line-clamp-2"
              style={{ color: "var(--primary-dark)" }}
            >
              {product.name}
            </h3>
            <div className="flex justify-between items-center">
              <span
                className="font-bold text-sm"
                style={{ color: "var(--primary-gold)" }}
              >
                ${product.price}
              </span>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={11}
                    className="fill-current"
                    style={{
                      color:
                        i < Math.floor(product.rating || 0)
                          ? "var(--primary-gold)"
                          : "#e5e5e5",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
