-- Update RLS policies for reviews to allow admin operations
CREATE POLICY "Authenticated users can delete reviews" 
ON public.reviews 
FOR DELETE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update reviews" 
ON public.reviews 
FOR UPDATE 
USING (auth.role() = 'authenticated');