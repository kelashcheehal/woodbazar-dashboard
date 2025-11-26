import { ThumbsUp, MessageSquare } from "lucide-react";
import StarRating from "./star-rating";

export default function ReviewsList({ reviews = [] }) {
  return (
    <div>
      <h3 className="text-xl font-bold text-foreground mb-6">Reviews</h3>

      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-muted-foreground">No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b pb-6">
              <div className="flex gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {review.initials}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {review.author}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {review.daysAgo}
                      </p>
                    </div>
                  </div>

                  <div className="mb-2">
                    <StarRating rating={review.rating} />
                  </div>

                  <h5 className="font-semibold text-foreground mb-2">
                    {review.title}
                  </h5>

                  <p className="text-muted-foreground mb-4">{review.content}</p>

                  <div className="flex gap-4 text-sm">
                    <button className="flex items-center gap-2 text-muted-foreground hover:text-blue-600 transition">
                      <ThumbsUp className="w-4 h-4" />
                      Like
                    </button>

                    <button className="flex items-center gap-2 text-blue-600 hover:underline">
                      <MessageSquare className="w-4 h-4" />
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <button className="text-blue-600 hover:underline font-semibold mt-6">
        View All Reviews
      </button>
    </div>
  );
}
