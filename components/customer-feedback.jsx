import StarRating from "./star-rating";

export default function CustomerFeedback({ reviews = 0, ratingBreakdown = [] }) {
  const totalReviews =
    ratingBreakdown.reduce((sum, item) => sum + item.percentage, 0) /
    ratingBreakdown.length;

  const totalCount = ratingBreakdown.reduce((sum, item) => sum + item.count, 0);
  const totalRatings = ratingBreakdown.reduce(
    (sum, item) => sum + item.stars * item.count,
    0
  );

  const avgRating = totalCount ? totalRatings / totalCount : 0;

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-8">
        Customer Feedback
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Rating Summary */}
        <div className="flex flex-col items-center justify-center bg-gray-50 p-8 rounded-lg">
          <div className="text-5xl font-bold text-blue-600 mb-2">
            {avgRating.toFixed(1)}
          </div>
          <StarRating rating={avgRating} size="lg" />
          <p className="text-sm text-muted-foreground text-center mt-2">
            {totalCount} Reviews
          </p>
        </div>

        {/* Rating Breakdown */}
        <div className="md:col-span-2 space-y-3">
          {ratingBreakdown.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <StarRating rating={item.stars} size="sm" />
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${Math.min(item.percentage, 100)}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-yellow-400 min-w-fit">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
