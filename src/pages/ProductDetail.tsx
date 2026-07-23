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
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/ui/ProductCard";

import { useCart, Product } from "@/context/CartContext";
import { useReviews } from "@/context/ReviewsContext";
import { getProductBySlug, getRelatedProducts } from "@/lib/api";
import { useTikTokTracking } from "@/hooks/useTikTokTracking";
import { useMetaTracking } from "@/hooks/useMetaTracking";
import { useGoogleTracking } from "@/hooks/useGoogleTracking";

import { KEY_INGREDIENTS_GLOSSARY, PRODUCT_CLAIMS, OVERRIDE_FAQS } from "@/data/productStaticData";
import { ProductIngredients } from "@/components/product/ProductIngredients";
import { ProductFAQ } from "@/components/product/ProductFAQ";
import { ProductReviewsSection } from "@/components/product/ProductReviewsSection";

const checkPincodeDelivery = (code: string): { available: boolean; country?: string } => {
  const clean = code.trim().replace(/[\s-]/g, '').toUpperCase();
  
  // 1. Ireland (IE) - 7 characters alphanumeric
  if (/^[A-Z0-9]{7}$/.test(clean)) {
    if (/^[A-Z][0-9A-Z]{2}[0-9A-Z]{4}$/.test(clean)) {
      return { available: true, country: "Ireland" };
    }
  }
  
  // 2. Netherlands (NL) - 4 digits + 2 letters
  if (/^\d{4}[A-Z]{2}$/.test(clean)) {
    return { available: true, country: "Netherlands" };
  }
  
  // 3. Portugal (PT) - 7 digits
  if (/^\d{7}$/.test(clean)) {
    return { available: true, country: "Portugal" };
  }
  
  // 4. Romania (RO) - 6 digits
  if (/^\d{6}$/.test(clean)) {
    return { available: true, country: "Romania" };
  }
  
  // 5. 5 digits - Germany, France, Spain, Italy, Finland, Poland, Greece, Sweden
  if (/^\d{5}$/.test(clean)) {
    return { available: true, country: "Europe (DE, FR, ES, IT, PL, FI, SE, GR)" };
  }
  
  // 6. 4 digits - Belgium, Switzerland, Austria, Denmark, Norway, Latvia
  if (/^\d{4}$/.test(clean)) {
    return { available: true, country: "Europe (BE, CH, AT, DK, NO, LV)" };
  }

  return { available: false };
};


