"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@clerk/nextjs";
import {
  CheckCircle,
  Truck,
  Calendar,
  MapPin,
  Package,
  CreditCard,
  DollarSign,
  ArrowLeft,
  Download,
  Printer,
  Mail,
  Home,
} from "lucide-react";

const OrderSuccessPage = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const orderId = params.id;

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (error) throw error;

      if (data) {
        setOrder(data);
      } else {
        setError("Order not found");
      }
    } catch (err) {
      console.error("Error fetching order:", err);
      setError("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const orderContent = `
Order Confirmation
==================

Order ID: ${order?.id}
Date: ${new Date(order?.created_at).toLocaleDateString()}
Status: ${order?.status}
Payment Status: ${order?.payment_status}

Customer Information:
--------------------
Name: ${order?.customer_name}
Email: ${order?.customer_email}
Phone: ${order?.customer_phone}

Shipping Address:
----------------
${order?.shipping_address?.address}
${order?.shipping_address?.city}, ${order?.shipping_address?.state} ${
      order?.shipping_address?.zipCode
    }
${order?.shipping_address?.country}

Order Summary:
-------------
Subtotal: $${order?.subtotal?.toFixed(2)}
Discount: $${order?.discount?.toFixed(2)}
Shipping: $${order?.shipping?.toFixed(2)}
Tax: $${order?.tax?.toFixed(2)}
Total: $${order?.total?.toFixed(2)}

Order Items:
-----------
${order?.order_items
  ?.map(
    (item) =>
      `${item.product_name} x${item.quantity} - $${item.total_price.toFixed(2)}`
  )
  .join("\n")}

Thank you for your order!
    `;

    const blob = new Blob([orderContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `order-${order?.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4A574] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "The order you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-[#D4A574] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#c1955e] transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const isCOD = order.payment_status === "pending";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 mb-4">
            Thank you for your purchase. Your order has been received and is
            being processed.
          </p>
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Printer size={16} />
              Print
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download size={16} />
              Download
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package size={20} />
                Order Summary
              </h2>

              <div className="space-y-4">
                {order.order_items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.product_name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {item.product_name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity} × $
                          {item.unit_price?.toFixed(2)}
                        </p>
                        {item.discount > 0 && (
                          <p className="text-xs text-green-600">
                            Saved ${item.discount?.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="font-semibold text-gray-900">
                      ${item.total_price?.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${order.subtotal?.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-${order.discount?.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span>
                    {order.shipping === 0
                      ? "Free"
                      : `$${order.shipping?.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span>${order.tax?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span className="text-[#D4A574]">
                    ${order.total?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin size={20} />
                Shipping Information
              </h2>
              <div className="space-y-2">
                <p className="font-medium">{order.customer_name}</p>
                <p className="text-gray-600">
                  {order.shipping_address?.address}
                </p>
                <p className="text-gray-600">
                  {order.shipping_address?.city},{" "}
                  {order.shipping_address?.state}{" "}
                  {order.shipping_address?.zipCode}
                </p>
                <p className="text-gray-600">
                  {order.shipping_address?.country}
                </p>
                <p className="text-gray-600">{order.customer_phone}</p>
                <p className="text-gray-600">{order.customer_email}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Order Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      order.status === "pending"
                        ? "bg-yellow-500"
                        : order.status === "processing"
                        ? "bg-blue-500"
                        : order.status === "shipped"
                        ? "bg-purple-500"
                        : order.status === "delivered"
                        ? "bg-green-500"
                        : "bg-gray-500"
                    }`}
                  ></div>
                  <span className="capitalize">{order.status}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      order.payment_status === "paid"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  ></div>
                  <span className="capitalize">
                    {order.payment_status === "paid"
                      ? "Paid"
                      : "Payment Pending"}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Order Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="font-medium">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CreditCard size={16} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="font-medium">
                      {isCOD ? "Cash on Delivery" : "Credit/Debit Card"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Truck size={16} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Shipping</p>
                    <p className="font-medium">
                      {order.shipping === 0
                        ? "Free Shipping"
                        : `$${order.shipping?.toFixed(2)}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            {isCOD && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                  <DollarSign size={20} />
                  Cash on Delivery
                </h3>
                <p className="text-sm text-yellow-800">
                  Please have <strong>${order.total?.toFixed(2)}</strong> in
                  cash ready when your order arrives. Our delivery agent will
                  collect the payment at your doorstep.
                </p>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                What's Next?
              </h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• You will receive an order confirmation email shortly</li>
                <li>• We'll notify you when your order ships</li>
                <li>• Expected delivery: 3-5 business days</li>
                {isCOD && <li>• Please keep cash ready for delivery</li>}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => router.push("/")}
                className="w-full bg-[#D4A574] text-white py-3 rounded-lg font-semibold hover:bg-[#c1955e] transition-colors flex items-center justify-center gap-2"
              >
                <Home size={16} />
                Continue Shopping
              </button>
              <button
                onClick={() => router.push("/orders")}
                className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                View All Orders
              </button>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Need Help?
          </h3>
          <p className="text-gray-600 mb-4">
            If you have any questions about your order, please contact our
            customer support.
          </p>
          <div className="flex justify-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Mail size={16} />
              Email Support
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Phone size={16} />
              Call Support
            </button>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
          }
          .bg-gray-50 {
            background: white !important;
          }
          .shadow-sm {
            box-shadow: none !important;
          }
          .border {
            border: 1px solid #e5e5e5 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderSuccessPage;
