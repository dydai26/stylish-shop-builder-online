import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import DeliveryAnnouncement from "@/components/ui/DeliveryAnnouncement";
import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Benefits from "@/components/home/Benefits";
import AboutSection from "@/components/home/AboutSection";
import AboutEcovluu from "@/components/home/AboutEcovluu";
import ReviewsSection from "@/components/home/ReviewsSection";
import FAQSection from "@/components/home/FAQSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import IntroAnimation from "@/components/intro/IntroAnimation";
import { getAboutContent } from "@/lib/aboutService";

const HOMEPAGE_FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://www.ecovluu.com/#faq",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Are your products 100% natural?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. We use natural ingredients and every formula is developed by professionals, so it's safe, effective, and free from harsh chemicals."
      }
    },
    {
      "@type": "Question",
      "name": "What type of hair are Ecovluu products suitable for?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "All hair types, really. But if your hair is dry, damaged, or color-treated, our keratin hair care range and sulfate-free shampoo options will do the most for you."
      }
    },
    {
      "@type": "Question",
      "name": "How long does shipping take?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We process orders in 1-2 business days. After that, delivery usually takes another 3-5 business days depending on where you're located."
      }
    },
    {
      "@type": "Question",
      "name": "Do you offer international shipping?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We currently ship to select countries. Check our shipping policy page for the full list."
      }
    },
    {
      "@type": "Question",
      "name": "Can I return a product if I'm not satisfied?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. We back every order with a money-back guarantee - damaged items can be returned within 14 days of delivery for a refund."
      }
    }
  ]
};

const Index = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [hasShownIntro, setHasShownIntro] = useState(false);
  const [seoData, setSeoData] = useState({
    title: "Total Hair Care - Restore, Hydrate & Strengthen | EcoVluu",
    description: "Why settle for dull hair? Our best shampoo products and hair mask with kerotin hair care give salon results at home. Shop the best hair care products today."
  });

  useEffect(() => {
    const introShown = sessionStorage.getItem('introShown');
    if (introShown) {
      setShowIntro(false);
      setHasShownIntro(true);
    }
  }, []);

  useEffect(() => {
    const loadSeo = async () => {
      try {
        const data = await getAboutContent('home_philosophy');
        if (data) {
          setSeoData({
            title: data.meta_title || "Total Hair Care - Restore, Hydrate & Strengthen | EcoVluu",
            description: data.meta_description || "Why settle for dull hair? Our best shampoo products and hair mask with kerotin hair care give salon results at home. Shop the best hair care products today."
          });
        }
      } catch (err) {
        console.error("Error loading home page SEO:", err);
      }
    };
    loadSeo();
  }, []);

  const handleAnimationComplete = () => {
    setShowIntro(false);
    setHasShownIntro(true);
    sessionStorage.setItem('introShown', 'true');
  };

  if (showIntro && !hasShownIntro) {
    return <IntroAnimation onAnimationComplete={handleAnimationComplete} />;
  }

  return (
    <Layout>
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <link rel="canonical" href="https://www.ecovluu.com/" />
        <script type="application/ld+json">
          {JSON.stringify(HOMEPAGE_FAQ_SCHEMA)}
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
          <AboutEcovluu />
        </div>
        <div className="transition-opacity duration-1000 transform">
          <ReviewsSection />
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
