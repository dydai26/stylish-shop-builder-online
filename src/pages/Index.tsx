import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import DeliveryAnnouncement from "@/components/ui/DeliveryAnnouncement";
import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Benefits from "@/components/home/Benefits";
import AboutSection from "@/components/home/AboutSection";
import ReviewsSection from "@/components/home/ReviewsSection";
import ConsultationSection from "@/components/home/ConsultationSection";
import FAQSection from "@/components/home/FAQSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import IntroAnimation from "@/components/intro/IntroAnimation";

const Index = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [hasShownIntro, setHasShownIntro] = useState(false);

  useEffect(() => {
    const introShown = sessionStorage.getItem('introShown');
    if (introShown) {
      setShowIntro(false);
      setHasShownIntro(true);
    }
  }, []);

  const handleAnimationComplete = () => {
    setShowIntro(false);
    setHasShownIntro(true);
    sessionStorage.setItem('introShown', 'true');
  };

  if (showIntro && !hasShownIntro) {
    return <IntroAnimation onAnimationComplete={handleAnimationComplete} />;
  }

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "ECOVLUU",
    "image": "https://ecovluu.com/ecovluu-logo.png",
    "@id": "https://ecovluu.com",
    "url": "https://ecovluu.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "A6, Block A, Santry Business Park, Swords Road, Santry",
      "addressLocality": "Dublin 9",
      "postalCode": "",
      "addressCountry": "IE"
    },
    "description": "Premium natural hair care products developed by professionals. Discover deep hydration and hair restoration with EcoVluu.",
    "priceRange": "$$"
  };

  return (
    <Layout>
      <Helmet>
        <title>Total Hair Care - Restore, Hydrate & Strengthen | EcoVluu</title>
        <meta name="description" content="Why settle for dull hair? Our best shampoo products and hair mask with kerotin hair care give salon results at home. Shop the best hair care products today." />
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      </Helmet>
      <DeliveryAnnouncement />
      <div className="w-full overflow-hidden">
        <Hero />
        <div className="transition-opacity duration-1000 transform">
          <FeaturedProducts />
        </div>
        <div className="transition-opacity duration-1000 transform">
          <Benefits />
        </div>
        <div className="transition-opacity duration-1000 transform">
          <AboutSection />
        </div>
        <div className="transition-opacity duration-1000 transform">
          <ReviewsSection />
        </div>
        <div className="transition-opacity duration-1000 transform">
          <ConsultationSection />
        </div>
        <div className="transition-opacity duration-1000 transform">
          <FAQSection />
        </div>
        <div className="transition-opacity duration-1000 transform">
          <NewsletterSection />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
