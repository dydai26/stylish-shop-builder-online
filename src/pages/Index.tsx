
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Benefits from "@/components/home/Benefits";
import AboutSection from "@/components/home/AboutSection";
import ReviewsSection from "@/components/home/ReviewsSection";
import ConsultationSection from "@/components/home/ConsultationSection";
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

  return (
    <Layout>
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
          <NewsletterSection />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
