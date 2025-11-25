"use client";

import { useState } from "react";
import { Plus, Search, Filter, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import { useProducts } from "../../context/ProductsContext";

export default function ProductsPage() {
  // Mock Data
  // const { products, setProducts, deleteProduct } = useProducts();
  const products = [
    {
      id: 1,
      name: "Luxury Wingback Chair",
      image: "/images/wingback-chair.jpg",
      category: "Living Room",
      price: 249.99,
      stock: 32,
      status: "In Stock",
    },
    {
      id: 2,
      name: "Modern Wooden Coffee Table",
      image: "/images/coffee-table.jpg",
      category: "Living Room",
      price: 179.5,
      stock: 8,
      status: "Low Stock",
    },
    {
      id: 3,
      name: "Solid Oak Dining Set",
      image: "/images/dining-set.jpg",
      category: "Dining Room",
      price: 899.0,
      stock: 0,
      status: "Out of Stock",
    },
    {
      id: 4,
      name: "Classic Bookshelf",
      image: "/images/bookshelf.jpg",
      category: "Home Office",
      price: 129.99,
      stock: 21,
      status: "In Stock",
    },
    {
      id: 5,
      name: "Minimalist Bed Frame",
      image: "/images/bed-frame.jpg",
      category: "Bedroom",
      price: 499.0,
      stock: 5,
      status: "Low Stock",
    },
    {
      id: 6,
      name: "Comfort Recliner Sofa",
      image: "/images/recliner-sofa.jpg",
      category: "Living Room",
      price: 699.99,
      stock: 14,
      status: "In Stock",
    },
    {
      id: 7,
      name: "Wooden Study Desk",
      image: "/images/study-desk.jpg",
      category: "Home Office",
      price: 239.99,
      stock: 2,
      status: "Low Stock",
    },
    {
      id: 8,
      name: "Kids Bunk Bed",
      image: "/images/bunk-bed.jpg",
      category: "Kids Room",
      price: 559.49,
      stock: 0,
      status: "Out of Stock",
    },
    {
      id: 9,
      name: "Wall Mounted Shelf",
      image: "/images/wall-shelf.jpg",
      category: "Decor",
      price: 49.99,
      stock: 48,
      status: "In Stock",
    },
    {
      id: 10,
      name: "Rustic Wooden Nightstand",
      image: "/images/nightstand.jpg",
      category: "Bedroom",
      price: 89.99,
      stock: 12,
      status: "In Stock",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2C1810]">Products</h1>
          <p className="text-gray-500">Manage your product inventory</p>
        </div>
        <Link
          href="/admin/add-product"
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
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
                  Stock
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image || "/placeholder.svg"}
                        alt={p.name}
                        className="h-10 w-10 rounded-lg object-cover bg-gray-100"
                      />
                      <span className="font-medium text-[#2C1810]">
                        {p.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {p.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-[#2C1810]">
                    ${p.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {p.stock} units
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        p.status === "In Stock"
                          ? "bg-green-100 text-green-700"
                          : p.status === "Low Stock"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-[#D4A574] transition-colors rounded-lg hover:bg-[#D4A574]/10">
                        <Eye size={18} />
                      </button>
                      <Link
                        className="p-2 text-gray-400 hover:text-blue-500 transition-colors rounded-lg hover:bg-blue-50"
                        href={`/admin/edit-product/${p.id}`}
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
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Showing 1 to 5 of 5 entries
          </span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50">
              Previous
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
