-- Create products table with all required fields including SEO
CREATE TABLE public.products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image TEXT NOT NULL,
  images JSONB DEFAULT '[]'::jsonb,
  description TEXT,
  category TEXT NOT NULL,
  sku TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  benefits JSONB DEFAULT '[]'::jsonb,
  usage TEXT,
  ingredients TEXT,
  meta_title TEXT,
  meta_description TEXT,
  og_image TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for products
CREATE POLICY "Anyone can view active products" 
ON public.products 
FOR SELECT 
USING (status = 'active');

CREATE POLICY "Authenticated users can manage products" 
ON public.products 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Create index for slug
CREATE UNIQUE INDEX idx_products_slug ON public.products(slug);

-- Create index for category
CREATE INDEX idx_products_category ON public.products(category);

-- Create trigger for updated_at
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert the two existing products
INSERT INTO public.products (
  name, slug, price, image, images, description, category, sku, tags, benefits, usage, ingredients, meta_title, meta_description
) VALUES (
  'Deep Hydrating Shampoo',
  'deep-hydrating-shampoo',
  28.50,
  '/2.2.png',
  '["/2.2.png", "/IMG_7130.jpg", "/24.png"]'::jsonb,
  'Deep Hydrating Shampoo – Revitalize your hair with our SLS & SLSA-free Deep Hydrating Shampoo, carefully crafted to cleanse without disrupting the natural moisture balance. Infused with Aloe Vera, Keratin, and Botanical Extracts, it deeply hydrates, softens, and enhances volume, leaving your hair healthy, shiny, and full of life. Suitable for all hair types, including dry, damaged, or colour-treated hair.',
  'shampoo',
  'DP-HYD-SHM',
  '["Aloe Vera Shampoo", "Damaged Hair Repair", "Deep Hydrating Shampoo", "Healthy Hair Shampoo", "Hydrating Hair Care", "Keratin Shampoo"]'::jsonb,
  '["Deeply hydrates and restores moisture with Glycerin, Sodium PCA, Niacinamide, and Betaine.", "Boosts volume and enhances shine without weighing the hair down.", "Smooths frizz and leaves hair soft, silky, and manageable.", "Formulated without SLS, SLSA, silicones, or parabens."]'::jsonb,
  'Apply to wet hair, lather, and rinse thoroughly. For a richer lather, rub between palms before applying. Follow with Ecovluu Deep Conditioning Hair Mask for best results.',
  'Aqua, Sodium Cocoyl Isethionate, Cocamidopropyl Betaine, Sodium Lauroamphoacetate, Sodium Hydroxymethylglycinate, Panthenol, Chamomilla Recutita (Chamomile) Flower Extract, Glycerin, Sodium Chloride, Citric Acid, Sodium PCA, Sodium Lactate, Cymbopogon Flexuosus Oil (Lemongrass), Pogostemon Cablin (Patchouli) Oil, Arginine, Aspartic Acid, PCA, Glycine, Alanine, Serine, Valine, Proline, Threonine, Isoleucine, Phenylalanine, Ricinus Communis (Castor) Seed Oil, Aloe Barbadensis Leaf Powder, Guar Hydroxypropyltrimonium Chloride, Glycine, Alanine, Serine, Valine, Proline, Threonine, Isoleucine, Sodium Phytate, Disodium, Alcohol, Aminopropanol, Histidine, Phenylalanine, Limonene, Geraniol, Citronellol, Citral, Limonene',
  'Deep Hydrating Shampoo | Sulfate-Free | ECOVLUU',
  'Revitalize dry, damaged hair with our sulfate-free Deep Hydrating Shampoo. Enriched with aloe vera, keratin & botanical extracts for softer, healthier hair.'
), (
  'Conditioning Hair Mask',
  'conditioning-hair-mask',
  36.00,
  '/1.1.png',
  '["/1.1.png", "/23.png", "/IMG_7099.jpg"]'::jsonb,
  'Hair Mask For Damaged Hair-Concentrate – Suitable for Dry, Damaged Bleached hair. Indulge in luxurious Hydration with our Mask for Damaged Hair – Concentrate. This rich, creamy formula combines Keratin, Amino Acids, and Botanical Extracts to nourish, strengthen, and detangle dry hair. Perfect for restoring Softness, Reducing Frizz, and adding Volume.',
  'mask',
  'HR-MSK-FOR-DMG',
  '["Hair Mask", "Deep Conditioning", "Hair Repair", "Damaged Hair", "Weekly Treatment"]'::jsonb,
  '["Enhances moisture retention, smoothness, and detangling.", "Strengthens hair with hydrolyzed keratin and essential amino acids.", "Improves shine and leaves hair soft, bouncy, and full of life.", "For a cleaner beauty experience. FREE from Sulfates, Parabens, Silicones, Mineral Oil, Petroleum, Polysorbates, Phthalates, Triclosan, Phosphates, Ammonia, VOCs, Gluten, Non-GMO, DEA, MEA, TEA, recyclable packaging."]'::jsonb,
  'Massage into damp hair after shampooing. Rub between palms until creamy, then apply from mid-lengths to ends. Leave for 5-10 minutes and rinse thoroughly.',
  'Cetearyl Alcohol, Myristyl Alcohol, Sorbitol, Polyquaternium-116, Dicaprylyl Carbonate, Behenamidopropyl Dimethylamine, Glycerin, Betaine, Quaternium-98, Erythritol, Pentaerythrityl Distearate, Guar Hydroxypropyltrimonium Chloride, Anhydroxylitol, Tocopherol, Potassium Sorbate, Salicylic Acid, Isoamyl Cocoate, Xylitol, Sodium PCA, Trisodium Dicarboxymethyl Alaninate, Sodium Lactate, Stearamidopropyl Dimethylamine, Hydrolyzed Keratin, Isoamyl Laurate, Butylene Glycol, PCA Glyceryl Oleate, Cetrimonium Chloride, Benzyl Alcohol, Valine, Proline, Threonine, Crambe Abyssinica Seed Oil, Sodium Benzoate, Xylitylglucoside, Helianthus Annuus Seed Oil, Arginine, Sorbic Acid, Aspartic Acid, PCA, Glycine, Alanine, Serine, Isoleucine, Histidine, Phenylalanine, Lactic Acid, Parfum, Rosmarinus Officinalis Leaf Extract.',
  'Conditioning Hair Mask | Damaged Hair Repair | ECOVLUU',
  'Repair dry, damaged hair with our luxurious conditioning hair mask. Formulated with keratin & amino acids to restore softness, reduce frizz & add volume.'
);