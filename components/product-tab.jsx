"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useParams } from "next/navigation";
import { useProducts } from "@/app/contexts/ProductsContext";

export default function ProductTabs() {
  const { id } = useParams();
  const { products, loading } = useProducts();
  const [activeTab, setActiveTab] = useState("overview");

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">Loading...</div>
    );
  }

  const product = products.find((p) => p.id.toString() === id) || {};

  const features = product.features || ["No features available"];
  const specifications = product.specifications || {};
  const reviews = product.reviews_data || [];

  return (
    <div className="mb-12 bg-white border-b-2 border-[#f0f0f0]">
      {/* Tab Navigation */}
      <div className="flex gap-6 mb-6 border-b-2 border-[#f0f0f0] overflow-x-auto">
        {["overview", "specifications", "reviews"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="pb-3 font-bold text-xs md:text-sm transition-all duration-300 relative whitespace-nowrap uppercase tracking-wider"
            style={{
              color: activeTab === tab ? "var(--primary-dark)" : "#999",
            }}
          >
            {tab}
            {activeTab === tab && (
              <span
                className="absolute bottom-0 left-0 right-0 h-1 rounded-full"
                style={{ backgroundColor: "var(--primary-gold)" }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in duration-500">
        {activeTab === "overview" && (
          <div className="space-y-4">
            <h3
              className="text-lg font-bold"
              style={{ color: "var(--primary-dark)" }}
            >
              Key Features
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm">
                  <span
                    className="text-lg flex-shrink-0"
                    style={{ color: "var(--primary-gold)" }}
                  >
                    ✓
                  </span>
                  <span style={{ color: "#666" }}>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "specifications" && (
          <div className="space-y-2 text-sm">
            {Object.entries(specifications).length > 0 ? (
              Object.entries(specifications).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between py-2.5 border-b"
                  style={{ borderColor: "#f0f0f0" }}
                >
                  <span
                    className="font-semibold capitalize"
                    style={{ color: "var(--primary-dark)" }}
                  >
                    {key}
                  </span>
                  <span style={{ color: "#666" }}>{value}</span>
                </div>
              ))
            ) : (
              <p className="text-red-600 text-xs">
                No specifications available
              </p>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-5">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="pb-4 border-b text-sm"
                  style={{ borderColor: "#f0f0f0" }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p
                        className="font-bold"
                        style={{ color: "var(--primary-dark)" }}
                      >
                        {review.author}
                      </p>
                      <p className="text-xs" style={{ color: "#999" }}>
                        {review.date}
                      </p>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={13}
                          className="fill-current"
                          style={{
                            color:
                              i < review.rating
                                ? "var(--primary-gold)"
                                : "#e5e5e5",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <p
                    className="font-semibold mb-1"
                    style={{ color: "var(--primary-dark)" }}
                  >
                    {review.title}
                  </p>
                  <p style={{ color: "#666", lineHeight: "1.5" }}>
                    {review.comment}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-red-600 text-xs">No reviews yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
