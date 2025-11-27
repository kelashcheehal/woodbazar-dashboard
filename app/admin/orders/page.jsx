"use client";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Search, Download } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Load Orders
  useEffect(() => {
    async function loadOrders() {
      setLoading(true);

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("id", { ascending: false });

      if (!error) setOrders(data || []);
      setLoading(false);
    }

    loadOrders();
  }, []);

  // Update order status
  const updateOrderStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", id);

    if (!error) {
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
      );
    }
  };

  // Badge color helpers
  const statusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "shipped":
        return "bg-purple-100 text-purple-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const paymentStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "unpaid":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // Final filtered list
  const filteredOrders = useMemo(() => {
    return orders
      .filter((o) =>
        search
          ? o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
            o.id.toString().includes(search)
          : true
      )
      .filter((o) =>
        statusFilter === "all" ? true : o.status?.toLowerCase() === statusFilter
      );
  }, [orders, search, statusFilter]);

  return (
    <div className="space-y-6 bg-white text-[#2C1810]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-gray-500 text-sm">Track and manage orders</p>
        </div>

        <button className="bg-white border px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm hover:bg-gray-50">
          <Download size={20} />
          <span className="text-sm font-medium">Export</span>
        </button>
      </div>

      {/* Search + Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm placeholder-gray-400"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg text-sm"
        >
          <option value="all">All Status</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold">
                  Items
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold">
                  Update
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold">
                  Payment
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold">
                  Method
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-4">
                    Loading...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-4">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-sm">
                      #{order.id}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {order.customer_name || "Unknown"}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.order_items?.length || 0} items
                    </td>

                    <td className="px-6 py-4 font-medium text-sm">
                      ${order.total}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    {/* Update status dropdown */}
                    <td className="px-6 py-4">
                      <select
                        className="border px-2 py-1 rounded text-sm"
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order.id, e.target.value)
                        }
                      >
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Payment status */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${paymentStyle(
                          order.payment_status
                        )}`}
                      >
                        {order.payment_status}
                      </span>
                    </td>

                    {/* Payment method (safe) */}
                    <td className="px-6 py-4 text-sm">
                      {order.payment_method || "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