const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [quantity, setQuantity] = useState(1);
  const renderHtmlContent = (text: string) => {
    if (!text) return { __html: "" };
    // If it doesn't look like HTML, convert newlines to <br />
    if (!/<[a-z][\s\S]*>/i.test(text)) {
      return { __html: text.replace(/\n/g, '<br />') };
    }
    return { __html: text };
  };
  const [activeEducationTab, setActiveEducationTab] = useState("Hydration");
  const [activeResultTab, setActiveResultTab] = useState("Dry Hair");
  const [activeMedia, setActiveMedia] = useState(0);
  const [isZoomDialogOpen, setIsZoomDialogOpen] = useState(false);
  const [pincode, setPincode] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState<"idle" | "checking" | "available" | "unavailable">("idle");
  const [detectedCountry, setDetectedCountry] = useState("");
  
  const { addToCart } = useCart();
  const { reviews } = useReviews();
  const productReviews = product 
    ? reviews.filter(r => r.product_id === product.id || r.product_id === null) 
    : [];

  const totalReviewsCount = productReviews.length;
  const averageRating = totalReviewsCount > 0
    ? Math.round((productReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviewsCount) * 10) / 10
    : 5.0;

  const { toast } = useToast();
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  
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

  // Real-time debounced pincode check
  useEffect(() => {
    const trimmed = pincode.trim();
    if (!trimmed) {
      setDeliveryStatus("idle");
      setDetectedCountry("");
      return;
    }

    setDeliveryStatus("checking");

    const timer = setTimeout(() => {
      const checkResult = checkPincodeDelivery(trimmed);
      if (checkResult.available) {
        setDeliveryStatus("available");
        setDetectedCountry(checkResult.country || "");
      } else {
        setDeliveryStatus("unavailable");
        setDetectedCountry("");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [pincode]);

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
    const trimmed = pincode.trim();
    if (!trimmed) return;
    setDeliveryStatus("checking");
    setTimeout(() => {
      const checkResult = checkPincodeDelivery(trimmed);
      if (checkResult.available) {
        setDeliveryStatus("available");
        setDetectedCountry(checkResult.country || "");
      } else {
        setDeliveryStatus("unavailable");
        setDetectedCountry("");
      }
    }, 200);
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

    if (product.slug === 'deep-hydrating-shampoo') {
      return {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": "https://www.ecovluu.com/product/deep-hydrating-shampoo/#product",
        "name": "Deep Hydrating Shampoo | Ecovluu",
        "alternateName": "Best Moisturising Shampoo",
        "description": "Ecovluu Deep Hydrating Shampoo is a professional-grade shampoo formulated to gently cleanse and hydrate dry or sensitive hair without disrupting its natural balance. It removes impurities while maintaining moisture, leaving hair soft, light, and comfortable from the first wash. Suitable for dry, sensitive, or stressed hair. Ideal for frequent use. Bottle size: 250 ml.",
        "url": "https://www.ecovluu.com/product/deep-hydrating-shampoo",
        "image": [
          "https://nivoluinisrgdincqau.supabase.co/storage/v1/object/public/product-images/products/1767734309542-5jv0h4.png"
        ],
        "sku": "DP-HYD-SHM",
        "mpn": "DP-HYD-SHM",
        "brand": {
          "@type": "Brand",
          "name": "Ecovluu"
        },
        "manufacturer": {
          "@type": "Organization",
          "@id": "https://www.ecovluu.com/#organization",
          "name": "Ecovluu"
        },
        "category": "Shampoo Products",
        "material": "Natural Ingredients",
        "weight": {
          "@type": "QuantitativeValue",
          "value": "250",
          "unitCode": "MLT"
        },
        "additionalProperty": [
          {
            "@type": "PropertyValue",
            "name": "Hair Type",
            "value": "Dry, Sensitive, Stressed, Damaged, Moisturize, Hydrating"
          },
          {
            "@type": "PropertyValue",
            "name": "Key Benefits",
            "value": "Gently cleanses without stripping natural oils, hydrates hair without weighing it down, helps maintain scalp comfort and balance, leaves hair soft, smooth and easy to manage, suitable for frequent use"
          },
          {
            "@type": "PropertyValue",
            "name": "Free From",
            "value": "SLS, SLES, Silicones, Parabens"
          },
          {
            "@type": "PropertyValue",
            "name": "Key Ingredients",
            "value": "Sodium Cocoyl Isethionate, Cocamidopropyl Betaine, Sodium Lauroamphoacetate, Sodium Hydroxymethylglycinate, Panthenol, Chamomilla Recutita (Chamomile) Flower Extract, Glycerin, Cymbopogon Flexuosus Oil (Lemongrass), Pogostemon Cablin (Patchouli) Oil, Ricinus Communis (Castor) Seed Oil, Aloe Barbadensis Leaf Powder"
          },
          {
            "@type": "PropertyValue",
            "name": "How to Use",
            "value": "Apply to wet hair, lather, and rinse thoroughly. For a richer lather, rub between palms before applying. Follow with Ecovluu Deep Conditioning Hair Mask for best results."
          },
          {
            "@type": "PropertyValue",
            "name": "Container Size",
            "value": "250 ml"
          }
        ],
        "offers": [
          {
            "@type": "Offer",
            "name": "Ireland Shipping",
            "url": "https://www.ecovluu.com/product/deep-hydrating-shampoo",
            "priceCurrency": "EUR",
            "price": product.price.toFixed(2),
            "availability": product.status === 'inactive' ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition",
            "seller": {
              "@type": "Organization",
              "@id": "https://www.ecovluu.com/#organization",
              "name": "Ecovluu"
            },
            "shippingDetails": {
              "@type": "OfferShippingDetails",
              "shippingDestination": {
                "@type": "DefinedRegion",
                "addressCountry": ["IE"]
              },
              "deliveryTime": {
                "@type": "ShippingDeliveryTime",
                "handlingTime": {
                  "@type": "QuantitativeValue",
                  "minValue": 1,
                  "maxValue": 2,
                  "unitCode": "DAY"
                },
                "transitTime": {
                  "@type": "QuantitativeValue",
                  "minValue": 2,
                  "maxValue": 5,
                  "unitCode": "DAY"
                }
              },
              "shippingRate": {
                "@type": "MonetaryAmount",
                "value": "12.05",
                "currency": "EUR"
              }
            },
            "hasMerchantReturnPolicy": {
              "@type": "MerchantReturnPolicy",
              "applicableCountry": ["IE"],
              "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
              "merchantReturnDays": 14,
              "returnMethod": "https://schema.org/ReturnByMail",
              "returnFees": "https://schema.org/FreeReturn",
              "merchantReturnLink": "https://www.ecovluu.com/returns"
            }
          },
          {
            "@type": "Offer",
            "name": "European Union Shipping",
            "url": "https://www.ecovluu.com/product/deep-hydrating-shampoo",
            "priceCurrency": "EUR",
            "price": product.price.toFixed(2),
            "availability": product.status === 'inactive' ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition",
            "seller": {
              "@type": "Organization",
              "@id": "https://www.ecovluu.com/#organization",
              "name": "Ecovluu"
            },
            "shippingDetails": {
              "@type": "OfferShippingDetails",
              "shippingDestination": {
                "@type": "DefinedRegion",
                "addressCountry": ["AT","BE","BG","CY","CZ","DE","DK","EE","FI","FR","GR","HU","IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE"]
              },
              "deliveryTime": {
                "@type": "ShippingDeliveryTime",
                "handlingTime": {
                  "@type": "QuantitativeValue",
                  "minValue": 1,
                  "maxValue": 2,
                  "unitCode": "DAY"
                },
                "transitTime": {
                  "@type": "QuantitativeValue",
                  "minValue": 5,
                  "maxValue": 10,
                  "unitCode": "DAY"
                }
              },
              "shippingRate": {
                "@type": "MonetaryAmount",
                "value": "23.12",
                "currency": "EUR"
              }
            },
            "hasMerchantReturnPolicy": {
              "@type": "MerchantReturnPolicy",
              "applicableCountry": ["AT","BE","BG","CY","CZ","DE","DK","EE","FI","FR","GR","HU","IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE"],
              "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
              "merchantReturnDays": 14,
              "returnMethod": "https://schema.org/ReturnByMail",
              "returnFees": "https://schema.org/FreeReturn",
              "merchantReturnLink": "https://www.ecovluu.com/returns"
            }
          }
        ]
      };
    } else if (product.slug === 'deep-conditioning-hair-mask') {
      return {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": "https://www.ecovluu.com/product/deep-conditioning-hair-mask/#product",
        "name": "Deep Conditioning Mask - Dry & Damaged Hair | Ecovluu",
        "alternateName": "Deep Conditioning Hair Mask",
        "description": "Ecovluu Deep Conditioning Hair Mask is a professional-grade, concentrated treatment designed for weekly use on dry, damaged and bleached hair. Its rich formula combines keratin, essential amino acids and botanical extracts to deeply nourish the hair fibre, improve manageability and enhance softness without weighing the hair down. Container size: 150 ml.",
        "url": "https://www.ecovluu.com/product/deep-conditioning-hair-mask",
        "image": [
          "https://inivoiunisrgdinrcquu.supabase.co/storage/v1/object/public/product-images/products/1767729847008-w8q4se.png"
        ],
        "sku": "HR-MSK-FOR-DMG",
        "mpn": "HR-MSK-FOR-DMG",
        "brand": {
          "@type": "Brand",
          "name": "Ecovluu"
        },
        "manufacturer": {
          "@type": "Organization",
          "@id": "https://www.ecovluu.com/#organization",
          "name": "Ecovluu"
        },
        "category": "Mask Products",
        "material": "Natural Ingredients",
        "weight": {
          "@type": "QuantitativeValue",
          "value": "150",
          "unitCode": "MLT"
        },
        "additionalProperty": [
          {
            "@type": "PropertyValue",
            "name": "Hair Type",
            "value": "Dry, Damaged, Bleached, Hydrating"
          },
          {
            "@type": "PropertyValue",
            "name": "Key Benefits",
            "value": "Deeply nourish and condition dry and damaged hair, improves softness, smoothness and detangling, helps strengthen hair with keratin and amino acids, enhances shine and manageability without heaviness"
          },
          {
            "@type": "PropertyValue",
            "name": "Free From",
            "value": "Sulfates, Parabens, Silicones, Mineral Oil, Petroleum, Polysorbates, Phthalates, Triclosan, Phosphates, Ammonia, VOCs, Gluten, Non-GMO, DEA, MEA, TEA"
          },
          {
            "@type": "PropertyValue",
            "name": "Key Ingredients",
            "value": "Keratin, Essential Amino Acids, Botanical Extracts, Hydrolyzed Keratin, Crambe Abyssinica Seed Oil, Helianthus Annuus Seed Oil"
          },
          {
            "@type": "PropertyValue",
            "name": "How to Use",
            "value": "Massage into damp hair after shampooing. Rub between palms until creamy, then apply from mid-lengths to ends. Leave for 5-10 minutes and rinse thoroughly."
          },
          {
            "@type": "PropertyValue",
            "name": "Container Size",
            "value": "150 ml"
          },
          {
            "@type": "PropertyValue",
            "name": "Packaging",
            "value": "Recyclable packaging"
          }
        ],
        "offers": [
          {
            "@type": "Offer",
            "name": "Ireland Shipping",
            "url": "https://www.ecovluu.com/product/deep-conditioning-hair-mask",
            "priceCurrency": "EUR",
            "price": product.price.toFixed(2),
            "availability": product.status === 'inactive' ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition",
            "seller": {
              "@type": "Organization",
              "@id": "https://www.ecovluu.com/#organization",
              "name": "Ecovluu"
            },
            "shippingDetails": {
              "@type": "OfferShippingDetails",
              "shippingDestination": {
                "@type": "DefinedRegion",
                "addressCountry": ["IE"]
              },
              "deliveryTime": {
                "@type": "ShippingDeliveryTime",
                "handlingTime": {
                  "@type": "QuantitativeValue",
                  "minValue": 1,
                  "maxValue": 2,
                  "unitCode": "DAY"
                },
                "transitTime": {
                  "@type": "QuantitativeValue",
                  "minValue": 2,
                  "maxValue": 5,
                  "unitCode": "DAY"
                }
              },
              "shippingRate": {
                "@type": "MonetaryAmount",
                "value": "12.05",
                "currency": "EUR"
              }
            },
            "hasMerchantReturnPolicy": {
              "@type": "MerchantReturnPolicy",
              "applicableCountry": "IE",
              "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
              "merchantReturnDays": 14,
              "returnMethod": "https://schema.org/ReturnByMail",
              "returnFees": "https://schema.org/FreeReturn"
            }
          },
          {
            "@type": "Offer",
            "name": "European Union Shipping",
            "url": "https://www.ecovluu.com/product/deep-conditioning-hair-mask",
            "priceCurrency": "EUR",
            "price": product.price.toFixed(2),
            "availability": product.status === 'inactive' ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition",
            "seller": {
              "@type": "Organization",
              "@id": "https://www.ecovluu.com/#organization",
              "name": "Ecovluu"
            },
            "shippingDetails": {
              "@type": "OfferShippingDetails",
              "shippingDestination": {
                "@type": "DefinedRegion",
                "addressCountry": ["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE"]
              },
              "deliveryTime": {
                "@type": "ShippingDeliveryTime",
                "handlingTime": {
                  "@type": "QuantitativeValue",
                  "minValue": 1,
                  "maxValue": 2,
                  "unitCode": "DAY"
                },
                "transitTime": {
                  "@type": "QuantitativeValue",
                  "minValue": 5,
                  "maxValue": 10,
                  "unitCode": "DAY"
                }
              },
              "shippingRate": {
                "@type": "MonetaryAmount",
                "value": "23.12",
                "currency": "EUR"
              }
            },
            "hasMerchantReturnPolicy": {
              "@type": "MerchantReturnPolicy",
              "applicableCountry": "IE",
              "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
              "merchantReturnDays": 14,
              "returnMethod": "https://schema.org/ReturnByMail",
              "returnFees": "https://schema.org/FreeReturn"
            }
          }
        ]
      };
    }

    // Default fallback
    const claims = PRODUCT_CLAIMS[product.slug] || [];
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": `https://ecovluu.com/product/${product.slug}/#product`,
      "name": product.name,
      "description": product.description || `${product.name} - Premium hair care product from ECOVLUU`,
      "image": allImages.length > 0 ? allImages : [product.image],
      "sku": product.sku || `ECOVLUU-${product.id}`,
      "brand": {
        "@type": "Brand",
        "name": "Ecovluu"
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
          "name": "Ecovluu"
        }
      },
      "additionalProperty": claims.map(claim => ({
        "@type": "PropertyValue",
        "name": claim.name,
        "value": claim.value
      }))
    };
  };

  // Generate DefinedTermSet JSON-LD for Ingredients Glossary
  const generateIngredientsJsonLd = () => {
    if (!product) return null;
    const glossary = KEY_INGREDIENTS_GLOSSARY[product.slug];
    if (!glossary) return null;

    return {
      "@context": "https://schema.org",
      "@type": "DefinedTermSet",
      "@id": `https://ecovluu.com/product/${product.slug}/#ingredients-glossary`,
      "name": `Key Ingredients Glossary - ${product.slug === 'deep-conditioning-hair-mask' ? 'Deep Conditioning Hair Mask' : 'Deep Hydrating Shampoo'}`,
      "url": `https://ecovluu.com/product/${product.slug}`,
      "hasDefinedTerm": glossary.map(term => ({
        "@type": "DefinedTerm",
        "name": term.name,
        "description": term.description,
        "inDefinedTermSet": `https://ecovluu.com/product/${product.slug}/#ingredients-glossary`
      }))
    };
  };

  // Generate FAQPage JSON-LD for product page FAQs
  const generateFaqJsonLd = () => {
    if (!product) return null;
    const faqs = OVERRIDE_FAQS[product.slug] || product.faqs || [];
    if (faqs.length === 0) return null;

    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `https://ecovluu.com/product/${product.slug}/#faq`,
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  };

  const educationContent = product?.educationContent && Object.keys(product.educationContent).length > 0 
    ? product.educationContent 
    : {};
    
  const resultsContent = product?.clinicalResults && Object.keys(product.clinicalResults).length > 0 
    ? product.clinicalResults 
    : {};
    
  const faqContent = product
    ? (OVERRIDE_FAQS[product.slug] || (product.faqs && product.faqs.length > 0 ? product.faqs : []))
    : [];
    
  const reviewFilters = ["All (3)", "Dry Hair", "Fine Hair", "Oily Scalp", "Sensitive Scalp", "With Photos"];

  const ugcContent = product?.ugcVideos && product.ugcVideos.length > 0
    ? product.ugcVideos
    : [];

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
  const ingredientsJsonLd = generateIngredientsJsonLd();
  const faqJsonLd = generateFaqJsonLd();
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": "https://www.ecovluu.com/shampoo/#itemlist",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "url": "https://www.ecovluu.com/product/deep-hydrating-shampoo",
        "name": "Deep Hydrating Shampoo | Ecovluu"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "url": "https://www.ecovluu.com/product/deep-conditioning-hair-mask",
        "name": "Deep Conditioning Mask - Dry & Damaged Hair | Ecovluu"
      }
    ]
  };
  const isInactive = product.status === 'inactive';

  const handlePrevMedia = () => {
    setActiveMedia((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
  };

  const handleNextMedia = () => {
    setActiveMedia((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
  };


  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.targetTouches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const touch = e.changedTouches[0];
    const diffX = touchStart.x - touch.clientX;
    const diffY = touchStart.y - touch.clientY;
    
    // Only trigger swipe if horizontal swipe is greater than vertical swipe, and horizontal is > 50px
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0) {
        handleNextMedia();
      } else {
        handlePrevMedia();
      }
    }
    setTouchStart(null);
  };
  const metaTitle = (
    product.slug === 'deep-hydrating-shampoo'
      ? "Buy Deep Hydrating Shampoo Online for Dry Hair | EcoVluu"
      : product.slug === 'deep-conditioning-hair-mask'
        ? "Buy Best Hair Mask for Dry Damaged Hair Online | EcoVluu"
        : product.name
  );

  const metaDescription = (
    product.slug === 'deep-hydrating-shampoo'
      ? "Gorgeous, hydrated hair is finally here! EcoVluu's hydrating shampoo delivers the deep moisture your hair craves. Shop the best moisturising shampoo today!"
      : product.slug === 'deep-conditioning-hair-mask'
        ? "Your damaged hair deserves better! EcoVluu's deep conditioning mask is the best natural hair mask for dry damaged hair. Try it once and never look back!"
        : product.description
  );

  return (
    <Layout>
      <Helmet>
        <title>{metaTitle}</title>
        {metaDescription && <meta name="description" content={metaDescription} />}
        <link rel="canonical" href={`https://www.ecovluu.com/product/${product.slug}`} />
        {productJsonLd && (
          <script type="application/ld+json">
            {JSON.stringify(productJsonLd)}
          </script>
        )}
        {ingredientsJsonLd && (
          <script type="application/ld+json">
            {JSON.stringify(ingredientsJsonLd)}
          </script>
        )}
        {faqJsonLd && (
          <script type="application/ld+json">
            {JSON.stringify(faqJsonLd)}
          </script>
        )}
        <script type="application/ld+json">
          {JSON.stringify(itemListJsonLd)}
        </script>
      </Helmet>
    
    <div className="w-full bg-background animate-fade-in font-sans text-foreground">

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
            <div 
              className="w-full aspect-[4/5] sm:aspect-square bg-[#F7F3EE] rounded-2xl flex items-center justify-center mb-4 sm:mb-6 border-2 border-brand-orange/20 relative overflow-hidden group"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {mediaItems.length > 0 && (
                <>
                  <img 
                    src={mediaItems[activeMedia]?.url} 
                    alt={`${product.name} - View ${activeMedia + 1}`}
                    width={600}
                    height={600}
                    loading="eager"
                    fetchpriority="high"
                    decoding="async"
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
                    <img src={item.url} alt={`Thumbnail ${idx + 1}`} width={96} height={96} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Zoom Dialog Modal */}
            <Dialog open={isZoomDialogOpen} onOpenChange={setIsZoomDialogOpen}>
              <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-4 flex flex-col bg-white border-none shadow-2xl rounded-xl">
                 <DialogHeader className="flex justify-between items-center border-b pb-2">
                   <DialogTitle className="text-xl text-brand-brown">Zoom Image</DialogTitle>
                   <DialogDescription className="sr-only">Zoomed product image view</DialogDescription>
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
              <StarRating rating={averageRating} totalReviews={totalReviewsCount} />
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
              {deliveryStatus === 'checking' && (
                <div className="flex items-center gap-2 mt-3 text-sm text-gray-500 bg-gray-100/50 p-2 rounded-md border border-gray-200">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-brand-orange border-t-transparent"></div>
                  Checking delivery availability for "{pincode}"...
                </div>
              )}
              {deliveryStatus === 'available' && (
                <div className="flex items-center gap-2 mt-3 text-sm text-green-600 bg-green-50 p-2 rounded-md border border-green-100">
                  <CheckCircle2 size={16} className="shrink-0" />
                  <span>
                    Delivery is available to <strong>{detectedCountry}</strong> ({pincode}).
                  </span>
                </div>
              )}
              {deliveryStatus === 'unavailable' && (
                <div className="flex items-center gap-2 mt-3 text-sm text-red-600 bg-red-50 p-2 rounded-md border border-red-100">
                  <XCircle size={16} className="shrink-0" />
                  <span>
                    Delivery is not available for "{pincode}". Please enter a valid EU or Ireland postcode.
                  </span>
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
                    <div className="blog-content w-full text-left" dangerouslySetInnerHTML={renderHtmlContent(product.description)} />
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
                    <div className="blog-content w-full text-left" dangerouslySetInnerHTML={renderHtmlContent(product.usage)} />
                  </AccordionContent>
                </AccordionItem>
              )}
              
              {product.ingredients && (
                <AccordionItem value="ingredients" className="border-b-gray-200">
                  <AccordionTrigger className="text-sm font-bold text-brand-brown hover:text-brand-orange py-4 text-left">
                    INGREDIENTS
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed text-sm pb-4">
                    <div className="blog-content w-full text-left" dangerouslySetInnerHTML={renderHtmlContent(product.ingredients)} />
                  </AccordionContent>
                </AccordionItem>
              )}

              {PRODUCT_CLAIMS[product.slug] && (
                <AccordionItem value="claims" className="border-b-gray-200">
                  <AccordionTrigger className="text-sm font-bold text-brand-brown hover:text-brand-orange py-4 text-left">
                    SUSTAINABILITY & SPECIFICATIONS
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed text-sm pb-4">
                    <ul className="list-disc pl-5 space-y-1.5">
                      {PRODUCT_CLAIMS[product.slug].map((claim, idx) => (
                        <li key={idx}>
                          <span className="font-semibold text-brand-brown">{claim.name}:</span> {claim.value}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              )}

              <AccordionItem value="shipping" className="border-b-gray-200">
                <AccordionTrigger className="text-sm font-bold text-brand-brown hover:text-brand-orange py-4 text-left">
                  SHIPPING & RETURNS
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed text-sm pb-4">
                  Free shipping on orders over €50. 14-day money-back guarantee (for unopened products).
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
      <ProductIngredients productSlug={product.slug} />

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
            <div className="lg:col-span-4 text-left">
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
            
            <div className="lg:col-span-8 lg:pl-12 flex flex-col justify-center animate-fade-in text-left" key={activeEducationTab}>
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
                <div className="aspect-[9/16] bg-gray-100 relative mb-4 rounded-lg flex items-center justify-center group overflow-hidden">
                  {ugc.videoUrl ? (
                    <video 
                      src={ugc.videoUrl} 
                      className="w-full h-full object-cover" 
                      controls 
                      playsInline 
                      preload="metadata"
                    />
                  ) : (
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-brand-orange text-white rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 cursor-pointer">
                      <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-1 fill-current" />
                    </div>
                  )}
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
      <ProductFAQ faqContent={faqContent} />
      
      {/* REVIEWS SECTION */}
      <ProductReviewsSection
        productId={product.id}
        productReviews={productReviews}
        averageRating={averageRating}
        totalReviewsCount={totalReviewsCount}
      />

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