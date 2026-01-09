import { Link } from "react-router-dom";

const AboutSection = () => {
  return (
    <div className="py-6 sm:py-8 md:py-12 bg-white w-full overflow-hidden">
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 max-w-full mx-auto">
        {/* Header Section */}
        <div className="mb-4 sm:mb-6 md:mb-8 text-center md:text-center" data-animate>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-brand-brown">Discover Natural Hair Care</h2>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-4 sm:gap-y-6">
    {/* Ліва колонка */}
    <div className="space-y-4 sm:space-y-6">
      <div className="flex gap-3 sm:gap-4 items-start">
        <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-md overflow-hidden flex-shrink-0">
          <img src="/_DSC8533.jpg" alt="Natural ingredients" loading="lazy" decoding="async" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-sm sm:text-base md:text-lg text-left mb-1 sm:mb-2">The Benefits of Natural Ingredients</h3>
          <p className="text-black text-xs sm:text-sm md:text-base text-left leading-relaxed">
            Our products are made with organic ingredients to nourish your hair.
          </p>
        </div>
      </div>

      <div className="flex gap-3 sm:gap-4 items-start">
        <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-md overflow-hidden flex-shrink-0">
          <img src="/image container.jpg" alt="Key ingredients" loading="lazy" decoding="async" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-sm sm:text-base md:text-lg text-left mb-1 sm:mb-2">Key Ingredients for Hair Health</h3>
          <p className="text-black text-xs sm:text-sm md:text-base text-left leading-relaxed">
            Learn about the essential oils and extracts that make our products effective.
          </p>
        </div>
      </div>
    </div>

    {/* Права колонка */}
    <div className="space-y-4 sm:space-y-6 mt-0  md:mt-0">
      <div className="flex gap-3 sm:gap-4 items-start">
        <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-md overflow-hidden flex-shrink-0">
          <img src="/image 2.jpg" alt="Brand founder" loading="lazy" decoding="async" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-sm sm:text-base md:text-lg text-left mb-1 sm:mb-2 ">Developed by Professionals</h3>
          <p className="text-black text-xs sm:text-sm md:text-base text-left leading-relaxed">
            Find out more about brand founder with 25 years of experience in the industry.
          </p>
        </div>
      </div>

      <div className="flex gap-3 sm:gap-4 items-start">
        <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-md overflow-hidden flex-shrink-0">
          <img src="/image 11.jpg" alt="Expert advice" loading="lazy" decoding="async" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-sm sm:text-base md:text-lg text-left mb-1 sm:mb-2">Expert Advice on Hair Care</h3>
          <p className="text-black text-xs sm:text-sm md:text-base text-left leading-relaxed">
            Free consultation from our professionals on how to maintain healthy hair.
          </p>
        </div>
      </div>
    </div>
    </div>
          {/* Кнопка по центру */}
          <div className="flex justify-center mt-6 sm:mt-8">
      <Link
        to="/about"
        className="text-center inline-block bg-brand-orange text-white font-semibold py-2 sm:py-2 px-6 sm:px-8 rounded-lg shadow-md hover:bg-brand-orange transition text-sm sm:text-base"
      >
        Learn more
      </Link>
      </div>
        </div>
      </div>
    </div>
  

  );
};

export default AboutSection;
