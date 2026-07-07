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
