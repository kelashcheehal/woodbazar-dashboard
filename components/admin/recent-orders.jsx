import { MoreHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Adjust path as needed
import { useRouter } from "next/navigation";
const orders = [
  {
    id: "#ORD-3201",
    customer: "Alex Morgan",
    product: "Premium Teak Sofa",
    amount: "$1,299.00",
    status: "Completed",
    date: "May 21, 2025",
  },
  {
    id: "#ORD-3202",
    customer: "Sarah Williams",
    product: "Outdoor Swing Chair",
    amount: "$850.00",
    status: "Processing",
    date: "May 21, 2025",
  },
  {
    id: "#ORD-3203",
    customer: "Michael Brown",
    product: "Wooden Dining Table",
    amount: "$2,100.00",
    status: "Pending",
    date: "May 20, 2025",
  },
  {
    id: "#ORD-3204",
    customer: "Emma Davis",
    product: "Study Desk Set",
    amount: "$450.00",
    status: "Completed",
    date: "May 19, 2025",
  },
  {
    id: "#ORD-3205",
    customer: "James Wilson",
    product: "Modern Bookshelf",
    amount: "$620.00",
    status: "Cancelled",
    date: "May 19, 2025",
  },
];

const statusStyles = {
  Completed: "bg-green-100 text-green-700",
  Processing: "bg-blue-100 text-blue-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function RecentOrders() {
  const router = useRouter();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 flex items-center justify-between border-b border-gray-100">
        <div>
          <h3 className="text-lg font-bold text-[#2C1810]">Recent Orders</h3>
          <p className="text-sm text-gray-500">
            Manage and track your recent sales
          </p>
        </div>
        <button
          className="text-sm font-medium text-[#D4A574] hover:text-[#b38b5e] transition-colors cursor-pointer"
          onClick={() => router.push("admin/orders")}
        >
          View All Orders
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 font-medium">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-[#2C1810]">
                  {order.id}
                </td>
                <td className="px-6 py-4 text-gray-600">{order.customer}</td>
                <td className="px-6 py-4 text-gray-600">{order.product}</td>
                <td className="px-6 py-4 text-gray-500">{order.date}</td>
                <td className="px-6 py-4 font-medium text-[#2C1810]">
                  {order.amount}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      statusStyles[order.status]
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Select>
                    <SelectTrigger className="w-10 h-10 p-2 border border-gray-300 bg-white rounded-lg  focus:border-[#D4A574] transition-all duration-200 flex items-center justify-center">
                      <MoreHorizontal className="w-6 h-6 text-gray-500" />
                    </SelectTrigger>

                    <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                      {/* Order Status Group */}
                      <div className="px-3 pt-2 pb-1 text-xs font-semibold text-gray-500">
                        Order Status
                      </div>

                      <SelectItem
                        value="pending"
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                      >
                        Pending
                      </SelectItem>

                      <SelectItem
                        value="processing"
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                      >
                        Processing
                      </SelectItem>

                      <SelectItem
                        value="shipped"
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                      >
                        Shipped
                      </SelectItem>

                      <SelectItem
                        value="delivered"
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                      >
                        Delivered
                      </SelectItem>

                      <SelectItem
                        value="cancelled"
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                      >
                        Cancelled
                      </SelectItem>

                      <SelectItem
                        value="refunded"
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                      >
                        Refunded
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
