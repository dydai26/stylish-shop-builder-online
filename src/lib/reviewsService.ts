import { supabase } from "@/integrations/supabase/client";

export interface Review {
  id: string;
  name: string;
  text: string;
  rating: number;
  date?: string;
  product_id?: number | null;
  image_urls?: any;
  created_at: string;
}

export const fetchAllReviews = async (): Promise<Review[]> => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
    throw error;
  }
};

export const addReview = async (review: Omit<Review, 'id' | 'created_at'>): Promise<void> => {
  try {
    const { error } = await supabase
      .from('reviews')
      .insert({
        name: review.name,
        text: review.text,
        rating: review.rating,
        product_id: review.product_id,
        image_urls: review.image_urls,
        date: review.date || new Date().toISOString()
      });

    if (error) {
      console.error('Error adding review:', error);
      throw error;
    }

    console.log('Review added successfully');
  } catch (error) {
    console.error('Failed to add review:', error);
    throw error;
  }
};

export const deleteReview = async (reviewId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);

    if (error) {
      console.error('Error deleting review:', error);
      throw error;
    }

    console.log('Review deleted successfully');
  } catch (error) {
    console.error('Failed to delete review:', error);
    throw error;
  }
};