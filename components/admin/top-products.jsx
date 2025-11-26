"use client";

import { useProducts } from "@/app/contexts/ProductsContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function TopProducts() {
  const { products, loading } = useProducts();
  const router = useRouter();
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full">
        <h3 className="text-lg font-bold text-[#2C1810] mb-1">Top Products</h3>
        <p className="text-sm text-gray-500 mb-6">
          Best selling items this month
        </p>
        <div className="space-y-4">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-2 animate-pulse"
            >
              <div className="w-12 h-12 rounded-lg bg-gray-200"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="text-right">
                <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Assuming products have a 'sold' field; sort by sold descending and take top 4
  const topProducts = products
    .sort((a, b) => (b.sold || 0) - (a.sold || 0))
    .slice(0, 4);

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full">
      <h3 className="text-lg font-bold text-[#2C1810] mb-1">Top Products</h3>
      <p className="text-sm text-gray-500 mb-6">
        Best selling items this month
      </p>

      <div className="space-y-4">
        {topProducts.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-xl transition-colors group cursor-pointer"
            onClick={() => router.push(`/admin/products/${product.id}`)}
          >
            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
              <Image
                src={product.images?.[0] || "/placeholder.svg"}
                alt={product.name}
                width={48}
                height={48}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-[#2C1810] text-sm">
                {product.name}
              </h4>
              <p className="text-xs text-gray-500">
                {product.category || "Uncategorized"}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-[#D4A574] text-sm">
                ${product.price}
              </p>
              <p className="text-xs text-gray-400">{product.sold || 0} sold</p>
            </div>
          </div>
        ))}
      </div>
      {topProducts.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          No products available
        </p>
      )}
      <button className="w-full mt-6 py-2.5 text-sm font-medium text-[#2C1810] border border-gray-200 rounded-xl hover:bg-[#2C1810] hover:text-[#D4A574] hover:border-[#2C1810] transition-all duration-300">
        <Link href={"/admin/products"}>View All Products</Link>
      </button>
    </div>
  );
}
