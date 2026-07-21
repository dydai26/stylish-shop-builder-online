import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

interface ProductFAQProps {
  faqContent: FAQItem[];
}

export const ProductFAQ: React.FC<ProductFAQProps> = ({ faqContent }) => {
  if (!faqContent || faqContent.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-white">
      <div className="container-custom max-w-3xl">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-brand-orange font-semibold tracking-widest text-xs sm:text-sm mb-2 sm:mb-3 uppercase">Support</h2>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-brown mb-3 sm:mb-4">Have questions? We've got answers.</h3>
          <p className="text-gray-500 text-sm sm:text-base">Your most common concerns, answered.</p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqContent.map((faq, i) => (
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
  );
};

export default ProductFAQ;
