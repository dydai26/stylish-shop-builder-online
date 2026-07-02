import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
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
    question: "How long does shipping take?",
    answer: "Orders are typically processed within 1-2 business days. Delivery times vary depending on your location, but standard shipping usually takes 3-5 business days."
  },
  {
    question: "Are Ecovluu products sulfate-free?",
    answer: "Yes, all Ecovluu products are 100% sulfate-free, silicone-free, and paraben-free. We use gentle, plant-based surfactants to cleanse your hair without stripping its natural moisture."
  },
  {
    question: "Can I return a product if it doesn't work for me?",
    answer: "Yes, we want you to love your hair care! We offer a 14-day money-back guarantee for damaged items. If you are not fully satisfied with your purchase, please contact our support team and we will do our best to make it right."
  }
];

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const searchQuery = searchParams.get("search");
  
  const categories = ["shampoo", "mask"];

  // Generate JSON-LD Schema for FAQs
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": shopFaqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
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
        <title>Natural Hydrating Shampoo & Best Hair Mask Buy At Best Deals</title>
        <meta name="description" content="Healthy, gorgeous hair is just awash away! Our best hair care shampoo and hair repair mask are made to restore, hydrate & revive every single strand. Shop now!" />
        <meta name="keywords" content="natural hair care, hair products, organic shampoo, hair mask, deep hydrating, ECOVLUU" />
        <link rel="canonical" href="https://www.ecovluu.com/shop" />
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
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