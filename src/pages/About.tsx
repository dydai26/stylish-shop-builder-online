import React, { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";

const AboutPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 1, image: "/1.png", alt: "Product 1" },
    { id: 2, image: "/_DSC8542.jpg", alt: "Product 2" },
    { id: 3, image: "/2.png", alt: "Product 3" },
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
      {/* Hero Banner Section - Full Width */}
      <div className="relative">
          <img src="/ECOVLUU.png" alt="Hair care" className="relative w-full" />      
        </div>
      {/* Benefits Icons Section */}
      <section className="py-2 px-4 md:px-8" data-animate>
        <div className="bg-white py-16">
          <div className="container-custom">
            <div className="text-center mb-12" data-animate>
              <h2 className="text-2xl md:text-3xl font-bold text-brand-brown">OUR APPROACH</h2>
              <p className="text-gray-600 mt-2">What sets our hair care products apart</p>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
              {/* Crambe Abyssinica Oil */}
              <div className="flex items-start gap-6" data-animate>
                <div className="flex-shrink-0">
                  <img 
                    src="/cramble.jpg" 
                    alt="Crambe Abyssinica Oil" 
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-[#E08F35] font-medium text-lg mb-2 text-left">
                    CRAMBE ABYSSINICA OIL
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed text-left">
                    Deeply hydrates without weighing hair down. Reduces frizz and smooths the hair cuticle.
                  </p>
                </div>
              </div>

              {/* Genadvance Life */}
              <div className="flex items-start gap-6" data-animate>
                <div className="flex-shrink-0">
                  <img 
                    src="/genadv.jpg" 
                    alt="Genadvance Life" 
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-[#E08F35] font-medium text-lg mb-2 text-left">
                    GENADVANCE® LIFE
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed text-left">
                    We've chosen Genadvance® Life for its ability to breathe new life into tired, dry hair.
                  </p>
                </div>
              </div>

              {/* Keratin */}
              <div className="flex items-start gap-6" data-animate>
                <div className="flex-shrink-0">
                  <img 
                    src="/keratin.jpg" 
                    alt="Keratin" 
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-[#E08F35] font-medium text-lg mb-2 text-left">
                    KERATIN
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed text-left">
                    Our keratin-infused formulas work to rebuild and fortify weakened strands, reduce frizz, and amplify shine by repairing and sealing damaged hair fibres.
                  </p>
                </div>
              </div>

              {/* Saffron Extract */}
              <div className="flex items-start gap-6" data-animate>
                <div className="flex-shrink-0">
                  <img 
                    src="/safron.jpg" 
                    alt="Saffron Extract" 
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-[#E08F35] font-medium text-lg mb-2 text-left">
                    SAFFRON EXTRACT
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed text-left">
                    Lightweight & Non-Greasy: Conditions hair without weighing it down, leaving it soft and smooth.
                  </p>
                </div>
              </div>

              {/* Amino Acids */}
              <div className="flex items-start gap-6" data-animate>
                <div className="flex-shrink-0">
                  <img 
                    src="/amino.jpg" 
                    alt="Amino Acids" 
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-[#E08F35] font-medium text-lg mb-2 text-left">
                    AMINO ACIDS
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed text-left">
                    Locks in deep moisture for hydrated, silky-smooth hair, fortifies hair, reducing breakage and improving overall strength.
                  </p>
                </div>
              </div>

              {/* Aloe Vera */}
              <div className="flex items-start gap-6" data-animate>
                <div className="flex-shrink-0">
                  <img 
                    src="/aloe.jpg" 
                    alt="Aloe Vera" 
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-[#E08F35] font-medium text-lg mb-2 text-left">
                    ALOE VERA
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed text-left">
                    Helps calm scalp irritation, creating an optimal environment for healthy hair. Adds Shine and Smoothness.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Ingredients Section */}
      <section className="py-16 bg-[#FAF5F0]" data-animate>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-center text-2xl font-medium text-[#5A4A41] mb-12 uppercase tracking-wide" data-animate>
            Our Key Ingredients
          </h2>
          
          <div className="relative" data-animate>
            <div className="max-w-[944px] mx-auto overflow-hidden"> {/* 944px = 3 * 300px (ширина картки) + 2 * 24px (gap) */}
              <div className="flex gap-6">
                {visibleSlides.map((slide) => (
                  <div 
                    key={slide.id} 
                    className="w-[300px] flex-shrink-0 rounded-lg"
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
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg 
                       hover:bg-[#E08F35] transition-colors group z-10"
            >
              <ArrowLeft className="w-5 h-5 text-[#5A4A41] group-hover:text-white" />
            </button>
            
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg 
                       hover:bg-[#E08F35] transition-colors group z-10"
            >
              <ArrowRight className="w-5 h-5 text-[#5A4A41] group-hover:text-white" />
            </button>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-16 px-4 md:px-8" data-animate>
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center gap-4 mb-8" data-animate>
            <img 
              src="/img1.jpg" 
              alt="Founder Photo" 
              className="w-20 h-20 rounded-full object-cover"
            />
            <img 
              src="/image 2.jpg" 
              alt="Founder Photo" 
              className="w-20 h-20 rounded-full object-cover"
            />
            <img 
              src="/img3.jpg" 
              alt="Founder Photo" 
              className="w-20 h-20 rounded-full object-cover"
            />
          </div>
          
          <h3 className="text-xl font-medium text-[#5A4A41] mb-6" data-animate>
            CATALINA BACIU, founder
          </h3>
          
          <div className="space-y-6 text-gray-600 text-sm leading-relaxed text-justify" data-animate>
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
              className="inline-block mt-8 bg-[#5A4A41] text-white px-8 py-3 rounded-lg 
                       hover:bg-[#E08F35] transition-colors text-sm uppercase tracking-wide"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Order Steps */}
      <section className="py-16" data-animate>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-[#5A4A41] rounded-lg p-8 text-white" data-animate>
              <div className="flex items-start gap-4">
                <span className="text-7xl font-light text-gray-400">1</span>
                <div>
                  <h4 className="text-xl font-medium mb-2">Place an order</h4>
                  <p className="text-sm text-gray-300">
                    Order Ecovluu products online on this website and pay for the order.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#5A4A41] rounded-lg p-8 text-white" data-animate>
              <div className="flex items-start gap-4">
                <span className="text-7xl font-light text-gray-400">2</span>
                <div>
                  <h4 className="text-xl font-medium mb-2">Expect delivery</h4>
                  <p className="text-sm text-gray-300">
                  Get your favorite Ecovluu products delivered quickly to your door!
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#5A4A41] rounded-lg p-8 text-white" data-animate>
              <div className="flex items-start gap-4">
                <span className="text-7xl font-light text-gray-400">3</span>
                <div>
                  <h4 className="text-xl font-medium mb-2">Start using products</h4>
                  <p className="text-sm text-gray-300">
                    Apply Shampoo & Hair Mask according to instructions
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-[#5A4A41] rounded-lg p-8 text-white" data-animate>
              <div className="flex items-start gap-4">
                <span className="text-7xl font-light text-gray-400">4</span>
                <div>
                  <h4 className="text-xl font-medium mb-2">Enjoy!</h4>
                  <p className="text-sm text-gray-300">
                    Enjoy the result: nourished, shiny and hydrated hair.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Section */}
      <section className="py-16 px-4 md:px-8 text-center" data-animate>
        <h2 className="text-[2.5rem] font-serif text-[#5A4A41] mb-4" data-animate>Free consultation</h2>
        <p className="text-[#8A7468] text-lg mb-8 max-w-2xl mx-auto" data-animate>
          Get free consultation with hair specialist with 25 years of experience in hair industry
        </p>
        <div data-animate>
          <a 
            href="https://wa.me/yourphonenumber" 
            className="inline-flex items-center gap-2 bg-[#5A4A41] text-white px-8 py-4 rounded-lg text-lg hover:bg-[#4A3A31] transition-colors"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Contact us now!
          </a>
        </div>
      </section>
    
    </Layout>
  );
};

export default AboutPage;
