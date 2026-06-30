import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Helmet } from "react-helmet-async";

const faqs = [
  {
    question: "Are your products 100% natural?",
    answer: "Yes, our products are formulated with premium natural ingredients and are developed by professionals to ensure they are safe, effective, and free from harsh chemicals."
  },
  {
    question: "What type of hair are ECOVLUU products suitable for?",
    answer: "Our shampoos and masks are designed for all hair types, but they are particularly effective for dry, damaged, and color-treated hair in need of deep hydration."
  },
  {
    question: "How long does shipping take?",
    answer: "Orders are typically processed within 1-2 business days. Delivery times vary depending on your location, but standard shipping usually takes 3-5 business days."
  },
  {
    question: "Do you offer international shipping?",
    answer: "Currently, we ship to selected countries. Please check our shipping policy page for the full list of available destinations."
  },
  {
    question: "Can I return a product if I'm not satisfied?",
    answer: "Yes, we offer a money-back guarantee. If your order isn't perfect, we accept refunds for damaged items within 14 days of receipt."
  }
];

const FAQSection = () => {
  // Generate JSON-LD Schema
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      </Helmet>
      <div className="container-custom">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-brand-brown">
            Frequently asked questions
          </h2>
          <p className="text-gray-600">
            Find answers to the most common questions about our natural hair care products.
          </p>
        </div>
        
        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Left Column: Accordion */}
          <div className="w-full">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-base sm:text-lg text-left text-brand-brown font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Right Column: Image */}
          <div className="w-full" data-animate>
            <div className="rounded-xl overflow-hidden shadow-md aspect-[4/3] w-full bg-brand-brown/10">
              <img
                src="/image container.jpg"
                alt="Frequently asked questions - EcoVluu"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
