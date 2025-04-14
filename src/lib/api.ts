import { Product } from "@/context/CartContext";

// Mock data for products
const products: Product[] = [
  {
    id: 1,
    name: "Deep Hydrating Shampoo",
    price: 27,
    image: "/2.jpg",
    images: ["/2.jpg", "/IMG_7130.jpg", "/24.png"],
    description: "Deep Hydrating Shampoo – Revitalize your hair with our sulfate-free Deep Hydrating Shampoo, specially formulated to cleanse while maintaining moisture balance. Enriched with Aloe Vera, Keratin, and Botanical Extracts, this shampoo hydrates, softens and enhances volume for healthier, shinier hair. Ideal for Dry, Damaged, or Colour-Treated Hair.",
    category: "shampoo",
    sku: "DP-HYD-SHM",
    tags: ["Aloe Vera Shampoo", "Damaged Hair Repair", "Deep Hydrating Shampoo", "Healthy Hair Shampoo", "Hydrating Hair Care", "Keratin Shampoo"],
    benefits: [
      "Deeply hydrates and restores moisture with Glycerin, Sodium PCA, Niacinamide, Betaine.",
      "Boosts volume and shine without weighing hair down.",
      "Smooths frizz and leaves hair feeling soft and manageable.",
      "Formula free from sulfates, silicones, and parabens."
    ],
    usage: "Apply to wet hair, lather, and rinse thoroughly. For a richer lather, rub between palms before applying. Follow with EcoVoula Deep Conditioning Hair Mask for best results.",
    ingredients: "Aqua, Sodium Cocoyl Isethionate, Cocamidopropyl Betaine, Sodium Lauroamphoacetate, Sodium Hydroxymethylglycinate, Panthenol, Chamomilla Recutita (Chamomile) Flower Extract, Glycerin, Sodium Chloride, Citric Acid, Sodium PCA, Sodium Lactate, Cymbopogon Flexuosus Oil (Lemongrass), Pogostemon Cablin (Patchouli) Oil, Arginine, Aspartic Acid, PCA, Glycine, Alanine, Serine, Valine, Proline, Threonine, Isoleucine, Phenylalanine, Ricinus Communis (Castor) Seed Oil, Aloe Barbadensis Leaf Powder, Guar Hydroxypropyltrimonium Chloride, Glycine, Alanine, Serine, Valine, Proline, Threonine, Isoleucine, Sodium Phytate, Disodium, Alcohol, Aminopropanol, Histidine, Phenylalanine, Limonene, Geraniol, Citronellol, Citral, Limonene",
    metaTitle: "Deep Hydrating Shampoo | Sulfate-Free | ECOVLUU",
    metaDescription: "Revitalize dry, damaged hair with our sulfate-free Deep Hydrating Shampoo. Enriched with aloe vera, keratin & botanical extracts for softer, healthier hair.",
    slug: "deep-hydrating-shampoo"
  },
  {
    id: 2,
    name: "Conditioning Hair Mask",
    price: 36,
    image: "/1.jpg",
    images: ["/1.jpg", "/public/23.png", "/IMG_7099.jpg"],
    description: "Hair Mask For Damaged Hair Concentrate – Suitable for Dry, Damaged Bleached hair. Indulge in luxurious Hydration with our Mask for Damaged Hair – Concentrate. This rich, creamy formula combines Keratin, Amino Acids, and Botanical Extracts to nourish, strengthen, and detangle dry hair. Perfect for restoring Softness, Reducing Frizz, and adding Volume.",
    category: "mask",
    sku: "HR-MSK-FOR-DMG",
    tags: ["Hair Mask", "Deep Conditioning", "Hair Repair", "Damaged Hair", "Weekly Treatment"],
    benefits: [
      "Enhances moisture retention, smoothness, and detangling.",
      "Strengthens hair with hydrolyzed keratin and essential amino acids.",
      "Improves shine and leaves hair soft, bouncy, and full of life.",
      "For a cleaner beauty experience. FREE from Sulfates, Parabens, Silicones, Mineral Oil, Petroleum, Polysorbates, Phthalates, Triclosan, Phosphates, Ammonia, VOCs, Gluten, Non-GMO, DEA, MEA, TEA, recyclable packaging."
    ],
    usage: "Massage into damp hair after shampooing. Rub between palms until creamy, then apply from mid-lengths to ends. Leave for 5-10 minutes and rinse thoroughly.",
    ingredients: "Cetearyl Alcohol, Myristyl Alcohol, Sorbitol, Polyquaternium-116, Dicaprylyl Carbonate, Behenamidopropyl Dimethylamine, Glycerin, Betaine, Quaternium-98, Erythritol, Pentaerythrityl Distearate, Guar Hydroxypropyltrimonium Chloride, Anhydroxylitol, Tocopherol, Potassium Sorbate, Salicylic Acid, Isoamyl Cocoate, Xylitol, Sodium PCA, Trisodium Dicarboxymethyl Alaninate, Sodium Lactate, Stearamidopropyl Dimethylamine, Hydrolyzed Keratin, Isoamyl Laurate, Butylene Glycol, PCA Glyceryl Oleate, Cetrimonium Chloride, Benzyl Alcohol, Valine, Proline, Threonine, Crambe Abyssinica Seed Oil, Sodium Benzoate, Xylitylglucoside, Helianthus Annuus Seed Oil, Arginine, Sorbic Acid, Aspartic Acid, PCA, Glycine, Alanine, Serine, Isoleucine, Histidine, Phenylalanine, Lactic Acid, Parfum, Rosmarinus Officinalis Leaf Extract.",
    metaTitle: "Conditioning Hair Mask | Damaged Hair Repair | ECOVLUU",
    metaDescription: "Repair dry, damaged hair with our luxurious conditioning hair mask. Formulated with keratin & amino acids to restore softness, reduce frizz & add volume.",
    slug: "conditioning-hair-mask"
  }
  
];

// Simulate API calls with a short delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  await delay(800); // Simulate network delay
  return [...products];
};

// Get featured products (first 3 for demo)
export const getFeaturedProducts = async (): Promise<Product[]> => {
  await delay(600);
  return products.slice(0, 3);
};

// Get a single product by ID
export const getProductById = async (id: number): Promise<Product | null> => {
  await delay(500);
  const product = products.find(p => p.id === id);
  return product || null;
};

// Get related products by category
export const getRelatedProducts = async (category: string): Promise<Product[]> => {
  await delay(700);
  return products.filter(p => p.category === category);
};
