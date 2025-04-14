
import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Benefits from "@/components/home/Benefits";
import AboutSection from "@/components/home/AboutSection";
import ReviewsSection from "@/components/home/ReviewsSection";
import ConsultationSection from "@/components/home/ConsultationSection";

const Index = () => {
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
      </div>
    </Layout>
  );
};

export default Index;
