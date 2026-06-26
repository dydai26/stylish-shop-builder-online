
import { Review } from "@/context/ReviewsContext";
import { Star, StarHalf } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

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
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col h-full">
      <div className="flex items-center mb-4">
        <div className="bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center text-gray-700 font-medium mr-3">
          {review.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h4 className="font-medium">{review.name}</h4>
          <div className="flex mt-1">
            {renderStars(review.rating)}
          </div>
        </div>
      </div>
      <p className="text-gray-700 text-left flex-grow">{review.text}</p>
      
      {review.image_urls && Array.isArray(review.image_urls) && review.image_urls.length > 0 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {review.image_urls.map((url, i) => (
            <Dialog key={i}>
              <DialogTrigger asChild>
                <img src={url} alt={`Review photo ${i+1}`} className="w-16 h-16 object-cover rounded-md cursor-pointer border border-gray-200 hover:border-brand-orange transition-colors flex-shrink-0" />
              </DialogTrigger>
              <DialogContent className="max-w-3xl p-0 overflow-hidden bg-black/90 border-none flex items-center justify-center">
                <img src={url} alt={`Review photo ${i+1}`} className="max-w-full max-h-[90vh] object-contain" />
              </DialogContent>
            </Dialog>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
