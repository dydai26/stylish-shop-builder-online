import React, { useState } from "react";
import { useReviews } from "@/context/ReviewsContext";
import ReviewCard from "@/components/ui/ReviewCard";
import { Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ReviewsSection = () => {
  const { reviews, addReview, loading } = useReviews();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 5,
    text: ""
  });
  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.text.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setSubmitting(true);
      await addReview(formData);
      toast({
        title: "Thank you!",
        description: "Your review has been submitted successfully."
      });
      
      setFormData({
        name: "",
        email: "",
        rating: 5,
        text: ""
      });
      
      setFormOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-8 sm:py-12 md:py-16 bg-gray-50">
      <div className="container-custom">
        <div className="mb-6 sm:mb-8 md:mb-10 px-4 sm:px-0">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-center">Customer Reviews</h2>
          <p className="text-center text-black text-sm sm:text-base">See what our customers say about our products</p>
        </div>
        
        {loading ? (
          <div className="flex justify-center my-6 sm:my-8 md:my-10">
            <div className="animate-pulse rounded-lg bg-gray-200 h-32 sm:h-36 w-full max-w-md"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8 md:mb-10">
            {reviews.slice(0, 4).map(review => (
              <div key={review.id}><ReviewCard review={review} /></div>
            ))}
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4 sm:px-0">
          <Button
            onClick={() => setFormOpen(!formOpen)}
            className="bg-brand-brown text-white font-medium rounded hover:bg-opacity-90 transition-colors w-full sm:w-[136px] h-[40px] text-sm sm:text-base"
          >
            {formOpen ? "Cancel" : "Leave a Review"}
          </Button>
          
          <Link to="/reviews" className="w-full sm:w-auto">
            <Button
              className="bg-brand-orange text-white font-medium rounded hover:bg-opacity-90 transition-colors w-full sm:w-[136px] h-[40px] text-sm sm:text-base"
            >
              All Reviews
            </Button>
          </Link>
        </div>
        
        {formOpen && (
          <div className="mt-6 sm:mt-8 md:mt-10 max-w-2xl mx-auto bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <h3 className="text-lg sm:text-xl font-medium mb-3 sm:mb-4">Write a Review</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3 sm:mb-4">
                <label htmlFor="name" className="block mb-1 font-medium text-sm sm:text-base">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded text-sm sm:text-base"
                  required
                />
              </div>
              
              <div className="mb-3 sm:mb-4">
                <label htmlFor="email" className="block mb-1 font-medium text-sm sm:text-base">
                  Your Email (optional)
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded text-sm sm:text-base"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div className="mb-3 sm:mb-4">
                <label className="block mb-1 font-medium text-sm sm:text-base">
                  Rating
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-5 w-5 sm:h-6 sm:w-6 ${
                          star <= formData.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-3 sm:mb-4">
                <label htmlFor="text" className="block mb-1 font-medium text-sm sm:text-base">
                  Your Review
                </label>
                <textarea
                  id="text"
                  name="text"
                  value={formData.text}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded text-sm sm:text-base resize-none"
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={submitting}
                className={`bg-brand-orange text-white font-medium px-4 sm:px-6 py-2 sm:py-3 rounded hover:bg-opacity-90 transition-colors text-sm sm:text-base w-full sm:w-auto ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;
