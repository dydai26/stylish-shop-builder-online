import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { getBannerByLocation, type Banner } from "@/lib/bannersService";

const AboutPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [banner, setBanner] = useState<Banner | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Load banner data
    const loadBanner = async () => {
      try {
        const bannerData = await getBannerByLocation('/about');
        setBanner(bannerData);
      } catch (error) {
        console.error('Error loading about banner:', error);
      }
    };
    
    loadBanner();
  }, []);

  const slides = [
    { id: 1, image: "/1.jpg", alt: "Product 1" },
    { id: 2, image: "/_DSC8542.jpg", alt: "Product 2" },
    { id: 3, image: "/2.jpg", alt: "Product 3" },
    { id: 4, image: "/_DSC8533.jpg", alt: "Product 4" },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % (slides.length));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Отримуємо 3 видимі слайди
  const visibleSlides = [
    slides[currentSlide],
    slides[(currentSlide + 1) % slides.length],
    slides[(currentSlide + 2) % slides.length]
  ];

  return (
    <Layout>
      <Helmet>
        <title>About Us - Premium Natural Hair Care | ECOVLUU</title>
        <meta name="description" content="Discover the story behind ECOVLUU. We develop premium natural hair care products to restore, hydrate, and strengthen your hair using professional formulas." />
        <link rel="canonical" href="https://www.ecovluu.com/about" />
      </Helmet>
      {/* Hero Banner Section - Full Width */}
      <div className="relative">
          <img 
            src={banner?.image || "/ECOVLUU.png"} 
            alt={banner?.title || "Hair care"} 
            className="relative w-full" 
          />      
        </div>
      {/* Benefits Icons Section */}
      <section className="py-6 sm:py-8 md:py-12 px-4 sm:px-6 md:px-8" data-animate>
        <div className="bg-white py-8 sm:py-12 md:py-16">
          <div className="container-custom">
            <div className="text-center mb-8 sm:mb-10 md:mb-12" data-animate>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black">OUR APPROACH</h2>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">What sets our hair care products apart</p>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-6 lg:gap-x-12 gap-y-8 sm:gap-y-12 lg:gap-y-16">
              {/* Crambe Abyssinica Oil */}
              <div className="flex items-start gap-3 sm:gap-4 lg:gap-6" data-animate>
                <div className="flex-shrink-0">
                  <img 
                    src="/cramble.jpg" 
                    alt="Crambe Abyssinica Oil" 
                    className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-[#E08F35] font-medium text-sm sm:text-base lg:text-lg mb-1 sm:mb-2 text-left">
                    CRAMBE ABYSSINICA OIL
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed text-left">
                    Deeply hydrates without weighing hair down. Reduces frizz and smooths the hair cuticle.
                  </p>
                </div>
              </div>

              {/* Genadvance Life */}
              <div className="flex items-start gap-3 sm:gap-4 lg:gap-6" data-animate>
                <div className="flex-shrink-0">
                  <img 
                    src="/genadv.jpg" 
                    alt="Genadvance Life" 
                    className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-[#E08F35] font-medium text-sm sm:text-base lg:text-lg mb-1 sm:mb-2 text-left">
                    GENADVANCE® LIFE
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed text-left">
                    We've chosen Genadvance® Life for its ability to breathe new life into tired, dry hair.
                  </p>
                </div>
              </div>

              {/* Keratin */}
              <div className="flex items-start gap-3 sm:gap-4 lg:gap-6" data-animate>
                <div className="flex-shrink-0">
                  <img 
                    src="/keratin.jpg" 
                    alt="Keratin" 
                    className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-[#E08F35] font-medium text-sm sm:text-base lg:text-lg mb-1 sm:mb-2 text-left">
                    KERATIN
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed text-left">
                    Our keratin-infused formulas work to rebuild and fortify weakened strands, reduce frizz, and amplify shine by repairing and sealing damaged hair fibres.
                  </p>
                </div>
              </div>

              {/* Saffron Extract */}
              <div className="flex items-start gap-3 sm:gap-4 lg:gap-6" data-animate>
                <div className="flex-shrink-0">
                  <img 
                    src="/safron.jpg" 
                    alt="Saffron Extract" 
                    className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-[#E08F35] font-medium text-sm sm:text-base lg:text-lg mb-1 sm:mb-2 text-left">
                    SAFFRON EXTRACT
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed text-left">
                    Lightweight & Non-Greasy: Conditions hair without weighing it down, leaving it soft and smooth.
                  </p>
                </div>
              </div>

              {/* Amino Acids */}
              <div className="flex items-start gap-3 sm:gap-4 lg:gap-6" data-animate>
                <div className="flex-shrink-0">
                  <img 
                    src="/amino.jpg" 
                    alt="Amino Acids" 
                    className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-[#E08F35] font-medium text-sm sm:text-base lg:text-lg mb-1 sm:mb-2 text-left">
                    AMINO ACIDS
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed text-left">
                    Locks in deep moisture for hydrated, silky-smooth hair, fortifies hair, reducing breakage and improving overall strength.
                  </p>
                </div>
              </div>

              {/* Aloe Vera */}
              <div className="flex items-start gap-3 sm:gap-4 lg:gap-6" data-animate>
                <div className="flex-shrink-0">
                  <img 
                    src="/aloe.jpg" 
                    alt="Aloe Vera" 
                    className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-[#E08F35] font-medium text-sm sm:text-base lg:text-lg mb-1 sm:mb-2 text-left">
                    ALOE VERA
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed text-left">
                    Helps calm scalp irritation, creating an optimal environment for healthy hair. Adds Shine and Smoothness.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Ingredients Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-[#FAF5F0]" data-animate>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h2 className="text-center text-lg sm:text-xl md:text-2xl font-medium text-black mb-8 sm:mb-10 md:mb-12 uppercase tracking-wide" data-animate>
          Trusted Ingredients. Proven Results.
          </h2>
          
          <div className="relative" data-animate>
            {/* Mobile: Show single slide */}
            <div className="block sm:hidden">
              <div className="flex justify-center">
                <div className="w-[280px] rounded-lg">
                  <img 
                    src={slides[currentSlide].image}
                    alt={slides[currentSlide].alt}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
            
            {/* Desktop: Show 3 slides */}
            <div className="hidden sm:block max-w-[944px] mx-auto overflow-hidden">
              <div className="flex gap-4 sm:gap-6">
                {visibleSlides.map((slide) => (
                  <div 
                    key={slide.id} 
                    className="w-[280px] sm:w-[300px] flex-shrink-0 rounded-lg"
                    data-animate
                  >
                    <img 
                      src={slide.image} 
                      alt={slide.alt} 
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              onClick={prevSlide}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg 
                       hover:bg-[#E08F35] transition-colors group z-10"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[#5A4A41] group-hover:text-white" />
            </button>
            
            <button 
              onClick={nextSlide}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg 
                       hover:bg-[#E08F35] transition-colors group z-10"
            >
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#5A4A41] group-hover:text-white" />
            </button>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8" data-animate>
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8" data-animate>
            <img 
              src="/img1.jpg" 
              alt="Founder Photo" 
              className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full object-cover"
            />
            <img 
              src="/image 2.jpg" 
              alt="Founder Photo" 
              className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full object-cover"
            />
            <img 
              src="/img3.jpg" 
              alt="Founder Photo" 
              className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full object-cover"
            />
          </div>
          
          <h3 className="text-lg sm:text-xl font-medium text-[#5A4A41] mb-4 sm:mb-6" data-animate>
            CATALINA BACIU, founder
          </h3>
          
          <div className="space-y-4 sm:space-y-6 text-black text-xs sm:text-sm leading-relaxed text-justify px-4 sm:px-0" data-animate>
            <p>
              With over 24 years as a hairstylist, I've seen firsthand what hair truly needs to thrive—and how hard it can be to restore its natural beauty after damage.
              My passion for hair, science, and sustainability led me to create Ecovluu: 
              a brand rooted in expertise and purpose.
            </p>
            
            <p>
              Working with top chemists, I combined salon experience with advanced hair science to develop formulas that nourish, protect, and strengthen—all 
              without harsh sulfates, silicones, or parabens. We use high-performance ingredients, plant oils, 
              and botanical extracts to deliver real results, naturally.
            </p>
            
            <p>
           <strong>
            Ecovluu is more than a brand—it's a commitment to healthier hair, 
            thoughtful choices, and helping you fall in love with your hair again.
            </strong>
            </p>
          </div>
          
          <div data-animate>
            <Link 
              to="/shop" 
              className="inline-block mt-6 sm:mt-8 bg-[#5A4A41] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg 
                       hover:bg-[#E08F35] transition-colors text-xs sm:text-sm uppercase tracking-wide"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Order Steps */}
      <section className="py-8 sm:py-12 md:py-16" data-animate>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Step 1 */}
            <div className="bg-[#5A4A41] rounded-lg p-4 sm:p-6 md:p-8 text-white" data-animate>
              <div className="flex items-start gap-3 sm:gap-4">
                <span className="text-5xl sm:text-6xl md:text-7xl font-light text-gray-400">1</span>
                <div className="flex-1">
                  <h4 className="text-lg sm:text-xl font-medium mb-2">Place an order</h4>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    Order Ecovluu products online on this website and pay for the order.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#5A4A41] rounded-lg p-4 sm:p-6 md:p-8 text-white" data-animate>
              <div className="flex items-start gap-3 sm:gap-4">
                <span className="text-5xl sm:text-6xl md:text-7xl font-light text-gray-400">2</span>
                <div className="flex-1">
                  <h4 className="text-lg sm:text-xl font-medium mb-2">Expect delivery</h4>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  Get your favorite Ecovluu products delivered quickly to your door!
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#5A4A41] rounded-lg p-4 sm:p-6 md:p-8 text-white" data-animate>
              <div className="flex items-start gap-3 sm:gap-4">
                <span className="text-5xl sm:text-6xl md:text-7xl font-light text-gray-400">3</span>
                <div className="flex-1">
                  <h4 className="text-lg sm:text-xl font-medium mb-2">Start using products</h4>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    Apply Shampoo & Hair Mask according to instructions
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-[#5A4A41] rounded-lg p-4 sm:p-6 md:p-8 text-white" data-animate>
              <div className="flex items-start gap-3 sm:gap-4">
                <span className="text-5xl sm:text-6xl md:text-7xl font-light text-gray-400">4</span>
                <div className="flex-1">
                  <h4 className="text-lg sm:text-xl font-medium mb-2">Enjoy!</h4>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    Enjoy the result: nourished, shiny and hydrated hair.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    
    </Layout>
  );
};

export default AboutPage;