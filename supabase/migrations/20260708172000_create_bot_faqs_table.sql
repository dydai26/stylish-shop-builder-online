-- Migration: Create bot_faqs table and seed initial content
CREATE TABLE IF NOT EXISTS public.bot_faqs (
    id uuid default gen_random_uuid() primary key,
    question text not null,
    answer text not null,
    display_order integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.bot_faqs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (safe replay)
DROP POLICY IF EXISTS "Allow public read access to bot_faqs" ON public.bot_faqs;
DROP POLICY IF EXISTS "Allow admin write access to bot_faqs" ON public.bot_faqs;

-- Create Policies
CREATE POLICY "Allow public read access to bot_faqs"
ON public.bot_faqs FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow admin write access to bot_faqs"
ON public.bot_faqs FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Seed initial values for Chatbot FAQs
INSERT INTO public.bot_faqs (question, answer, display_order)
VALUES 
  ('What is ECOVLUU?', 'ECOVLUU bridges the gap between clean beauty and professional performance. We combine high-performance botanical actives, amino acids, and modern green science with a commitment to transparency and ingredient purity. All our products are organic, sulfate-free, silicone-free, and paraben-free.', 1),
  ('Shipping & Delivery', 'We offer free standard delivery for all orders above €50! Standard delivery typically takes 2-3 business days. For orders under €50, a standard shipping fee of €4.95 applies.', 2),
  ('Return Policy', 'You can return any unopened and unused product in its original packaging within 14 days of purchase. Please contact our support team to request a return label.', 3),
  ('Which shampoo should I choose?', 'For dry, damaged, or color-treated hair, we highly recommend our Deep Hydrating Shampoo paired with the Deep Conditioning Hair Mask for the best moisturizing and strengthening results.', 4),
  ('Are products safe for colored hair?', 'Absolutely! All ECOVLUU products are sulfate-free and formulated to be extremely gentle, which helps maintain hair fiber integrity and prolongs the vibrancy of your hair color.', 5);
