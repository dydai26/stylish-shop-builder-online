-- Migration: Add about_settings table and seed initial content
CREATE TABLE IF NOT EXISTS public.about_settings (
    id uuid default gen_random_uuid() primary key,
    key text unique not null,
    title text,
    description text,
    content jsonb,
    images jsonb,
    meta_title text,
    meta_description text,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.about_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (safe replay)
DROP POLICY IF EXISTS "Allow public read access to about_settings" ON public.about_settings;
DROP POLICY IF EXISTS "Allow admin write access to about_settings" ON public.about_settings;

-- Create Policies
CREATE POLICY "Allow public read access to about_settings"
ON public.about_settings FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow admin write access to about_settings"
ON public.about_settings FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Seed initial values for Homepage Philosophy Box
INSERT INTO public.about_settings (key, title, description, images)
VALUES (
  'home_philosophy',
  'About Ecovluu',
  'At Ecovluu, we craft hair care made for real results — deeply nourishing, sulfate-free formulas designed for dry, damaged, and color-treated hair. Every product is recommended by professionals and made with ingredients that restore strength, shine, and softness from root to tip.',
  '["/2.jpg"]'::jsonb
) ON CONFLICT (key) DO UPDATE 
SET title = EXCLUDED.title,
    description = EXCLUDED.description,
    images = EXCLUDED.images;

-- Seed initial values for About Us main page
INSERT INTO public.about_settings (key, title, description, images, content)
VALUES (
  'about_page',
  'About Us',
  'Discover the story behind ECOVLUU. We develop premium natural hair care products to restore, hydrate, and strengthen your hair using professional formulas.',
  '["/1.jpg", "/_DSC8542.jpg", "/2.jpg", "/_DSC8533.jpg"]'::jsonb,
  '{
    "approach": [
      {
        "title": "CRAMBE ABYSSINICA OIL",
        "description": "Deeply hydrates without weighing hair down. Reduces frizz and smooths the hair cuticle.",
        "image": "/cramble.jpg"
      },
      {
        "title": "GENADVANCE® LIFE",
        "description": "We''ve chosen Genadvance® Life for its ability to breathe new life into tired, dry hair.",
        "image": "/genadv.jpg"
      },
      {
        "title": "KERATIN",
        "description": "Rebuilds hair structure, fills in damaged areas, and improves elasticity and strength.",
        "image": "/keratin.jpg"
      },
      {
        "title": "SAFFRON EXTRACT",
        "description": "Rich in antioxidants. Protects hair from environmental stressors and maintains color vibrancy.",
        "image": "/safron.jpg"
      },
      {
        "title": "AMINO ACIDS COMPLEX",
        "description": "Strengthens hair roots, stimulates growth, and prevents breakage by reinforcing structural bonds.",
        "image": "/amino.jpg"
      },
      {
        "title": "ALOE VERA EXTRACT",
        "description": "Soothes the scalp, balances hydration, and adds natural shine and softness to every strand.",
        "image": "/aloe.jpg"
      }
    ],
    "founder": {
      "images": ["/img1.jpg", "/image 2.jpg", "/img3.jpg"],
      "text": "Ecovluu was founded on the belief that hair care should be both natural and effective. As a hair care specialist with 25 years of experience, I wanted to create products that deliver salon-quality results at home using clean, premium ingredients."
    },
    "steps": [
      {
        "num": "1",
        "title": "Apply",
        "desc": "Apply a small amount of shampoo to damp hair, massage into a rich lather, and rinse."
      },
      {
        "num": "2",
        "title": "Restore",
        "desc": "Distribute the conditioning mask evenly through damp hair, focusing on lengths and ends."
      },
      {
        "num": "3",
        "title": "Wait",
        "desc": "Leave the mask on for 5–10 minutes to allow the natural active ingredients to penetrate deeply."
      },
      {
        "num": "4",
        "title": "Enjoy!",
        "desc": "Enjoy the result: nourished, shiny and hydrated hair."
      }
    ]
  }'::jsonb
) ON CONFLICT (key) DO UPDATE
SET title = EXCLUDED.title,
    description = EXCLUDED.description,
    images = EXCLUDED.images,
    content = EXCLUDED.content;
