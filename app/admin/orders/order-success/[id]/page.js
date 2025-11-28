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
  Download,
  Printer,
  Mail,
  Home,
  Phone,
} from "lucide-react";
import jsPDF from "jspdf";

const OrderSuccessPage = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);

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

  const handleDownloadPDF = () => {
    setGeneratingPDF(true);

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const margin = 15;
      let y = margin;

      // Company Header - Center align
      pdf.setFontSize(22);
      pdf.setTextColor(212, 165, 116); // WoodBazar brown color
      pdf.text('WOODBAZAR', 105, y, { align: 'center' });
      y += 8;

      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Premium Wood Products & Furniture', 105, y, { align: 'center' });
      y += 5;
      pdf.text('123 Wood Street, Furniture City | +1 (555) 123-WOOD | support@woodbazar.com', 105, y, { align: 'center' });
      y += 15;

      // Horizontal line
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, y, 195, y);
      y += 10;

      // Order Confirmation Title
      pdf.setFontSize(18);
      pdf.setTextColor(0, 0, 0);
      pdf.text('ORDER CONFIRMATION', 105, y, { align: 'center' });
      y += 10;

      // Order ID and Date
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Order ID: ${order?.id}`, margin, y);
      pdf.text(`Date: ${new Date(order?.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}`, 150, y);
      y += 15;

      // Two Column Layout
      const columnWidth = 85;

      // Left Column - Customer Information
      pdf.setFontSize(14);
      pdf.text('CUSTOMER INFORMATION', margin, y);
      y += 8;

      pdf.setFontSize(10);
      pdf.text(`Name: ${order?.customer_name}`, margin, y);
      y += 5;
      pdf.text(`Email: ${order?.customer_email}`, margin, y);
      y += 5;
      pdf.text(`Phone: ${order?.customer_phone}`, margin, y);
      y += 10;

      pdf.setFontSize(12);
      pdf.text('SHIPPING ADDRESS:', margin, y);
      y += 6;

      pdf.setFontSize(10);
      const addressLines = pdf.splitTextToSize(
        `${order?.shipping_address?.address}, ${order?.shipping_address?.city}, ${order?.shipping_address?.state} ${order?.shipping_address?.zipCode}, ${order?.shipping_address?.country}`,
        columnWidth
      );
      addressLines.forEach(line => {
        pdf.text(line, margin, y);
        y += 4;
      });

      y += 10;

      // Right Column - Order Details
      const rightColumnX = 120;
      let rightY = 60; // Same as original y position

      pdf.setFontSize(14);
      pdf.text('ORDER DETAILS', rightColumnX, rightY);
      rightY += 8;

      pdf.setFontSize(10);
      pdf.text(`Status: ${order?.status?.toUpperCase()}`, rightColumnX, rightY);
      rightY += 5;
      pdf.text(`Payment: ${order?.payment_status === 'paid' ? 'PAID' : 'PENDING'}`, rightColumnX, rightY);
      rightY += 5;
      pdf.text(`Method: ${order?.payment_status === 'pending' ? 'Cash on Delivery' : 'Credit Card'}`, rightColumnX, rightY);
      rightY += 5;
      pdf.text(`Shipping: ${order?.shipping === 0 ? 'FREE' : `$${order?.shipping?.toFixed(2)}`}`, rightColumnX, rightY);
      rightY += 10;

      // Reset Y to the bottom of the taller column
      y = Math.max(y, rightY) + 10;

      // Order Items Table
      pdf.setFontSize(14);
      pdf.text('ORDER ITEMS', margin, y);
      y += 10;

      // Table Header
      pdf.setFillColor(240, 240, 240);
      pdf.rect(margin, y, 180, 8, 'F');
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.text('PRODUCT', margin + 2, y + 5);
      pdf.text('QTY', 120, y + 5);
      pdf.text('PRICE', 140, y + 5);
      pdf.text('TOTAL', 170, y + 5);
      y += 10;

      // Table Rows
      pdf.setFontSize(9);
      order?.order_items?.forEach((item, index) => {
        if (y > 250) { // New page if running out of space
          pdf.addPage();
          y = margin;
        }

        // Product name (with line breaks if too long)
        const productNameLines = pdf.splitTextToSize(item.product_name, 70);
        productNameLines.forEach((line, lineIndex) => {
          pdf.text(line, margin + 2, y + (lineIndex * 3));
        });

        const lineHeight = Math.max(6, productNameLines.length * 3);

        pdf.text(item.quantity.toString(), 120, y + (lineHeight / 2));
        pdf.text(`$${item.unit_price?.toFixed(2)}`, 140, y + (lineHeight / 2));
        pdf.text(`$${item.total_price?.toFixed(2)}`, 170, y + (lineHeight / 2));

        y += lineHeight + 2;

        // Separator line
        if (index < order.order_items.length - 1) {
          pdf.setDrawColor(220, 220, 220);
          pdf.line(margin, y, 195, y);
          y += 2;
        }
      });

      y += 10;

      // Order Summary
      pdf.setFontSize(14);
      pdf.text('ORDER SUMMARY', margin, y);
      y += 10;

      const summaryX = 140;
      pdf.setFontSize(10);
      pdf.text(`Subtotal:`, summaryX, y);
      pdf.text(`$${order?.subtotal?.toFixed(2)}`, 180, y, { align: 'right' });
      y += 5;

      if (order?.discount > 0) {
        pdf.setTextColor(0, 150, 0);
        pdf.text(`Discount:`, summaryX, y);
        pdf.text(`-$${order?.discount?.toFixed(2)}`, 180, y, { align: 'right' });
        y += 5;
        pdf.setTextColor(0, 0, 0);
      }

      pdf.text(`Shipping:`, summaryX, y);
      pdf.text(`${order?.shipping === 0 ? 'FREE' : `$${order?.shipping?.toFixed(2)}`}`, 180, y, { align: 'right' });
      y += 5;

      pdf.text(`Tax:`, summaryX, y);
      pdf.text(`$${order?.tax?.toFixed(2)}`, 180, y, { align: 'right' });
      y += 8;

      // Total
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(212, 165, 116);
      pdf.text(`TOTAL:`, summaryX, y);
      pdf.text(`$${order?.total?.toFixed(2)}`, 180, y, { align: 'right' });
      y += 15;

      // Footer
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Thank you for choosing WoodBazar!', 105, y, { align: 'center' });
      y += 5;
      pdf.text('We appreciate your business and look forward to serving you again.', 105, y, { align: 'center' });
      y += 10;

      if (order?.payment_status === 'pending') {
        pdf.setTextColor(200, 100, 0);
        pdf.setFont(undefined, 'bold');
        pdf.text(`CASH ON DELIVERY: Please keep $${order?.total?.toFixed(2)} ready for payment`, 105, y, { align: 'center' });
        y += 5;
        pdf.setFont(undefined, 'normal');
      }

      pdf.setTextColor(100, 100, 100);
      pdf.text('For any questions, contact us at support@woodbazar.com or call +1 (555) 123-WOOD', 105, y, { align: 'center' });

      // Save PDF
      pdf.save(`woodbazar-order-${order?.id}.pdf`);

    } catch (error) {
      console.error('PDF generation error:', error);
      alert('PDF download failed. Please try again.');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleDownloadText = () => {
    const orderContent = `
WOODBAZAR ORDER CONFIRMATION
============================

Order ID: ${order?.id}
Date: ${new Date(order?.created_at).toLocaleDateString()}
Status: ${order?.status}
Payment: ${order?.payment_status}

CUSTOMER INFORMATION:
-------------------
Name: ${order?.customer_name}
Email: ${order?.customer_email}
Phone: ${order?.customer_phone}

SHIPPING ADDRESS:
----------------
${order?.shipping_address?.address}
${order?.shipping_address?.city}, ${order?.shipping_address?.state} ${order?.shipping_address?.zipCode}
${order?.shipping_address?.country}

ORDER ITEMS:
-----------
${order?.order_items?.map(item =>
  `${item.product_name} | Qty: ${item.quantity} | Price: $${item.unit_price?.toFixed(2)} | Total: $${item.total_price?.toFixed(2)}`
).join('\n')}

ORDER SUMMARY:
-------------
Subtotal: $${order?.subtotal?.toFixed(2)}
Discount: $${order?.discount?.toFixed(2)}
Shipping: $${order?.shipping?.toFixed(2)}
Tax: $${order?.tax?.toFixed(2)}
TOTAL: $${order?.total?.toFixed(2)}

Thank you for your order!
    `.trim();

    const blob = new Blob([orderContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `woodbazar-order-${order?.id}.txt`;
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-4">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
          <div className="flex justify-center gap-4 mb-6 flex-wrap">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Printer size={16} />
              Print
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={generatingPDF}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                generatingPDF
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#D4A574] text-white hover:bg-[#c1955e]'
              }`}
            >
              <Download size={16} />
              {generatingPDF ? 'Generating PDF...' : 'Download PDF'}
            </button>
            <button
              onClick={handleDownloadText}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download size={16} />
              Download Text
            </button>
          </div>
        </div>

        {/* Main Content - Same as before */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package size={20} />
                Order Summary
              </h2>
              <div className="space-y-4">
                {order.order_items?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center gap-4 flex-1">
                      {item.image_url && (
                        <img src={item.image_url} alt={item.product_name} className="w-16 h-16 object-cover rounded-lg" />
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.product_name}</h3>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity} × ${item.unit_price?.toFixed(2)}
                        </p>
                        {item.discount > 0 && (
                          <p className="text-xs text-green-600">Saved ${item.discount?.toFixed(2)}</p>
                        )}
                      </div>
                    </div>
                    <span className="font-semibold text-gray-900">${item.total_price?.toFixed(2)}</span>
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
                  <span>{order.shipping === 0 ? "Free" : `$${order.shipping?.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span>${order.tax?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span className="text-[#D4A574]">${order.total?.toFixed(2)}</span>
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
                <p className="text-gray-600">{order.shipping_address?.address}</p>
                <p className="text-gray-600">
                  {order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.zipCode}
                </p>
                <p className="text-gray-600">{order.shipping_address?.country}</p>
                <p className="text-gray-600">{order.customer_phone}</p>
                <p className="text-gray-600">{order.customer_email}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    order.status === "pending" ? "bg-yellow-500" :
                    order.status === "processing" ? "bg-blue-500" :
                    order.status === "shipped" ? "bg-purple-500" :
                    order.status === "delivered" ? "bg-green-500" : "bg-gray-500"
                  }`}></div>
                  <span className="capitalize">{order.status}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    order.payment_status === "paid" ? "bg-green-500" : "bg-yellow-500"
                  }`}></div>
                  <span className="capitalize">
                    {order.payment_status === "paid" ? "Paid" : "Payment Pending"}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CreditCard size={16} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="font-medium">{isCOD ? "Cash on Delivery" : "Credit/Debit Card"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Truck size={16} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Shipping</p>
                    <p className="font-medium">{order.shipping === 0 ? "Free Shipping" : `$${order.shipping?.toFixed(2)}`}</p>
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
                  Please have <strong>${order.total?.toFixed(2)}</strong> in cash ready when your order arrives.
                  Our delivery agent will collect the payment at your doorstep.
                </p>
              </div>
            )}

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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            If you have any questions about your order, please contact our customer support.
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
