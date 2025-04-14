
import Layout from "@/components/layout/Layout";
import { useReviews } from "@/context/ReviewsContext";
import ReviewCard from "@/components/ui/ReviewCard";
import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Reviews = () => {
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

  // Group reviews by rating for statistics
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 
    ? Math.round((reviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews) * 10) / 10
    : 0;
  
  const ratingCounts = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };

  return (
    <Layout>
      <div className="bg-gray-50 py-16">
        <div className="container-custom">
          <h1 className="text-3xl font-bold mb-4 text-center">Customer Reviews</h1>
          <p className="text-center text-gray-600 mb-10">See what our customers say about our products</p>
          
          {/* Reviews statistics */}
          {!loading && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center">
                  <div className="text-5xl font-bold text-brand-orange">{avgRating}</div>
                  <div className="flex justify-center mt-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star 
                        key={star} 
                        className={`h-5 w-5 ${star <= Math.round(avgRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} 
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">Based on {totalReviews} reviews</div>
                </div>
                
                <div className="flex-grow w-full md:w-auto">
                  {[5, 4, 3, 2, 1].map(rating => (
                    <div key={rating} className="flex items-center mb-1">
                      <div className="w-12 text-sm text-right pr-2">{rating} star</div>
                      <div className="flex-grow bg-gray-200 h-4 rounded-full overflow-hidden">
                        <div 
                          className="bg-brand-orange h-full" 
                          style={{ width: `${totalReviews > 0 ? (ratingCounts[rating as keyof typeof ratingCounts] / totalReviews) * 100 : 0}%` }}
                        ></div>
                      </div>
                      <div className="w-10 text-sm text-right pl-2">
                        {ratingCounts[rating as keyof typeof ratingCounts]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Write a review button */}
          <div className="text-center mb-12">
            <button
              onClick={() => setFormOpen(!formOpen)}
              className="bg-brand-brown text-white font-medium px-6 py-3 rounded hover:bg-opacity-90 transition-colors"
            >
              {formOpen ? "Cancel" : "Write a Review"}
            </button>
          </div>
          
          {/* Review form */}
          {formOpen && (
            <div className="mt-10 max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md mb-12">
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
          
          {/* Loading state */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center mb-4">
                    <div className="bg-gray-100 rounded-full w-10 h-10 animate-pulse"></div>
                    <div className="ml-3">
                      <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                      <div className="flex mt-1">
                        <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : (
            /* All reviews */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Reviews;
