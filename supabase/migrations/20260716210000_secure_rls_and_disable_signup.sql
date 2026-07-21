-- Migration: Secure RLS policies and disable self-signup for new users

-- 1. Update trigger function to block new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Block all self-signup registrations since the administrator is already registered
  RAISE EXCEPTION 'Registration is closed. Self-signup is disabled.';
  RETURN NEW;
END;
$$;

-- 2. Change default role in profiles to customer (just in case)
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'customer';

-- 3. Secure public.about_settings RLS policies
DROP POLICY IF EXISTS "Allow admin write access to about_settings" ON public.about_settings;
CREATE POLICY "Allow admin write access to about_settings"
ON public.about_settings FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- 4. Secure public.bot_faqs RLS policies
DROP POLICY IF EXISTS "Allow admin write access to bot_faqs" ON public.bot_faqs;
CREATE POLICY "Allow admin write access to bot_faqs"
ON public.bot_faqs FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- 5. Secure public.products RLS policies
DROP POLICY IF EXISTS "Authenticated users can manage products" ON public.products;
CREATE POLICY "Allow admin manage products"
ON public.products FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- 6. Secure public.promo_codes RLS policies
DROP POLICY IF EXISTS "Authenticated users can manage promo codes" ON public.promo_codes;
CREATE POLICY "Allow admin manage promo codes"
ON public.promo_codes FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- 7. Secure public.banners RLS policies
DROP POLICY IF EXISTS "Authenticated users can manage banners" ON public.banners;
CREATE POLICY "Allow admin manage banners"
ON public.banners FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- 8. Secure public.reviews RLS policies for admin delete and update
DROP POLICY IF EXISTS "Authenticated users can delete reviews" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users can update reviews" ON public.reviews;

CREATE POLICY "Allow admin delete reviews"
ON public.reviews FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Allow admin update reviews"
ON public.reviews FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- 9. Secure product-images storage bucket RLS policies for upload, update, and delete
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete product images" ON storage.objects;

CREATE POLICY "Allow admin upload product images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'product-images' AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Allow admin update product images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'product-images' AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Allow admin delete product images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'product-images' AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);
