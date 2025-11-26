"use client";


import CustomerFeedback from "./customer-feedback";
import ReviewForm from "./review-form";

export default function ProductTabs({
  activeTab,
  setActiveTab,
  descriptionSections,
  customerReviews,
  ratingBreakdown,
}) {
  return (
    <div className="border-t pt-8">
      {/* Tab Navigation */}
      <div className="flex border-b mb-8">
        <button
          onClick={() => setActiveTab("description")}
          className={`px-6 py-4 font-semibold transition border-b-2 ${
            activeTab === "description"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Description
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`px-6 py-4 font-semibold transition border-b-2 ${
            activeTab === "reviews"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Reviews
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "description" ? (
          <DescriptionContent sections={descriptionSections} />
        ) : (
          <div className="space-y-12">
            <CustomerFeedback
              reviews={customerReviews}
              ratingBreakdown={ratingBreakdown}
            />
            <ReviewsList reviews={customerReviews} />
            <ReviewForm />
          </div>
        )}
      </div>
    </div>
  );
}
