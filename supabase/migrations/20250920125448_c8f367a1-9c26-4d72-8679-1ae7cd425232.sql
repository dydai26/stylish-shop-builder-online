-- Insert sample promo codes for testing
INSERT INTO public.promo_codes (code, discount_percentage, is_active, max_usage_count) VALUES 
('WELCOME10', 10, true, 100),
('SAVE20', 20, true, 50),
('LENUTA10', 10, true, null);