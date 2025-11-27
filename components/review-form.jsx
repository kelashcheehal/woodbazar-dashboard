"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useClerk, useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";

export default function ReviewForm() {
  const { user, isLoaded } = useUser();
  const { openSignIn } = useClerk();
  const router = useRouter();
  const { id: productId } = useParams();

  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({ rating: 0, content: "" });

  if (!isLoaded) return <p>Loading...</p>;

  const userName =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Anonymous";

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const userImage = user?.imageUrl || null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRating = (ratingValue) => {
    setFormData((prev) => ({ ...prev, rating: ratingValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return openSignIn();

    if (formData.rating === 0) {
      alert("Please select a rating.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("reviews").insert([
        {
          user_id: user.id,
          product_id: productId,
          rating: formData.rating,
          review_text: formData.content,
          user_name: userName,
          user_image_url: userImage,
        },
      ]);

      if (error) throw error;

      setFormData({ rating: 0, content: "" });
      alert("Review submitted successfully!");
      router.refresh();
    } catch (err) {
      console.error("Submit Error:", err);
      alert("Failed to submit review. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl w-full">
      <h3 className="text-xl font-bold mb-6">Write a Review</h3>

      {/* User Avatar */}
      <div className="flex items-center gap-4 mb-6">
        {userImage && !imageError ? (
          <img
            src={userImage}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-12 h-12 bg-[#D4A574] text-white rounded-full flex items-center justify-center font-bold text-lg">
            {initials}
          </div>
        )}

        <div>
          <p className="font-semibold text-gray-900">{userName}</p>
          <p className="text-sm text-gray-500">Sharing your review</p>
        </div>
      </div>

      {/* Review Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Rate this Product
          </label>
          <div className="flex gap-1">
            {Array.from({ length: 5 }, (_, i) => {
              const starNumber = i + 1;
              return (
                <button
                  key={starNumber}
                  type="button"
                  onClick={() => handleRating(starNumber)}
                  className="text-3xl"
                >
                  <svg
                    className={`w-8 h-8 ${
                      formData.rating >= starNumber
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              );
            })}
          </div>
        </div>

        {/* Review Content */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Share your Experience
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={5}
            placeholder="Write your review..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
