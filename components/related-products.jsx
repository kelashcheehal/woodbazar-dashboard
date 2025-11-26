"use client";

import Image from "next/image";
import { Star } from "lucide-react";

export default function RelatedProducts({ products }) {
  return (
    <div className="pb-8">
      <h2
        className="text-xl font-bold mb-6"
        style={{ color: "var(--primary-dark)" }}
      >
        Related Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((product, idx) => (
          <div
            key={product.id}
            className="group animate-in fade-in slide-in-from-bottom-4 duration-700 cursor-pointer"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="relative aspect-square rounded-lg overflow-hidden bg-[#f9f7f4] mb-3 shadow-sm transition-all duration-500 hover:shadow-md">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
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
                        i < Math.floor(product.rating)
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
