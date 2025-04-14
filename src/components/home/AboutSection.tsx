import { Link } from "react-router-dom";

const AboutSection = () => {
  return (
    <div className="py-8 sm:py-12 bg-white w-full overflow-hidden">
      <div className="px-4 md:px-8 lg:px-12 max-w-full mx-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8" data-animate>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-brand-brown">Discover Natural Hair Care</h2>
          <p className="text-brand-orange">Learn more about our brand</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          {/* Left Column */}
          <div className="space-y-4 sm:space-y-6">
            {/* Benefits of Natural Ingredients */}
            <div className="flex flex-row gap-4 items-start mt-0 sm:mt-18" data-animate>
              <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                <img src="/_DSC8533.jpg" alt="Natural ingredients" className="w-full h-full object-cover" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">The Benefits of Natural Ingredients</h3>
                <p className="text-gray-600 text-sm">
                  Our products are made with organic ingredients to nourish your hair.
                </p>
              </div>
            </div>
            
           {/* Key Ingredients */}
           <div className="flex flex-row gap-4 items-start" data-animate>
              <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                <img src="/image container.jpg" alt="Key ingredients" className="w-full h-full object-cover" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Key Ingredients for Hair Health</h3>
                <p className="text-gray-600 text-sm">
                  Learn about the essential oils and extracts that make our products effective.
                </p>
              </div>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-4 sm:space-y-6 mt-4 md:mt-0">
            {/* Developed by Professionals */}
            <div className="flex flex-row gap-4 items-start" data-animate>
              <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                <img src="/image 2.jpg" alt="Brand founder" className="w-full h-full object-cover" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Developed by Professionals</h3>
                <p className="text-gray-600 text-sm">
                  Find out more about brand founder with 25 years of experience in the industry.
                </p>
              </div>
            </div>
            
            {/* Expert Advice */}
            <div className="flex flex-row gap-4 items-start" data-animate>
              <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                <img src="/image 11.jpg" alt="Expert advice" className="w-full h-full object-cover" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Expert Advice on Hair Care</h3>
                <p className="text-gray-600 text-sm">
                  Free consultation from our professionals on how to maintain healthy hair.
                </p>
                <Link to="/about" className="text-brand-orange hover:underline text-sm mt-2 inline-block">
                  Learn more
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
