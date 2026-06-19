import { Star, StarHalf } from "lucide-react";

interface StarRatingProps {
  rating: number;
  totalReviews?: number;
  className?: string;
  showReviewsCount?: boolean;
}

export function StarRating({ rating, totalReviews, className = "", showReviewsCount = true }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <Star key={i} className="w-4 h-4 fill-brand-orange text-brand-orange" />;
          }
          if (i === fullStars && hasHalfStar) {
            return <StarHalf key={i} className="w-4 h-4 fill-brand-orange text-brand-orange" />;
          }
          return <Star key={i} className="w-4 h-4 text-gray-300" />;
        })}
      </div>
      {showReviewsCount && totalReviews !== undefined && (
        <span className="text-sm text-gray-600 ml-2">{totalReviews} reviews</span>
      )}
    </div>
  );
}
