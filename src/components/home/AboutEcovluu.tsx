import { Link } from "react-router-dom";

const AboutEcovluu = () => {
  return (
    <section className="py-8 sm:py-12 md:py-16 bg-white w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12" data-animate>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-brown">
            About Ecovluu
          </h2>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            The story behind our natural hair care
          </p>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Left Column: Image */}
          <div className="w-full" data-animate>
            <div className="rounded-xl overflow-hidden shadow-md aspect-[4/3] w-full bg-brand-brown/10">
              <img
                src="/2.png"
                alt="About Ecovluu - Our story"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>

          {/* Right Column: Text & Badges */}
          <div className="flex flex-col items-start space-y-6 md:space-y-8 text-left" data-animate>
            <div className="space-y-4 text-gray-700 text-sm sm:text-base leading-relaxed">
              <p>
                Ecovluu was founded on a simple belief: healthy hair shouldn't come
                at the cost of harsh chemicals. Every formula is developed with a
                hair specialist who brings 25 years of industry experience.
              </p>
              <p>
                Recommended by professionals and loved by customers, we make
                natural hair care that genuinely works.
              </p>
            </div>

            {/* Badges/Pills */}
            <div className="flex flex-wrap gap-2.5 sm:gap-3">
              <span className="px-4 py-2 border border-gray-200 rounded-full text-xs sm:text-sm font-medium text-brand-brown bg-gray-50/50">
                100% natural
              </span>
              <span className="px-4 py-2 border border-gray-200 rounded-full text-xs sm:text-sm font-medium text-brand-brown bg-gray-50/50">
                Cruelty free
              </span>
              <span className="px-4 py-2 border border-gray-200 rounded-full text-xs sm:text-sm font-medium text-brand-brown bg-gray-50/50">
                25 yrs expertise
              </span>
            </div>

            {/* Button */}
            <div>
              <Link
                to="/about"
                onClick={() => window.scrollTo(0, 0)}
                className="inline-block bg-brand-orange text-white font-semibold py-2.5 px-6 sm:px-8 rounded-lg shadow-sm hover:bg-brand-orange/95 hover:shadow transition-all duration-200 text-sm sm:text-base text-center"
              >
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutEcovluu;
