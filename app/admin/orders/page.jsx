'use client'
import { useState } from "react";
import { Search, Filter, Eye, Download, MoreVertical } from "lucide-react";

export default function OrdersPage() {
  const [orders] = useState([
    {
      id: "#ORD-7234",
      customer: "Alex Morgan",
      date: "Oct 24, 2025",
      amount: "$1,299.00",
      status: "Processing",
      items: 2,
    },
    {
      id: "#ORD-7233",
      customer: "Sarah Johnson",
      date: "Oct 24, 2025",
      amount: "$459.50",
      status: "Shipped",
      items: 1,
    },
    {
      id: "#ORD-7232",
      customer: "Michael Brown",
      date: "Oct 23, 2025",
      amount: "$2,899.00",
      status: "Delivered",
      items: 4,
    },
    {
      id: "#ORD-7231",
      customer: "Emily Davis",
      date: "Oct 23, 2025",
      amount: "$89.00",
      status: "Cancelled",
      items: 1,
    },
    {
      id: "#ORD-7230",
      customer: "James Wilson",
      date: "Oct 22, 2025",
      amount: "$649.00",
      status: "Delivered",
      items: 2,
    },
    {
      id: "#ORD-7229",
      customer: "Linda Anderson",
      date: "Oct 22, 2025",
      amount: "$1,150.00",
      status: "Processing",
      items: 3,
    },
  ]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2C1810]">Orders</h1>
          <p className="text-gray-500">Track and manage customer orders</p>
        </div>
        <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm">
          <Download size={20} />
          <span>Export Orders</span>
        </button>
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
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A574]/20 focus:border-[#D4A574]"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center gap-2 text-gray-600 hover:bg-gray-50 transition-colors">
            <Filter size={18} />
            <span>Status</span>
          </button>
          <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center gap-2 text-gray-600 hover:bg-gray-50 transition-colors">
            <Filter size={18} />
            <span>Date</span>
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Total
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
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-[#2C1810]">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {order.items} items
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-[#2C1810]">
                    {order.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Processing"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "Shipped"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-[#D4A574] transition-colors rounded-lg hover:bg-[#D4A574]/10">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
