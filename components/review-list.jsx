import { ThumbsUp, MessageSquare, Star } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";

// Simple StarRating component for exact display
const StarRating = ({ rating, size = "small" }) => {
  const starSize = size === "small" ? "w-4 h-4" : "w-5 h-5";
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star
          key={`full-${i}`}
          className={`${starSize} text-yellow-400 fill-current`}
        />
      ))}
      {/* Half star */}
      {hasHalfStar && (
        <div className="relative">
          <Star className={`${starSize} text-gray-300`} />
          <Star
            className={`${starSize} text-yellow-400 fill-current absolute inset-0`}
            style={{ clipPath: "inset(0 50% 0 0)" }}
          />
        </div>
      )}
      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} className={`${starSize} text-gray-300`} />
      ))}
    </div>
  );
};

export default function ReviewsList() {
  const { id } = useParams(); // Get product_id from URL
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;

      setLoading(true);
      setError("");

      const productId = isNaN(id) ? id : parseInt(id);

      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", productId) // Filter by current product
        .order("created_at", { ascending: false });

      if (error) {
        setError(`Supabase error: ${error.message}`);
        setLoading(false);
        return;
      }

      setReviews(data || []);
      setLoading(false);
    };

    fetchReviews();
  }, [id]);

  // Memoize grouped reviews and flattened reviews for performance
  const { userReviews, allReviews } = useMemo(() => {
    const userMap = {};

    reviews.forEach((review) => {
      const userId = review.user_id || review.user_name || "anonymous";

      if (!userMap[userId]) {
        userMap[userId] = {
          user_id: userId,
          user_name: review.user_name || "Anonymous",
          user_image_url: review.user_image_url,
          reviews: [],
          totalReviews: 0,
        };
      }

      userMap[userId].reviews.push(review);
      userMap[userId].totalReviews++;
    });

    const grouped = Object.values(userMap);
    const flattened = reviews; // Since reviews are already in order, no need to flatten grouped

    return { userReviews: grouped, allReviews: flattened };
  }, [reviews]);

  if (loading)
    return <p className="text-sm text-gray-500">Loading reviews...</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;

  const displayedReviews = showAll ? allReviews : allReviews.slice(0, 4);
  const hasMoreReviews = allReviews.length > 4;

  return (
    <div className="space-y-6 mt-6">
      {/* TOTAL REVIEWS COUNT */}
      <h3 className="text-lg font-semibold">Reviews ({allReviews.length})</h3>

      {/* USER STATISTICS SECTION */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-3">Reviewers ({userReviews.length})</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {userReviews.map((user) => (
            <div
              key={user.user_id}
              className="flex items-center gap-3 p-2 bg-white rounded border"
            >
              <div className="w-10 h-10 flex-shrink-0">
                {user.user_image_url ? (
                  <img
                    src={user.user_image_url}
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className={`w-10 h-10 bg-[#D4A574] text-white rounded-full flex items-center justify-center font-bold text-sm ${
                    user.user_image_url ? "hidden" : "flex"
                  }`}
                >
                  {user.user_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 truncate">
                  {user.user_name}
                </p>
                <p className="text-xs text-gray-500">
                  {user.totalReviews} review{user.totalReviews !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* INDIVIDUAL REVIEWS LIST */}
      {displayedReviews.length === 0 ? (
        <p className="text-sm text-gray-500">No reviews yet.</p>
      ) : (
        displayedReviews.map((review) => {
          // Find user stats for this review
          const userStats = userReviews.find(
            (user) =>
              user.user_id ===
              (review.user_id || review.user_name || "anonymous")
          );

          return (
            <div
              key={review.id}
              className="border-b border-gray-100 pb-4 last:border-b-0"
            >
              <div className="flex gap-3">
                {/* USER AVATAR */}
                <div className="w-12 h-12 flex-shrink-0">
                  {review.user_image_url ? (
                    <img
                      src={review.user_image_url}
                      alt="User"
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-12 h-12 bg-[#D4A574] text-white rounded-full flex items-center justify-center font-bold text-lg ${
                      review.user_image_url ? "hidden" : "flex"
                    }`}
                  >
                    {review.user_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <h4 className="font-medium text-sm text-gray-900">
                        {review.user_name || "Anonymous"}
                      </h4>
                      {userStats && userStats.totalReviews > 1 && (
                        <p className="text-xs text-gray-500">
                          {userStats.totalReviews} reviews
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {/* RATING - Show exact individual rating with stars and text */}
                  <div className="mb-2 flex items-center gap-2">
                    <StarRating rating={review.rating || 0} size="small" />
                    <span className="text-xs text-gray-500">
                      {review.rating || 0} out of 5
                    </span>
                  </div>

                  {/* TEXT */}
                  {review.review_text && (
                    <p className="text-sm text-gray-600 mb-2">
                      {review.review_text}
                    </p>
                  )}

                  {/* ACTION BUTTONS */}
                  <div className="flex gap-3 text-xs">
                    <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition">
                      <ThumbsUp className="w-3 h-3" />
                      Helpful ({review.helpful_count || 0})
                    </button>

                    <button className="flex items-center gap-1 text-blue-600 hover:underline">
                      <MessageSquare className="w-3 h-3" />
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}

      {/* SHOW MORE BUTTON */}
      {hasMoreReviews && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="text-sm font-medium text-blue-600 hover:underline mt-4"
        >
          View All Reviews ({allReviews.length})
        </button>
      )}
    </div>
  );
}
