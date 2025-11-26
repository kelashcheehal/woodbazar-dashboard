"use client";

import { Truck, RotateCcw, Shield, Star } from "lucide-react";

export default function ProductFeatures() {
  const features = [
    {
      icon: Truck,
      title: "Free Delivery",
      description: "On orders over $50. Enter postal code for availability.",
      color: "text-blue-500",
    },
    {
      icon: RotateCcw,
      title: "30-Day Returns",
      description: "Free returns within 30 days. No questions asked.",
      color: "text-green-500",
    },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "100% secure checkout with multiple payment options.",
      color: "text-purple-500",
    },
    {
      icon: Star,
      title: "Quality Guarantee",
      description: "Premium quality products with satisfaction guarantee.",
      color: "text-yellow-500",
    },
  ];

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold  mb-8 text-gray-800">Why Choose Us?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1"
          >
            <div className="flex flex-col items-start ">
              <div
                className={`mb-2 p-2 rounded-full bg-gray-50 group-hover:bg-gray-100 transition-colors duration-300`}
              >
                <feature.icon
                  size={32}
                  className={`${feature.color} group-hover:scale-110 transition-transform duration-300`}
                />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-800">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
