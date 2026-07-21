import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { KEY_INGREDIENTS_GLOSSARY } from "@/data/productStaticData";

interface ProductIngredientsProps {
  productSlug: string;
}

export const ProductIngredients: React.FC<ProductIngredientsProps> = ({ productSlug }) => {
  const glossary = KEY_INGREDIENTS_GLOSSARY[productSlug];
  
  if (!glossary) return null;

  return (
    <section className="py-12 sm:py-16 bg-brand-beige/20 border-t border-gray-200">
      <div className="container-custom">
        <div className="mb-8 sm:mb-10 text-center sm:text-left border-b border-gray-200 pb-4">
          <h2 className="text-brand-orange font-semibold tracking-widest text-xs sm:text-sm mb-2 uppercase">What's Inside</h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-brand-brown mb-2">Key Ingredients</h3>
          <p className="text-gray-500 text-sm sm:text-base">Every ingredient chosen for a reason. Click to learn what it does.</p>
        </div>
        
        <Accordion type="single" collapsible defaultValue="ingredient-0" className="w-full">
          {glossary.map((item, index) => (
            <AccordionItem key={index} value={`ingredient-${index}`} className="border-b-gray-200">
              <AccordionTrigger className="text-sm font-bold text-brand-brown hover:text-brand-orange py-4 sm:py-5 text-left uppercase">
                {item.name}
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-brand-beige rounded-full flex items-center justify-center text-3xl sm:text-4xl flex-shrink-0 shadow-sm border border-gray-200">
                    {item.icon}
                  </div>
                  <div>
                    {item.subtype && (
                      <h4 className="text-base sm:text-lg font-bold text-brand-brown mb-2">{item.subtype}</h4>
                    )}
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default ProductIngredients;
