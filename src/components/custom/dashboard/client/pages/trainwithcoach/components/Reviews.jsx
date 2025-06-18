import { Icon } from "@iconify/react";
import Image from "next/image";

import { Button } from "@/components/common/Button";

export const Reviews = ({ trainer, renderStars }) => {
  // Use real reviews if available, otherwise show empty state
  const reviews = trainer?.testimonials || [];

  // Calculate average rating if reviews exist
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length
      : 0;

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 rounded-full bg-[rgba(255,107,0,0.1)] p-4">
          <Icon
            icon="mdi:account-group"
            width={48}
            height={48}
            className="text-[#FF6B00] opacity-50"
          />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-white">
          No Reviews Yet
        </h3>
        <p className="mb-6 max-w-md text-gray-400">
          This trainer doesn't have any reviews yet. Be the first to train with
          them and share your experience.
        </p>
        <Button variant="orangeOutline" size="medium">
          Book a Session
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-xl font-semibold text-white">
          Client Reviews
        </h3>

        {/* Rating summary */}
        <div className="mb-6 flex flex-col items-center gap-5 rounded-xl border border-[#444] bg-[rgba(30,30,30,0.8)] p-4 sm:flex-row">
          <div className="flex flex-col items-center text-center">
            <div className="mb-1 text-4xl font-bold text-[#FF6B00]">
              {avgRating.toFixed(1)}
            </div>
            <div className="mb-2 flex gap-1">{renderStars(avgRating)}</div>
            <div className="text-sm text-gray-400">
              Based on {reviews.length} reviews
            </div>
          </div>

          <div className="w-full flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((num) => {
              const count = reviews.filter(
                (t) => Math.floor(t.rating) === num
              ).length;
              const percentage = (count / reviews.length) * 100;

              return (
                <div key={num} className="flex items-center gap-3">
                  <div className="w-6 text-sm text-gray-300">{num}★</div>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#333]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00]"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="w-6 text-sm text-gray-300">{count}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Individual reviews */}
      <div className="space-y-5">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="rounded-xl border border-[#444] bg-[rgba(30,30,30,0.8)] p-5 transition-all duration-300 hover:border-[#FF6B00]"
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-3">
                {review.avatar ? (
                  <Image
                    src={review.avatar}
                    alt={review.name}
                    width={48}
                    height={48}
                    className="rounded-full border-2 border-[#FF6B00] object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] text-lg font-semibold text-white">
                    {review.name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="font-medium text-white">{review.name}</div>
                  <div className="text-xs text-gray-400">
                    {review.relationship || "Client"}
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-400">
                {review.date || new Date(review.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="mb-3 flex gap-1">{renderStars(review.rating)}</div>

            <p className="text-sm leading-relaxed text-gray-300">
              "{review.text || review.content}"
            </p>
          </div>
        ))}
      </div>

      {/* Call to action */}
      <div className="rounded-xl border border-[rgba(255,107,0,0.2)] bg-[rgba(255,107,0,0.1)] p-5 text-center">
        <h4 className="mb-2 font-medium text-white">
          Ready to experience results?
        </h4>
        <p className="mb-4 text-sm text-gray-300">
          Join these satisfied clients and start your fitness journey today.
        </p>
        <Button variant="orangeFilled" size="large">
          Book Your First Session
        </Button>
      </div>
    </div>
  );
};
