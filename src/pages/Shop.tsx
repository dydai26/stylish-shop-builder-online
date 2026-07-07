import React, { useState, useEffect } from "react";
import { useSearchParams, Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import DeliveryAnnouncement from "@/components/ui/DeliveryAnnouncement";
import ProductCard from "@/components/ui/ProductCard";
import { Product } from "@/context/CartContext";
import { getAllProducts } from "@/lib/api";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const shopFaqs = [
  {
    question: "Does hydrating shampoo help with dry ends or just the scalp?",
    answer: "Mostly the lengths. A natural hydrating shampoo is made to soften dry, rough ends while still cleaning the scalp gently."
  },
  {
    question: "Will color-safe shampoo help stop my hair color from fading?",
    answer: "It can help. The best shampoo for colored hair is made without harsh cleansers that strip color, so it's gentler on dyed hair than a regular shampoo."
  },
  {
    question: "How do I deal with blonde hair turning brassy?",
    answer: "Brassiness is often caused by hard water and sun exposure. A shampoo made for blonde hair is formulated to help tone down those warm, yellow tones."
  },
  {
    question: "What shampoo works if my scalp is oily but my hair is dry?",
    answer: "A shampoo for oily scalp is made to balance oil at the roots while still being gentle on drier lengths."
  }
];

const Shop = () => {
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    pathname === "/shampoo" ? "shampoo" : null
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const searchQuery = searchParams.get("search");
  
  const categories = ["shampoo", "mask"];

  // Sync selectedCategory with route pathname
  useEffect(() => {
    if (pathname === "/shampoo") {
      setSelectedCategory("shampoo");
    } else {
      setSelectedCategory(null);
    }
  }, [pathname]);

  // Generate FAQ Page schema (for /shop)
  const faqSchemaMarkup = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://ecovluu.com/shop/#faq",
    "mainEntity": shopFaqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  // Generate CollectionPage schema (for /shampoo)
  const collectionSchemaMarkup = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://ecovluu.com/shampoo/#collectionpage",
    "name": "Shampoo Collection | Ecovluu",
    "description": "Browse our range of natural, professional-grade shampoos and hair masks for dry, damaged, and colour-treated hair.",
    "url": "https://ecovluu.com/shampoo",
    "isPartOf": {
      "@id": "https://ecovluu.com/#website"
    }
  };

  // Generate ItemList schema (for /shampoo)
  const itemListSchemaMarkup = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": "https://ecovluu.com/shampoo/#itemlist",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "url": "https://ecovluu.com/product/deep-hydrating-shampoo",
        "name": "Deep Hydrating Shampoo | Ecovluu"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "url": "https://ecovluu.com/product/deep-conditioning-hair-mask",
        "name": "Deep Conditioning Mask - Dry & Damaged Hair | Ecovluu"
      }
    ]
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadProducts = async () => {
      setLoading(true);
      try {
        const allProducts = await getAllProducts();
        setProducts(allProducts);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Create a filter based on the selected category and search query
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    const matchesSearch = searchQuery
      ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      <Helmet>
        {pathname === "/shampoo" ? (
          <>
            <title>Shampoo Collection | Ecovluu</title>
            <meta name="description" content="Browse our range of natural, professional-grade shampoos and hair masks for dry, damaged, and colour-treated hair." />
            <meta name="keywords" content="natural shampoo, organic shampoo, dry hair shampoo, sulfate-free shampoo, ECOVLUU" />
            <link rel="canonical" href="https://ecovluu.com/shampoo" />
            <script type="application/ld+json">
              {JSON.stringify(collectionSchemaMarkup)}
            </script>
            <script type="application/ld+json">
              {JSON.stringify(itemListSchemaMarkup)}
            </script>
          </>
        ) : (
          <>
            <title>Natural Hydrating Shampoo & Best Hair Mask Buy At Best Deals</title>
            <meta name="description" content="Healthy, gorgeous hair is just awash away! Our best hair care shampoo and hair repair mask are made to restore, hydrate & revive every single strand. Shop now!" />
            <meta name="keywords" content="natural hair care, hair products, organic shampoo, hair mask, deep hydrating, ECOVLUU" />
            <link rel="canonical" href="https://www.ecovluu.com/shop" />
            <script type="application/ld+json">
              {JSON.stringify(faqSchemaMarkup)}
            </script>
          </>
        )}
      </Helmet>
      <DeliveryAnnouncement />
      <div className="bg-gray-50 py-4 sm:py-8">
        <div className="container-custom">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center sm:text-left text-brand-brown">Shop Our Products</h1>
          
          {/* Brand Philosophy Box */}
          <div className="bg-[#FAF5F0] p-5 sm:p-6 rounded-xl mb-6 text-left shadow-sm border border-brand-brown/5 transition-all duration-300">
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              At Ecovluu, we craft hair care made for real results — deeply nourishing, sulfate-free formulas designed for dry, damaged, and color-treated hair.
              {isExpanded ? (
                <span>
                  {" "}Every product is recommended by professionals and made with ingredients that restore strength, shine, and softness from root to tip. Our formulations combine clean chemistry with premium botanical oils to revive your hair and scalp.
                </span>
              ) : (
                <span>...</span>
              )}
            </p>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-block mt-3 text-brand-orange hover:text-brand-orange/80 font-semibold text-sm sm:text-base transition-colors"
            >
              {isExpanded ? "Read less" : "Read more"}
            </button>
          </div>
          
          {searchQuery && (
            <div className="mb-4 sm:mb-6">
              <p className="text-black text-sm sm:text-base text-center sm:text-left">
                Search results for: <span className="font-semibold">{searchQuery}</span>
              </p>
            </div>
          )}
          
          <div className="mb-6 sm:mb-8 flex flex-wrap gap-2 justify-center sm:justify-start">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 sm:px-4 py-2 rounded-full text-sm sm:text-base ${
                !selectedCategory
                  ? "bg-brand-brown text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              All Products
            </button>
            
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 sm:px-4 py-2 rounded-full capitalize text-sm sm:text-base ${
                  selectedCategory === category
                    ? "bg-brand-brown text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white h-80 rounded-md animate-pulse"></div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {filteredProducts.map(product => (
                <div key={product.id}><ProductCard product={product} /></div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-500 text-sm sm:text-base px-4">No products found matching your criteria.</p>
            </div>
          )}

          {/* FAQ Section */}
          <div className="mt-16 sm:mt-24">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-left text-brand-brown">
              Frequently asked questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {shopFaqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`shop-item-${index}`}
                  className="bg-white border border-gray-200 rounded-xl mb-4 px-5 sm:px-6 shadow-sm border-b-0"
                >
                  <AccordionTrigger className="text-sm sm:text-base md:text-lg text-left text-brand-brown font-semibold hover:no-underline py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed pb-4 text-left">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Shop;