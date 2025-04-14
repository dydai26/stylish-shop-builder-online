
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
}

interface ReviewsContextType {
  reviews: Review[];
  addReview: (review: Omit<Review, "id" | "date">) => Promise<void>;
  loading: boolean;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export const ReviewsProvider = ({ children }: { children: ReactNode }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Load reviews from Supabase on initial render
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching reviews:', error);
          return;
        }
        
        if (data) {
          setReviews(data);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const addReview = async (reviewData: Omit<Review, "id" | "date">) => {
    try {
      const newReview = {
        ...reviewData,
        date: new Date().toISOString().split('T')[0]
      };
      
      const { data, error } = await supabase
        .from('reviews')
        .insert([newReview])
        .select();
      
      if (error) {
        console.error('Error adding review:', error);
        return;
      }
      
      if (data && data.length > 0) {
        setReviews(prevReviews => [data[0], ...prevReviews]);
      }
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  return (
    <ReviewsContext.Provider value={{ reviews, addReview, loading }}>
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewsContext);
  if (context === undefined) {
    throw new Error("useReviews must be used within a ReviewsProvider");
  }
  return context;
};
