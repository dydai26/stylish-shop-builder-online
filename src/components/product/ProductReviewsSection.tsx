import React, { useState } from 'react';
import { StarRating } from "@/components/ui/StarRating";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import ReviewFormDialog from "./ReviewFormDialog";

interface Review {
  name: string;
  rating: number;
  text: string;
  date?: string;
  product_id?: number | null;
  image_urls?: string[] | null;
}

interface ProductReviewsSectionProps {
  productId: number;
  productReviews: Review[];
  averageRating: number;
  totalReviewsCount: number;
}

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({
  productId,
  productReviews,
  averageRating,
  totalReviewsCount,
}) => {
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-brand-beige/20 border-t border-gray-200">
      <div className="container-custom">
        <div className="mb-8 sm:mb-12">
           <h2 className="text-2xl sm:text-3xl font-bold text-brand-brown mb-2 text-center sm:text-left">Customer Reviews</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16">
          {/* Reviews Summary */}
          <div className="md:col-span-5 lg:col-span-4 bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center">
             <div className="text-5xl sm:text-6xl font-bold text-brand-brown mb-3 sm:mb-4">
               {averageRating.toFixed(1)}
             </div>
             <div className="mb-3 sm:mb-4 scale-110 sm:scale-125 flex justify-center w-full">
               <StarRating rating={averageRating} showReviewsCount={false} />
             </div>
            <p className="text-gray-500 text-sm mb-4">Based on {totalReviewsCount} reviews</p>
            {totalReviewsCount > 0 && (
              <div className="text-brand-orange font-bold text-lg">
                {Math.round((productReviews.filter(r => r.rating >= 4).length / totalReviewsCount) * 100)}% recommend
              </div>
            )}
          </div>
          
          {/* Rating Bars */}
          <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-center gap-3 sm:gap-4">
             {[
               { stars: 5, count: productReviews.filter(r => r.rating === 5).length, percent: productReviews.length ? (productReviews.filter(r => r.rating === 5).length / productReviews.length) * 100 : 0 },
               { stars: 4, count: productReviews.filter(r => r.rating === 4).length, percent: productReviews.length ? (productReviews.filter(r => r.rating === 4).length / productReviews.length) * 100 : 0 },
               { stars: 3, count: productReviews.filter(r => r.rating === 3).length, percent: productReviews.length ? (productReviews.filter(r => r.rating === 3).length / productReviews.length) * 100 : 0 },
               { stars: 2, count: productReviews.filter(r => r.rating === 2).length, percent: productReviews.length ? (productReviews.filter(r => r.rating === 2).length / productReviews.length) * 100 : 0 },
               { stars: 1, count: productReviews.filter(r => r.rating === 1).length, percent: productReviews.length ? (productReviews.filter(r => r.rating === 1).length / productReviews.length) * 100 : 0 }
             ].map((bar) => (
               <div key={bar.stars} className="flex items-center gap-3 sm:gap-4 text-sm sm:text-base font-medium">
                 <div className="w-10 sm:w-12 text-brand-brown">{bar.stars} ★</div>
                 <div className="flex-1 h-2 sm:h-3 bg-gray-200 rounded-full overflow-hidden">
                   <div className="h-full bg-brand-orange rounded-full transition-all duration-500" style={{ width: `${bar.percent}%` }}></div>
                 </div>
                 <div className="w-8 sm:w-12 text-right text-gray-500">{bar.count}</div>
               </div>
             ))}
             
             {/* Photo Reviews Gallery */}
             {(() => {
               const allReviewImages = productReviews
                 .filter(review => review.image_urls && Array.isArray(review.image_urls))
                 .flatMap(review => review.image_urls as string[]);
               
               if (allReviewImages.length === 0) return null;
               
               return (
                 <div className="flex gap-3 sm:gap-4 mt-4 sm:mt-6 overflow-x-auto pb-2 scrollbar-hide">
                   {allReviewImages.map((url, i) => (
                     <Dialog key={i}>
                       <DialogTrigger asChild>
                         <img src={url} alt={`Customer review photo ${i+1}`} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0 cursor-pointer border-2 border-transparent hover:border-brand-orange transition-colors" />
                       </DialogTrigger>
                       <DialogContent className="max-w-3xl p-0 overflow-hidden bg-black/90 border-none flex items-center justify-center">
                         <DialogTitle className="sr-only">Customer Review Photo Zoom</DialogTitle>
                         <DialogDescription className="sr-only">Zoomed customer review photo</DialogDescription>
                         <img src={url} alt={`Customer review photo ${i+1}`} className="max-w-full max-h-[90vh] object-contain" />
                       </DialogContent>
                     </Dialog>
                   ))}
                 </div>
               );
             })()}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 sm:gap-4 my-8 sm:my-10 justify-center items-center">
          <div className="px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm transition-colors shadow-sm bg-brand-orange text-white font-semibold">
             All ({productReviews.length})
          </div>
          
          <button 
            onClick={() => setIsReviewDialogOpen(true)}
            className="px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm transition-colors shadow-sm border-2 border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white font-semibold uppercase tracking-wide cursor-pointer bg-white"
          >
            WRITE A REVIEW
          </button>
        </div>
        
        {/* Review List */}
        <div className="space-y-4 sm:space-y-6">
          {productReviews.length === 0 ? (
            <p className="text-gray-500 italic text-center py-8">No reviews yet for this product. Be the first to leave one!</p>
          ) : (
            productReviews.map((review, idx) => (
              <div key={idx} className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
                  <div>
                    <h4 className="font-bold text-brand-brown text-base sm:text-lg flex items-center gap-2">
                      {review.name}
                      <span className="text-green-600 text-xs font-semibold bg-green-50 px-2 py-0.5 rounded-full">✓ Verified Buyer</span>
                    </h4>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">{review.date}</div>
                    <StarRating rating={review.rating} showReviewsCount={false} />
                  </div>
                </div>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {review.text}
                </p>
                {review.image_urls && Array.isArray(review.image_urls) && review.image_urls.length > 0 && (
                  <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {review.image_urls.map((url, i) => (
                      <Dialog key={i}>
                        <DialogTrigger asChild>
                          <img src={url} alt={`Review photo ${i+1}`} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md cursor-pointer border border-gray-200 hover:border-brand-orange transition-colors" />
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-black/90 border-none flex items-center justify-center">
                          <DialogTitle className="sr-only">Customer Review Photo Zoom</DialogTitle>
                          <DialogDescription className="sr-only">Zoomed customer review photo</DialogDescription>
                          <img src={url} alt={`Review photo ${i+1}`} className="max-w-full max-h-[90vh] object-contain" />
                        </DialogContent>
                      </Dialog>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        
        {/* Write a Review Dialog */}
        <ReviewFormDialog 
          productId={productId}
          isOpen={isReviewDialogOpen}
          onOpenChange={setIsReviewDialogOpen}
        />
      </div>
    </section>
  );
};

export default ProductReviewsSection;
