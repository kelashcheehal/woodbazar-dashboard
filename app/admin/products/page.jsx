"use client";

import { supabase } from "@/lib/supabaseClient";
import { Edit, Eye, Filter, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProductsPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("id", { ascending: false }); // recent first
        if (error) throw error;
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err.message);
      alert("Failed to delete product.");
    }
  };

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const nextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[400px]">
        <div className="w-12 h-12 border-4 border-[#2C1810]/30 border-t-[#2C1810] rounded-full animate-spin"></div>
      </div>
    );

  if (!products.length)
    return (
      <p className="text-center text-gray-500 mt-10">No products found.</p>
    );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2C1810]">Products</h1>
          <p className="text-gray-500">Manage your product inventory</p>
        </div>
        <Link
          href="/admin/products/add-product"
          className="bg-[#2C1810] hover:bg-[#2C1810]/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A574]/20 focus:border-[#D4A574]"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center gap-2 text-gray-600 hover:bg-gray-50 transition-colors">
            <Filter size={18} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto max-h-[600px]">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentProducts.map((p) => {
                const images = p.image_urls ? JSON.parse(p.image_urls) : [];
                const discountPrice = p.discount
                  ? p.price - (p.price * p.discount) / 100
                  : null;
                const status =
                  p.stock > 10
                    ? "In Stock"
                    : p.stock > 0
                    ? "Low Stock"
                    : "Out of Stock";

                return (
                  <tr
                    key={p.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-4 whitespace-nowrap max-w-[385px]">
                      <div className="flex items-center gap-3">
                        <img
                          src={images[0] || "/placeholder.svg"}
                          alt={p.name}
                          className="h-10 w-10 rounded-lg object-cover shrink-0"
                        />
                        <span
                          className="font-sm text-[#2C1810] truncate  block"
                          title={p.name}
                        >
                          {p.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {p.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {discountPrice ? (
                        <>
                          <span className="line-through text-red-600">
                            ${p.price.toFixed(2)}
                          </span>{" "}
                          <span className="text-gray-500 font-medium">
                            ${discountPrice.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        `$${p.price.toFixed(2)}`
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {p.stock} units
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          status === "In Stock"
                            ? "bg-green-100 text-green-700"
                            : status === "Low Stock"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-[#D4A574] transition-colors rounded-lg hover:bg-[#D4A574]/10">
                          <Eye size={18} />
                        </button>
                        <Link
                          className="p-2 text-gray-400 hover:text-blue-500 transition-colors rounded-lg hover:bg-blue-50"
                          href={`/admin/products/edit-product/${p.id}`}
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                          onClick={() => {
                            if (
                              confirm(
                                "Are you sure you want to delete this product?"
                              )
                            ) {
                              deleteProduct(p.id);
                            }
                          }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + itemsPerPage, products.length)} of{" "}
            {products.length} entries
          </span>
          <div className="flex gap-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
