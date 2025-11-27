"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";

export default function StarRating({ size = "md" }) {
  const { id } = useParams(); // product_id
  const [count, setCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const sizeClass = size === "lg" ? "w-5 h-5" : "w-4 h-4";
  const stars = [1, 2, 3, 4, 5];

  useEffect(() => {
    if (!id) return;

    const fetchReviews = async () => {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("reviews")
        .select("rating")
        .eq("product_id", id);

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      const reviews = data || [];
      setCount(reviews.length);

      // Calculate average rating
      const totalRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
      const avg = reviews.length ? totalRating / reviews.length : 0;
      setAverageRating(avg);

      setLoading(false);
    };

    fetchReviews();
  }, [id]);

  if (loading) return <p className="text-sm text-gray-500">Loading...</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {stars.map((star) => {
          let fillClass = "text-gray-300"; // empty star

          if (averageRating >= star) {
            fillClass = "text-yellow-400"; // full star
          } else if (averageRating >= star - 0.5) {
            fillClass = "text-yellow-400/50"; // half star
          }

          return (
            <svg
              key={star}
              className={`${sizeClass} ${fillClass}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          );
        })}
      </div>

      <p className="text-sm text-gray-700">
        {count} {count === 1 ? "Review" : "Reviews"}
      </p>
    </div>
  );
}
