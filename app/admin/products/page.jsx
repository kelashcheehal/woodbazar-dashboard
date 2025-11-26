"use client";

import { useProducts } from "@/app/contexts/ProductsContext";
import { supabase } from "@/lib/supabaseClient";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
export default function ProductsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [discountOnly, setDiscountOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  const { categories } = useProducts();
  console.log(categories);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("id", { ascending: false });
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
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter
        ? p.category === categoryFilter
        : true;
      const matchesDiscount = discountOnly ? p.discount > 0 : true;
      return matchesSearch && matchesCategory && matchesDiscount;
    });

    switch (sortOption) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "discounted":
        result.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
    }

    return result;
  }, [products, searchTerm, categoryFilter, sortOption, discountOnly]);

  useEffect(
    () => setCurrentPage(1),
    [searchTerm, categoryFilter, sortOption, discountOnly]
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white text-[#2C1810]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2C1810]">Products</h1>
          <p className="text-gray-500">Manage your product inventory</p>
        </div>
        <Link
          href="/admin/products/add-product"
          className="bg-[#2C1810] hover:bg-[#2C1810]/90 text-[#D4A574] px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Search products by name or category..."
            className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A574]/20 focus:border-[#D4A574]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* {filter} */}
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          {/* Category Filter */}
          <Select
            value={categoryFilter === "" ? "all" : categoryFilter}
            onValueChange={(value) =>
              setCategoryFilter(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-48 px-4 py-2 border cursor-pointer border-gray-300 bg-white rounded-lg hover:shadow-sm transition-all duration-200 focus:ring-2 focus:ring-[#D4A574]/40">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>

              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.category}>
                  {cat.category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort By */}
          <Select
            value={sortOption}
            onValueChange={(value) => setSortOption(value)}
          >
            <SelectTrigger className="w-48 cursor-pointer px-4 py-2 border border-gray-300 bg-white rounded-lg hover:shadow-sm transition-all duration-200 focus:ring-2 focus:ring-[#D4A574]/40">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="price-asc">Price: Low → High</SelectItem>
              <SelectItem value="price-desc">Price: High → Low</SelectItem>
              <SelectItem value="name-asc">Name: A → Z</SelectItem>
              <SelectItem value="name-desc">Name: Z → A</SelectItem>
            </SelectContent>
          </Select>

          {/* Discount Checkbox */}
          <label className="flex cursor-pointer items-center gap-2 text-gray-700 px-2 py-1.5 border border-gray-300 rounded-lg bg-white hover:shadow-sm transition-all duration-200">
            <input
              type="checkbox"
              checked={discountOnly}
              onChange={() => setDiscountOnly(!discountOnly)}
              className=""
            />
            Discounted Only
          </label>
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
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/admin/products/${p.id}`)}
                  >
                    <td className="px-4 whitespace-nowrap max-w-[385px]">
                      <div className="flex items-center gap-3">
                        <img
                          src={images[0] || "/placeholder.svg"}
                          alt={p.name}
                          className="h-10 w-10 rounded-lg object-cover shrink-0"
                        />
                        <span
                          className="font-sm text-[#2C1810] truncate block"
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
                        <Link
                          className="p-2 text-gray-400 hover:text-[#D4A574] transition-colors rounded-lg hover:bg-[#D4A574]/10"
                          href={`/admin/products/${p.id}`}
                        >
                          <Eye size={18} />
                        </Link>

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
            {Math.min(
              startIndex + currentProducts.length,
              filteredProducts.length
            )}{" "}
            of {filteredProducts.length} entries
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
