import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useReviews } from "@/context/ReviewsContext";
import { uploadMultipleImages } from "@/lib/imageUploadService";
import { useToast } from "@/hooks/use-toast";

interface ReviewFormDialogProps {
  productId: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ReviewFormDialog: React.FC<ReviewFormDialogProps> = ({
  productId,
  isOpen,
  onOpenChange,
}) => {
  const { addReview } = useReviews();
  const { toast } = useToast();
  
  const [reviewName, setReviewName] = useState("");
  const [reviewEmail, setReviewEmail] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewFiles, setReviewFiles] = useState<File[]>([]);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReview(true);
    try {
      let uploadedUrls: string[] = [];
      if (reviewFiles.length > 0) {
        const uploadResults = await uploadMultipleImages(reviewFiles, "reviews");
        uploadedUrls = uploadResults.map(r => r.url);
      }

      await addReview({
        name: reviewName,
        text: reviewText,
        rating: reviewRating,
        product_id: productId,
        image_urls: uploadedUrls.length > 0 ? uploadedUrls : null,
      });

      onOpenChange(false);
      setReviewName("");
      setReviewEmail("");
      setReviewText("");
      setReviewRating(5);
      setReviewFiles([]);

      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback! Your review has been added.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to submit your review. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-brand-brown mb-2">Write a Review</DialogTitle>
          <DialogDescription className="sr-only">Form to submit a product rating and feedback</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="rating">Rating</Label>
            <div className="flex gap-1 text-2xl cursor-pointer">
              {[1, 2, 3, 4, 5].map((star) => (
                <span 
                  key={star} 
                  onClick={() => setReviewRating(star)}
                  className={star <= reviewRating ? "text-brand-orange" : "text-gray-300"}
                >★</span>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your name" value={reviewName} onChange={e => setReviewName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email <span className="text-gray-400 font-normal text-xs">(optional)</span></Label>
              <Input id="email" type="email" placeholder="Your email" value={reviewEmail} onChange={e => setReviewEmail(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="review">Review</Label>
            <Textarea 
              id="review" 
              placeholder="Share your thoughts about this product..." 
              rows={4}
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photos" className="flex items-center gap-2 mb-2">
              <span className="text-lg">📸</span> Upload Photos <span className="text-gray-400 font-normal text-xs">(optional)</span>
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative group">
              <Input 
                id="photos" 
                type="file" 
                accept="image/*" 
                multiple 
                onChange={(e) => {
                  if (e.target.files) {
                    setReviewFiles(Array.from(e.target.files));
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              />
              <div className="text-gray-500 text-center pointer-events-none flex flex-col items-center">
                <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-105 transition-transform">
                  <svg className="w-6 h-6 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </div>
                <div><span className="text-brand-orange font-medium">Click to upload</span> or drag and drop</div>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</p>
                {reviewFiles.length > 0 && (
                  <div className="mt-3 text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">
                    {reviewFiles.length} file(s) selected
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={isSubmittingReview} className="bg-brand-orange hover:bg-brand-orange/90 text-white px-8">
              {isSubmittingReview ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewFormDialog;
