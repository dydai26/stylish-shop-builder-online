
import { Review } from "@/context/ReviewsContext";
import { Star, StarHalf } from "lucide-react";

interface ReviewCardProps {
  review: Review;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }
    
    return stars;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <div className="bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center text-gray-700 font-medium mr-3">
          {review.name.charAt(0)}
        </div>
        <div>
          <h4 className="font-medium">{review.name}</h4>
          <div className="flex">
            {renderStars(review.rating)}
          </div>
        </div>
      </div>
      <p className="text-gray-700 text-left">{review.text}</p>
    </div>
  );
};

export default ReviewCard;
