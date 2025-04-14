import { useState } from "react";
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
    <div className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-2 text-center">Customer Reviews</h2>
          <p className="text-center text-gray-600">See what our customers say about our products</p>
        </div>
        
        {loading ? (
          <div className="flex justify-center my-10">
            <div className="animate-pulse rounded-lg bg-gray-200 h-36 w-full max-w-md"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {reviews.slice(0, 4).map(review => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
        
        <div className="flex flex-row justify-center gap-4">
          <Button
            onClick={() => setFormOpen(!formOpen)}
            className="bg-brand-brown text-white font-medium rounded hover:bg-opacity-90 transition-colors w-[136px] h-[40px]"
          >
            {formOpen ? "Cancel" : "Leave a Review"}
          </Button>
          
          <Link to="/reviews">
            <Button
              className="bg-brand-orange text-white font-medium rounded hover:bg-opacity-90 transition-colors w-[136px] h-[40px]"
            >
              All Reviews
            </Button>
          </Link>
        </div>
        
        {formOpen && (
          <div className="mt-10 max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-medium mb-4">Write a Review</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block mb-1 font-medium">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-1 font-medium">
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
                        className={`h-6 w-6 ${
                          star <= formData.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="text" className="block mb-1 font-medium">
                  Your Review
                </label>
                <textarea
                  id="text"
                  name="text"
                  value={formData.text}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={submitting}
                className={`bg-brand-orange text-white font-medium px-4 py-2 rounded hover:bg-opacity-90 transition-colors ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
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
