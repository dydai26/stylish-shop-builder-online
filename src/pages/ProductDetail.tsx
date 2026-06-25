import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { StarRating } from "@/components/ui/StarRating";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Play, ChevronLeft, ChevronRight, ZoomIn, MapPin, CheckCircle2, XCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/ui/ProductCard";

import { useCart, Product } from "@/context/CartContext";
import { getProductBySlug, getRelatedProducts } from "@/lib/api";
import { useTikTokTracking } from "@/hooks/useTikTokTracking";
import { useMetaTracking } from "@/hooks/useMetaTracking";
import { useGoogleTracking } from "@/hooks/useGoogleTracking";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [quantity, setQuantity] = useState(1);
  const [activeEducationTab, setActiveEducationTab] = useState("Hydration");
  const [activeResultTab, setActiveResultTab] = useState("Dry Hair");
  const [activeReviewFilter, setActiveReviewFilter] = useState("All (3)");
  const [activeMedia, setActiveMedia] = useState(0);
  const [isZoomDialogOpen, setIsZoomDialogOpen] = useState(false);
  const [pincode, setPincode] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState<"idle" | "checking" | "available" | "unavailable">("idle");
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const { trackViewContent, trackAddToCart } = useTikTokTracking();
  const { trackViewContent: trackMetaViewContent } = useMetaTracking();
  const { trackViewItem: trackGoogleViewItem } = useGoogleTracking();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!slug) return;

      setLoading(true);
      try {
        const productData = await getProductBySlug(slug);
        setProduct(productData);
        setActiveMedia(0);

        // Track product view
        if (productData) {
          trackViewContent({
            id: productData.id.toString(),
            name: productData.name,
            price: productData.price
          });
          
          trackMetaViewContent({
            id: productData.id.toString(),
            name: productData.name,
            price: productData.price
          });

          trackGoogleViewItem({
            id: productData.id.toString(),
            name: productData.name,
            price: productData.price,
            category: productData.category
          });

          const related = await getRelatedProducts(productData.category);
          setRelatedProducts(related.filter(p => p.id !== productData.id).slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
    setQuantity(1);
  }, [slug]);

  const handleDecreaseQuantity = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleIncreaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);

      trackAddToCart({
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        quantity: quantity
      });

      toast({
        title: "Added to cart",
        description: `${quantity} × ${product.name} added to your cart`,
      });
    }
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode.trim()) return;
    setDeliveryStatus("checking");
    setTimeout(() => {
      if (pincode.length >= 4) {
        setDeliveryStatus("available");
      } else {
        setDeliveryStatus("unavailable");
      }
    }, 800);
  };

  const getAllImages = (): string[] => {
    if (!product) return [];
    const images = [product.image];
    if (product.images && Array.isArray(product.images)) {
      images.push(...product.images);
    }
    return images.filter(Boolean);
  };

  // Generate Product JSON-LD structured data for Google Merchant Center
  const generateProductJsonLd = () => {
    if (!product) return null;

    const allImages = getAllImages();
    const productUrl = `https://ecovluu.com/product/${product.slug}`;

    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "description": product.description || `${product.name} - Premium hair care product from ECOVLUU`,
      "image": allImages.length > 0 ? allImages : [product.image],
      "sku": product.sku || `ECOVLUU-${product.id}`,
      "brand": {
        "@type": "Brand",
        "name": "ECOVLUU"
      },
      "category": product.category,
      "url": productUrl,
      "offers": {
        "@type": "Offer",
        "url": productUrl,
        "priceCurrency": "EUR",
        "price": product.price.toFixed(2),
        "availability": product.status === 'inactive' ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": "ECOVLUU"
        }
      }
    };
  };

  // --- CONTENT MAPPING FOR TABS (Hardcoded examples as requested for now) ---
  const FALLBACK_EDUCATION_CONTENT: Record<string, { title: string, text1: string, text2: string, fact: string }> = {
    "Hydration": {
      title: "Why Hair Hydration Matters",
      text1: "Hair is approximately 95% protein — but without adequate moisture, even healthy protein bonds can become brittle and prone to breakage. Dry hair has a disrupted cuticle layer that allows moisture to escape and makes hair look dull, feel rough, and tangle easily.",
      text2: "True hydration isn't just about surface coating — it requires ingredients that penetrate the cortex and bind water molecules within the shaft. Ecovluu's Deep Hydrating Shampoo uses humectants like Sodium Lactate and Panthenol alongside Sodium Lauroamphoacetate to cleanse and replenish simultaneously, ensuring hair never loses more than it gains from each wash.",
      fact: "Hair can absorb up to 30% of its own weight in water. When it can't retain moisture, it becomes brittle — not just dry."
    },
    "Scalp Health": {
      title: "The Foundation of Great Hair",
      text1: "A healthy scalp is essential for healthy hair growth. Irritation, flakiness, and excess oil can clog follicles and impede the natural growth cycle.",
      text2: "By using gentle, non-stripping cleansers and soothing botanicals like Chamomile, you maintain the scalp's delicate microbiome. This creates the optimal environment for strong, resilient hair from root to tip.",
      fact: "Your scalp ages 6 times faster than the skin on your face, making proper care absolutely critical."
    },
    "Heat & Damage": {
      title: "Protecting Against Daily Stress",
      text1: "Constant styling, UV exposure, and environmental pollutants constantly break down hair's protective barriers.",
      text2: "Our hydrating formula helps repair this barrier by infusing moisture back into the hair cuticle, acting as a buffer against future damage and restoring natural elasticity.",
      fact: "Hair loses elasticity when damaged. Healthy, hydrated hair can stretch up to 30% of its length without breaking."
    },
    "Nutrition": {
      title: "Feeding Your Hair from the Outside In",
      text1: "While diet is important, topical nutrition directly benefits the hair shaft and scalp.",
      text2: "Ingredients like Aloe Vera deliver essential vitamins (A, C, and E) directly to where they are needed most, promoting cellular turnover and healthy hair growth.",
      fact: "Aloe Vera contains 75 potentially active constituents: vitamins, enzymes, minerals, sugars, and amino acids."
    },
    "Stress & Lifestyle": {
      title: "Managing Modern Hair Challenges",
      text1: "Stress hormones can directly impact the hair follicle, pushing it into a resting phase that causes shedding and dullness.",
      text2: "A soothing wash routine not only cleanses but acts as a daily ritual to reduce tension. Aromatherapy benefits from Lemongrass oil help calm both the scalp and the mind.",
      fact: "Massage during washing increases blood flow to the scalp by up to 20%, bringing more nutrients to the hair follicles."
    }
  };

  const FALLBACK_RESULTS_CONTENT: Record<string, { percent1: string, desc1: string, percent2: string, desc2: string }> = {
    "Dry Hair": {
      percent1: "92%", desc1: "reported softer, smoother hair after first wash",
      percent2: "88%", desc2: "noticed reduced scalp irritation within one week",
    },
    "Sensitive Scalp": {
      percent1: "95%", desc1: "experienced no itching or redness after use",
      percent2: "90%", desc2: "felt their scalp was deeply calmed and balanced",
    },
    "Fine Hair": {
      percent1: "89%", desc1: "said hair felt hydrated without being weighed down",
      percent2: "85%", desc2: "noticed improved volume and bounce",
    },
    "Curly Hair": {
      percent1: "94%", desc1: "saw more defined, frizz-free curls",
      percent2: "91%", desc2: "reported significantly less breakage when detangling",
    }
  };

  const reviewFilters = ["All (3)", "Dry Hair", "Fine Hair", "Oily Scalp", "Sensitive Scalp", "With Photos"];

  const educationContent = product?.educationContent && Object.keys(product.educationContent).length > 0 
    ? product.educationContent 
    : (FALLBACK_EDUCATION_CONTENT as any);
    
  const resultsContent = product?.clinicalResults && Object.keys(product.clinicalResults).length > 0 
    ? product.clinicalResults 
    : (FALLBACK_RESULTS_CONTENT as any);
    
  const faqContent = product?.faqs && product.faqs.length > 0 
    ? product.faqs 
    : [
      { question: "IS THIS SUITABLE FOR SENSITIVE SKIN/HAIR?", answer: "Yes, all our formulas are designed to be gentle and effective." },
      { question: "HOW OFTEN SHOULD I USE THIS PRODUCT?", answer: "For best results, use 2-3 times a week." },
      { question: "WHAT'S THE DIFFERENCE BETWEEN THIS AND A REGULAR DRUGSTORE PRODUCT?", answer: "We use high quality natural ingredients without harsh chemicals." },
      { question: "IS ECOVLUU CRUELTY-FREE AND VEGAN?", answer: "Yes, all our products are cruelty-free and vegan." }
    ];
    
  const ugcContent = product?.ugcVideos && product.ugcVideos.length > 0
    ? product.ugcVideos
    : [
      { quote: "\"Literally the only product that does not irritate my skin.\"", author: "@hanan · Verified Buyer" },
      { quote: "\"This product is so soothing. Please make a larger size of it.\"", author: "@elizabeth · Verified Buyer" },
      { quote: "\"My skin has never felt this good. I've tried so many but nothing compares.\"", author: "@brooke_c · Verified Buyer" }
    ];

  if (loading) {
    return (
      <Layout>
        <div className="container-custom py-4 sm:py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-12">
            <div className="space-y-3 sm:space-y-4">
              <div className="aspect-[4/5] sm:aspect-square bg-gray-200 animate-pulse rounded-2xl" />
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-20 h-20 bg-gray-200 animate-pulse rounded-xl" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
              <div className="h-10 w-3/4 bg-gray-200 animate-pulse rounded" />
              <div className="h-6 w-1/4 bg-gray-200 animate-pulse rounded" />
              <div className="h-24 w-full bg-gray-200 animate-pulse rounded" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <Helmet>
          <title>Product Not Found - ECOVLUU</title>
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <div className="container-custom py-4 sm:py-8 lg:py-12 text-center">
          <h1 className="text-2xl font-bold text-brand-brown">Product Not Found</h1>
          <p className="text-gray-600 mt-4">The product you are looking for does not exist.</p>
          <Link to="/shop" className="text-brand-orange hover:underline mt-4 inline-block font-medium">
            Back to Shop
          </Link>
        </div>
      </Layout>
    );
  }

  const allImages = getAllImages();
  const mediaItems = allImages.map(img => ({ type: 'image' as const, url: img })); // Simplified to images only, easily adaptable if backend supports video later
  
  const productJsonLd = generateProductJsonLd();
  const isInactive = product.status === 'inactive';

  const handlePrevMedia = () => {
    setActiveMedia((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
  };

  const handleNextMedia = () => {
    setActiveMedia((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
  };

  return (
    <Layout>
    {productJsonLd && (
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(productJsonLd)}
        </script>
      </Helmet>
    )}
    
    <div className="w-full bg-background animate-fade-in font-sans text-foreground">
      <Helmet>
        <title>{product.name} - ECOVLUU</title>
        {product.metaDescription && <meta name="description" content={product.metaDescription} />}
      </Helmet>

      <div className="container-custom py-4 sm:py-8 lg:py-12">
        {/* Breadcrumbs */}
        <nav className="flex mb-4 sm:mb-8 overflow-x-auto text-xs sm:text-sm scrollbar-hide" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-2 whitespace-nowrap">
            <li><Link to="/" className="text-gray-500 hover:text-brand-orange transition-colors">Home</Link></li>
            <li><span className="mx-1 sm:mx-2 text-gray-400">/</span></li>
            <li><Link to="/shop" className="text-gray-500 hover:text-brand-orange transition-colors">Shop</Link></li>
            <li><span className="mx-1 sm:mx-2 text-gray-400">/</span></li>
            <li className="text-brand-brown font-medium">{product.name}</li>
          </ol>
        </nav>

        {/* HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16 lg:mb-24 items-start relative">
          {/* Images Area (Left) */}
          <div className="space-y-4 lg:sticky lg:top-24 h-fit">
            <div className="w-full aspect-[4/5] sm:aspect-square bg-[#F7F3EE] rounded-2xl flex items-center justify-center mb-4 sm:mb-6 border-2 border-brand-orange/20 relative overflow-hidden group">
              {mediaItems.length > 0 && (
                <>
                  <img 
                    src={mediaItems[activeMedia]?.url} 
                    alt={`${product.name} - View ${activeMedia + 1}`}
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer ${isInactive ? 'grayscale opacity-75' : ''}`}
                    onClick={() => setIsZoomDialogOpen(true)}
                  />
                  <button 
                    onClick={() => setIsZoomDialogOpen(true)}
                    className="absolute bottom-4 right-4 bg-white/80 backdrop-blur p-2 rounded-full shadow-sm text-brand-brown hover:text-brand-orange transition-colors z-10 hidden sm:flex"
                  >
                    <ZoomIn size={20} />
                  </button>
                </>
              )}
              
              {/* Mobile Slider Controls */}
              {mediaItems.length > 1 && (
                <>
                  <button 
                    onClick={handlePrevMedia}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur p-2 rounded-full shadow-sm text-brand-brown hover:text-brand-orange transition-colors z-10 sm:hidden"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={handleNextMedia}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur p-2 rounded-full shadow-sm text-brand-brown hover:text-brand-orange transition-colors z-10 sm:hidden"
                  >
                    <ChevronRight size={20} />
                  </button>

                  {/* Mobile Dots */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 sm:hidden bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                    {mediaItems.map((_, idx) => (
                      <div 
                        key={idx} 
                        className={`w-1.5 h-1.5 rounded-full transition-all ${activeMedia === idx ? 'bg-white scale-125' : 'bg-white/50'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            
            {/* Thumbnails */}
            {mediaItems.length > 1 && (
              <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {mediaItems.map((item, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveMedia(idx)}
                    className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl flex-shrink-0 overflow-hidden bg-[#F7F3EE] border-2 transition-all ${activeMedia === idx ? 'border-brand-orange shadow-md' : 'border-transparent hover:border-brand-orange/50'} ${isInactive ? 'grayscale opacity-75' : ''}`}
                  >
                    <img src={item.url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Zoom Dialog Modal */}
            <Dialog open={isZoomDialogOpen} onOpenChange={setIsZoomDialogOpen}>
              <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-4 flex flex-col bg-white border-none shadow-2xl rounded-xl">
                 <DialogHeader className="flex justify-between items-center border-b pb-2">
                   <DialogTitle className="text-xl text-brand-brown">Zoom Image</DialogTitle>
                 </DialogHeader>
                 <div className="relative flex-1 overflow-auto bg-[#F7F3EE] rounded-lg mt-2 flex items-center justify-center cursor-zoom-in">
                   {mediaItems[activeMedia]?.url && (
                     <img 
                       src={mediaItems[activeMedia].url} 
                       alt="Zoomed Product" 
                       className={`max-w-none h-full w-full object-contain hover:scale-150 transition-transform duration-300 origin-center ${isInactive ? 'grayscale opacity-75' : ''}`}
                     />
                   )}
                 </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Product Info Area (Right) */}
          <div className="flex flex-col items-start text-left pt-2 sm:pt-4">
            <div className="text-brand-orange font-semibold text-xs sm:text-sm uppercase tracking-widest mb-2 sm:mb-3">
              {product.category} PRODUCTS
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-brown mb-2 sm:mb-3 text-left">
              {product.name}
            </h1>
            
            {product.sku && (
              <p className="text-gray-500 mb-4 sm:mb-5 text-sm sm:text-base text-left">
                SKU: {product.sku}
              </p>
            )}

            <div className="mb-4 sm:mb-6 w-full flex justify-start">
              <StarRating rating={5} totalReviews={68} />
            </div>

            <div className="text-2xl sm:text-3xl font-bold text-brand-orange mb-6 sm:mb-8 flex items-center gap-4 text-left w-full">
              €{product.price.toFixed(2)}
              {isInactive && (
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wider">
                  OUT OF STOCK
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 w-full">
              <div className="flex items-center border-2 border-gray-200 rounded-md h-12 sm:h-14 w-full sm:w-32 justify-between bg-white">
                <button
                  onClick={handleDecreaseQuantity}
                  className="px-4 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="font-semibold text-base">{quantity}</span>
                <button
                  onClick={handleIncreaseQuantity}
                  className="px-4 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              <Button 
                onClick={handleAddToCart}
                disabled={isInactive}
                className={`h-12 sm:h-14 flex-1 text-sm sm:text-base font-semibold tracking-wide uppercase ${isInactive ? 'bg-gray-400 cursor-not-allowed' : 'btn-primary'}`}
              >
                {isInactive ? 'OUT OF STOCK' : 'ADD TO CART'}
              </Button>
            </div>

            {/* Delivery Pincode Checker */}
            <div className="w-full mb-8 bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-5">
              <div className="flex items-center gap-2 text-brand-brown font-semibold mb-3">
                <MapPin size={18} className="text-brand-orange" />
                Check Delivery Availability
              </div>
              <form onSubmit={handleCheckPincode} className="flex gap-2 relative">
                <Input 
                  placeholder="Enter Pincode / Zipcode" 
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="bg-white"
                  maxLength={10}
                />
                <Button type="submit" variant="outline" className="shrink-0 border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white" disabled={deliveryStatus === 'checking'}>
                  {deliveryStatus === 'checking' ? 'Checking...' : 'Check'}
                </Button>
              </form>
              {deliveryStatus === 'available' && (
                <div className="flex items-center gap-2 mt-3 text-sm text-green-600 bg-green-50 p-2 rounded-md border border-green-100">
                  <CheckCircle2 size={16} /> Delivery is available for {pincode}.
                </div>
              )}
              {deliveryStatus === 'unavailable' && (
                <div className="flex items-center gap-2 mt-3 text-sm text-red-600 bg-red-50 p-2 rounded-md border border-red-100">
                  <XCircle size={16} /> Delivery is not available for {pincode}.
                </div>
              )}
            </div>

            {/* Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 mb-8 border-b border-gray-200 pb-8 w-full justify-start">
              {product.tags && product.tags.slice(0, 4).map((tag, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm font-medium text-brand-brown">
                  <span className="text-lg text-green-500">✔</span> {tag}
                </div>
              ))}
              {(!product.tags || product.tags.length === 0) && (
                <>
                  <div className="flex items-center gap-2 text-sm font-medium text-brand-brown">
                    <span className="text-lg text-green-500">✔</span> Premium Quality
                  </div>
                </>
              )}
            </div>

            {/* ACCORDION INFO SECTION */}
            <Accordion type="single" collapsible className="w-full">
              {product.description && (
                <AccordionItem value="description" className="border-b-gray-200">
                  <AccordionTrigger className="text-sm font-bold text-brand-brown hover:text-brand-orange py-4 text-left">
                    DESCRIPTION
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed text-sm pb-4">
                    {product.description}
                  </AccordionContent>
                </AccordionItem>
              )}
              
              {product.benefits && product.benefits.length > 0 && (
                <AccordionItem value="benefits" className="border-b-gray-200">
                  <AccordionTrigger className="text-sm font-bold text-brand-brown hover:text-brand-orange py-4 text-left">
                    KEY BENEFITS
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed text-sm pb-4">
                    <ul className="list-disc pl-5 space-y-1">
                      {product.benefits.map((benefit, idx) => (
                        <li key={idx}>{benefit}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              )}

              {product.usage && (
                <AccordionItem value="how" className="border-b-gray-200">
                  <AccordionTrigger className="text-sm font-bold text-brand-brown hover:text-brand-orange py-4 text-left">
                    HOW TO USE
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed text-sm pb-4">
                    {product.usage}
                  </AccordionContent>
                </AccordionItem>
              )}
              
              {product.ingredients && (
                <AccordionItem value="ingredients" className="border-b-gray-200">
                  <AccordionTrigger className="text-sm font-bold text-brand-brown hover:text-brand-orange py-4 text-left">
                    INGREDIENTS
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed text-sm pb-4">
                    {product.ingredients}
                  </AccordionContent>
                </AccordionItem>
              )}

              <AccordionItem value="shipping" className="border-b-gray-200">
                <AccordionTrigger className="text-sm font-bold text-brand-brown hover:text-brand-orange py-4 text-left">
                  SHIPPING & RETURNS
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed text-sm pb-4">
                  Free shipping on orders over €50. 30-day money-back guarantee.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4 text-xs sm:text-sm text-amber-800 flex items-start gap-3 w-full">
              <span className="text-xl flex-shrink-0">⚠️</span>
              <div>
                <strong className="font-semibold block mb-1">Patch Test Recommended:</strong> 
                Before first use, apply a small amount to a discreet area and wait 24 hours to check for any adverse reactions.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WHAT'S INSIDE SECTION */}
      <section className="py-12 sm:py-16 bg-brand-beige/20 border-t border-gray-200">
        <div className="container-custom">
          <div className="mb-8 sm:mb-10 text-center sm:text-left border-b border-gray-200 pb-4">
            <h2 className="text-brand-orange font-semibold tracking-widest text-xs sm:text-sm mb-2 uppercase">What's Inside</h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-brand-brown mb-2">Key Ingredients</h3>
            <p className="text-gray-500 text-sm sm:text-base">Every ingredient chosen for a reason. Click to learn what it does.</p>
          </div>
          
          <Accordion type="single" collapsible defaultValue="ingredient-1" className="w-full">
            <AccordionItem value="ingredient-1" className="border-b-gray-200">
              <AccordionTrigger className="text-sm font-bold text-brand-brown hover:text-brand-orange py-4 sm:py-5 text-left">
                SODIUM COCOYL ISETHIONATE
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-brand-beige rounded-full flex items-center justify-center text-3xl sm:text-4xl flex-shrink-0 shadow-sm border border-gray-200">
                    🥥
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-brand-brown mb-2">Coconut-Derived Cleanser</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      A mild, skin-friendly surfactant derived from coconut oil. It cleanses effectively without stripping the scalp's natural oils.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="ingredient-2" className="border-b-gray-200">
              <AccordionTrigger className="text-sm font-bold text-brand-brown hover:text-brand-orange py-4 sm:py-5 text-left">
                PANTHENOL (PRO-VITAMIN B5)
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-sm text-gray-600">
                A highly effective humectant that penetrates the hair shaft to deeply moisturize and improve elasticity.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="ingredient-3" className="border-b-gray-200">
              <AccordionTrigger className="text-sm font-bold text-brand-brown hover:text-brand-orange py-4 sm:py-5 text-left">
                CHAMOMILE FLOWER EXTRACT
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-sm text-gray-600">
                Soothes the scalp and provides anti-inflammatory properties, ideal for sensitive skin.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="ingredient-4" className="border-b-gray-200">
              <AccordionTrigger className="text-sm font-bold text-brand-brown hover:text-brand-orange py-4 sm:py-5 text-left">
                LEMONGRASS OIL
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-sm text-gray-600">
                Adds a refreshing scent and has antimicrobial properties for a healthy scalp environment.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="ingredient-5" className="border-b-gray-200">
              <AccordionTrigger className="text-sm font-bold text-brand-brown hover:text-brand-orange py-4 sm:py-5 text-left">
                ALOE BARBADENSIS (ALOE VERA) LEAF POWDER
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-sm text-gray-600">
                Rich in vitamins and minerals, aloe vera intensely hydrates and conditions the hair.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CLINICAL RESULTS SECTION */}
      <section className="py-12 sm:py-16 lg:py-24 bg-brand-brown text-brand-beige">
        <div className="container-custom">
          <div className="mb-8 sm:mb-10 text-center sm:text-left border-b border-brand-beige/20 pb-4">
            <h2 className="text-brand-orange font-semibold tracking-widest text-xs sm:text-sm mb-2 uppercase">Clinical Results</h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-white">Results You Can See</h3>
          </div>

          <div className="flex overflow-x-auto gap-2 sm:gap-4 mb-8 pb-2 scrollbar-hide">
            {Object.keys(resultsContent).map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveResultTab(tab)}
                className={`px-4 py-2 rounded-md font-medium text-sm transition-colors whitespace-nowrap ${
                  activeResultTab === tab ? 'bg-brand-orange text-white' : 'bg-white/10 hover:bg-white/20 text-brand-beige'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20">
            {/* Before / After Images */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <div className="aspect-[3/4] bg-black/20 rounded-lg flex items-center justify-center text-brand-beige border border-white/10 shadow-inner p-4 relative overflow-hidden">
                 {resultsContent[activeResultTab]?.beforeImage ? (
                   <>
                     <img src={resultsContent[activeResultTab].beforeImage} alt="Before" className="absolute inset-0 w-full h-full object-cover" />
                     <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                       <span className="font-semibold tracking-widest uppercase text-xs sm:text-sm text-white">Before</span>
                     </div>
                   </>
                 ) : (
                   <div className="text-center">
                     <span className="text-4xl sm:text-5xl mb-2 sm:mb-3 block">🙁</span>
                     <span className="font-semibold tracking-widest uppercase text-xs sm:text-sm">Before</span>
                   </div>
                 )}
              </div>
              <div className="aspect-[3/4] bg-black/20 rounded-lg flex items-center justify-center text-brand-beige border border-white/10 shadow-inner p-4 relative overflow-hidden">
                 {resultsContent[activeResultTab]?.afterImage ? (
                   <>
                     <img src={resultsContent[activeResultTab].afterImage} alt="After" className="absolute inset-0 w-full h-full object-cover" />
                     <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                       <span className="font-semibold tracking-widest uppercase text-xs sm:text-sm text-white">After</span>
                     </div>
                   </>
                 ) : (
                   <div className="text-center">
                     <span className="text-4xl sm:text-5xl mb-2 sm:mb-3 block">😊</span>
                     <span className="font-semibold tracking-widest uppercase text-xs sm:text-sm">After</span>
                   </div>
                 )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-col justify-center space-y-6 sm:space-y-10 animate-fade-in" key={activeResultTab}>
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-brand-orange mb-6 sm:mb-8">What Customers Noticed ({activeResultTab})</h4>
                
                <div className="space-y-6 sm:space-y-8">
                  <div className="flex gap-4 sm:gap-6 items-center">
                    <span className="text-4xl sm:text-5xl font-bold text-white w-20 sm:w-24 shrink-0">{resultsContent[activeResultTab].percent1}</span>
                    <span className="text-sm sm:text-base text-brand-beige">{resultsContent[activeResultTab].desc1}</span>
                  </div>
                  <div className="flex gap-4 sm:gap-6 items-center">
                    <span className="text-4xl sm:text-5xl font-bold text-white w-20 sm:w-24 shrink-0">{resultsContent[activeResultTab].percent2}</span>
                    <span className="text-sm sm:text-base text-brand-beige">{resultsContent[activeResultTab].desc2}</span>
                  </div>
                  <div className="flex gap-4 sm:gap-6 items-center">
                    <span className="text-4xl sm:text-5xl font-bold text-white w-20 sm:w-24 shrink-0">100%</span>
                    <span className="text-sm sm:text-base text-brand-beige">would recommend to someone with {activeResultTab.toLowerCase()}</span>
                  </div>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-brand-beige/50 pt-4 sm:pt-6 border-t border-brand-beige/10">Based on customer survey of 68 verified purchasers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* EDUCATION SECTION */}
      <section className="py-12 sm:py-16 lg:py-24 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-4">
               <h2 className="text-brand-orange font-semibold tracking-widest text-xs sm:text-sm mb-2 sm:mb-3 uppercase">Education</h2>
               <h3 className="text-2xl sm:text-3xl font-bold text-brand-brown mb-6 sm:mb-8 lg:pr-4">
                 Addressing Hair & Scalp Health at the Root
               </h3>
               
               <div className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
                 {Object.keys(educationContent).map(tab => {
                   const iconMap: Record<string, string> = {
                     "Hydration": "💧", "Scalp Health": "🧬", "Heat & Damage": "🔥", "Nutrition": "🥗", "Stress & Lifestyle": "🧘"
                   };
                   return (
                     <button
                       key={tab}
                       onClick={() => setActiveEducationTab(tab)}
                       className={`flex items-center gap-2 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-lg transition-colors text-left flex-shrink-0 ${
                         activeEducationTab === tab 
                           ? "bg-brand-orange text-white shadow-md" 
                           : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                       }`}
                     >
                       <span className="text-lg sm:text-xl">{iconMap[tab]}</span>
                       {tab}
                     </button>
                   );
                 })}
               </div>
            </div>
            
            <div className="lg:col-span-8 lg:pl-12 flex flex-col justify-center animate-fade-in" key={activeEducationTab}>
               <h4 className="text-xl sm:text-2xl font-bold text-brand-brown mb-4 sm:mb-6">{educationContent[activeEducationTab].title}</h4>
               <div className="text-gray-600 text-sm sm:text-base leading-relaxed space-y-4 mb-6 sm:mb-8">
                 <p>{educationContent[activeEducationTab].text1}</p>
                 <p>{educationContent[activeEducationTab].text2}</p>
               </div>
               
               <div className="bg-brand-beige/30 border-l-4 border-brand-orange p-4 sm:p-6 flex flex-col sm:flex-row gap-3 sm:gap-4 items-start rounded-r-lg">
                 <span className="text-2xl sm:text-3xl sm:mt-1">💡</span>
                 <div>
                   <strong className="text-base sm:text-lg text-brand-brown block mb-1 sm:mb-2">Did you know?</strong>
                   <p className="text-brand-brown/80 text-sm sm:text-base leading-relaxed">
                     {educationContent[activeEducationTab].fact}
                   </p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* UGC VIDEOS SECTION */}
      <section className="py-12 sm:py-16 lg:py-24 bg-gray-50">
        <div className="container-custom">
          <div className="mb-8 sm:mb-12 text-center">
            <h2 className="text-brand-orange font-semibold tracking-widest text-xs sm:text-sm mb-2 uppercase">As Seen In Real Life</h2>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-brown mb-2 sm:mb-3">The Routine That Works</h3>
            <p className="text-gray-500 text-sm sm:text-base">Real customers, real results. No filters.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
            {ugcContent.map((ugc: any, i: number) => (
              <div key={i} className="flex flex-col bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="aspect-[9/16] bg-gray-100 relative mb-4 rounded-lg flex items-center justify-center group cursor-pointer overflow-hidden">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-brand-orange text-white rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                    <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-1 fill-current" />
                  </div>
                </div>
                <p className="text-sm sm:text-base text-brand-brown font-medium italic mb-3">
                  {ugc.quote}
                </p>
                <p className="text-xs sm:text-sm text-brand-orange font-semibold mt-auto">
                  {ugc.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-12 sm:py-16 lg:py-24 bg-white">
        <div className="container-custom max-w-3xl">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-brand-orange font-semibold tracking-widest text-xs sm:text-sm mb-2 sm:mb-3 uppercase">Support</h2>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-brown mb-3 sm:mb-4">Have questions? We've got answers.</h3>
            <p className="text-gray-500 text-sm sm:text-base">Your most common concerns, answered.</p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqContent.map((faq: any, i: number) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-b-gray-200">
                <AccordionTrigger className="text-xs sm:text-sm font-bold text-brand-brown hover:text-brand-orange py-4 sm:py-5 text-left leading-snug">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 text-sm sm:text-base leading-relaxed pb-4 sm:pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
      
      {/* REVIEWS SECTION */}
      <section className="py-12 sm:py-16 lg:py-24 bg-brand-beige/20 border-t border-gray-200">
        <div className="container-custom">
          <div className="mb-8 sm:mb-12">
             <h2 className="text-2xl sm:text-3xl font-bold text-brand-brown mb-2 text-center sm:text-left">Customer Reviews</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16">
            {/* Reviews Summary */}
            <div className="md:col-span-5 lg:col-span-4 bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center">
               <div className="text-5xl sm:text-6xl font-bold text-brand-brown mb-3 sm:mb-4">5.0</div>
               <div className="mb-3 sm:mb-4 scale-110 sm:scale-125 flex justify-center w-full">
                 <StarRating rating={5} showReviewsCount={false} />
               </div>
              <p className="text-gray-500 text-sm mb-4">Based on 3 reviews</p>
              <div className="text-brand-orange font-bold text-lg">
                100% recommend
              </div>
            </div>
            
            {/* Rating Bars */}
            <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-center gap-3 sm:gap-4">
               {[
                 { stars: 5, count: 3, percent: 100 },
                 { stars: 4, count: 0, percent: 0 },
                 { stars: 3, count: 0, percent: 0 },
                 { stars: 2, count: 0, percent: 0 },
                 { stars: 1, count: 0, percent: 0 }
               ].map((bar) => (
                 <div key={bar.stars} className="flex items-center gap-3 sm:gap-4 text-sm sm:text-base font-medium">
                   <div className="w-10 sm:w-12 text-brand-brown">{bar.stars} ★</div>
                   <div className="flex-1 h-2 sm:h-3 bg-gray-200 rounded-full overflow-hidden">
                     <div className="h-full bg-brand-orange rounded-full transition-all duration-500" style={{ width: `${bar.percent}%` }}></div>
                   </div>
                   <div className="w-8 sm:w-12 text-right text-gray-500">{bar.count}</div>
                 </div>
               ))}
               
               {/* Photo Reviews Gallery placeholder */}
               <div className="flex gap-3 sm:gap-4 mt-4 sm:mt-6 overflow-x-auto pb-2 scrollbar-hide">
                 {[1,2,3,4,5].map(i => (
                   <Dialog key={i}>
                     <DialogTrigger asChild>
                       <button className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-xl sm:text-2xl text-gray-400 cursor-pointer border-2 border-transparent hover:border-brand-orange transition-colors">
                         📸
                       </button>
                     </DialogTrigger>
                     <DialogContent className="sm:max-w-md flex flex-col items-center justify-center p-6">
                       <DialogHeader>
                         <DialogTitle>Customer Photo</DialogTitle>
                       </DialogHeader>
                       <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center mt-2 border border-gray-200 shadow-inner">
                         <span className="text-6xl text-gray-400">📸</span>
                       </div>
                       <p className="text-gray-500 mt-2 text-center text-sm">Review photo uploaded by customer.</p>
                     </DialogContent>
                   </Dialog>
                 ))}
               </div>
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-2 sm:gap-3 my-8 sm:my-10">
             {reviewFilters.map(f => (
               <button 
                 key={f} 
                 onClick={() => setActiveReviewFilter(f)}
                 className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm transition-colors shadow-sm ${
                   activeReviewFilter === f 
                    ? 'bg-brand-orange text-white font-semibold'
                    : 'bg-white border border-gray-300 text-gray-600 hover:border-brand-orange hover:text-brand-orange font-medium'
                 }`}
               >
                 {f}
               </button>
             ))}
          </div>
          
          {/* Review List */}
          <div className="space-y-4 sm:space-y-6">
            {[
              {
                name: "Hanan",
                verified: true,
                hairType: "Dry",
                scalpCondition: "Sensitive",
                date: "1 week ago",
                rating: 5,
                title: "5 Stars.",
                text: "Literally the only product that does not irritate my skin. I've been dealing with sensitivity for years and this is the first product that actually works without making things worse."
              },
              {
                name: "Elizabeth",
                verified: true,
                hairType: "Fine",
                scalpCondition: "Oily",
                date: "3 weeks ago",
                rating: 5,
                title: "Please make a larger size!",
                text: "This is soothing for my itchy skin. Please make a larger size of it. I go through it so quickly because I genuinely love using it every day. Worth every cent."
              },
              {
                name: "Brooke C.",
                verified: true,
                hairType: "Medium",
                scalpCondition: "Dry",
                date: "1 month ago",
                rating: 5,
                title: "I have never felt this good",
                text: "I switched from a well-known salon brand and I honestly can't believe the difference. It feels so much softer and calmer. I was skeptical but this changed everything."
              }
            ].map((review, idx) => (
              <div key={idx} className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
                  <div>
                    <h4 className="font-bold text-brand-brown text-base sm:text-lg flex items-center gap-2">
                      {review.name}
                      {review.verified && <span className="text-green-600 text-xs font-semibold bg-green-50 px-2 py-0.5 rounded-full">✓ Verified Buyer</span>}
                    </h4>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">{review.date}</div>
                    <StarRating rating={review.rating} showReviewsCount={false} />
                  </div>
                </div>
                <h5 className="font-bold text-brand-brown mb-2 text-sm sm:text-base">{review.title}</h5>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {review.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
              <DialogTrigger asChild>
                <button className="inline-block bg-white border-2 border-brand-orange text-brand-orange font-medium px-6 py-3 text-base rounded hover:bg-brand-orange hover:text-white transition-colors uppercase tracking-wide min-w-[200px]">
                  WRITE A REVIEW
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-brand-brown mb-2">Write a Review</DialogTitle>
                </DialogHeader>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    setIsReviewDialogOpen(false);
                    toast({
                      title: "Review Submitted",
                      description: "Thank you for your feedback! Your review will be published shortly.",
                    });
                  }}
                  className="space-y-4 pt-2"
                >
                  <div className="space-y-2">
                    <Label htmlFor="rating">Rating</Label>
                    <div className="flex gap-1 text-2xl cursor-pointer">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="text-brand-orange">★</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Your name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Your email" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Review Title</Label>
                    <Input id="title" placeholder="Summary of your experience" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="review">Review</Label>
                    <Textarea 
                      id="review" 
                      placeholder="Share your thoughts about this product..." 
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="photos" className="flex items-center gap-2">
                      <span className="text-lg">📸</span> Upload Photos (Optional)
                    </Label>
                    <Input id="photos" type="file" accept="image/*" multiple className="cursor-pointer file:text-brand-orange file:bg-brand-beige file:border-0 file:mr-4 file:py-1 file:px-4 file:rounded-md hover:file:bg-brand-orange/20" />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button type="submit" className="bg-brand-orange hover:bg-brand-orange/90 text-white px-8">
                      Submit Review
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-12 sm:py-16 bg-white border-t border-gray-200">
          <div className="container-custom">
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-brown mb-6 sm:mb-8 text-center sm:text-left">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id}>
                  <ProductCard product={relatedProduct} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      
    </div>
    </Layout>
  );
};

export default ProductDetail;