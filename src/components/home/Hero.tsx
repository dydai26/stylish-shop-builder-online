
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getBannerByLocation, type Banner } from "@/lib/bannersService";

const Hero = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Load banner data
    const loadBanner = async () => {
      try {
        const bannerData = await getBannerByLocation('/');
        setBanner(bannerData);
      } catch (error) {
        console.error('Error loading banner:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBanner();
  }, []);

  useEffect(() => {
    // Start animations only after image is loaded
    if (imageLoaded && !isLoading) {
      if (titleRef.current) {
        titleRef.current.classList.add('animate-fade-in');
      }
      if (buttonRef.current) {
        setTimeout(() => {
          buttonRef.current?.classList.add('animate-fade-in');
        }, 300);
      }
    }
  }, [imageLoaded, isLoading]);

  // Fallback to default image if no banner is loaded
  const backgroundImage = banner?.image || '/baner-home.jpg';
  const bannerTitle = banner?.title || 'WANT A HEALTHY & SHINY HAIR ENHANCED BY NATURAL HAIR CARE INGREDIENTS?';
  const bannerDescription = banner?.description;

  if (isLoading) {
    return (
      <div className="w-full overflow-hidden">
        <div className="relative block md:hidden w-full h-[400px] bg-gray-200 animate-pulse"></div>
        <div className="relative hidden md:block h-[75vh] bg-gray-200 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      {/* Mobile: full image, no top/bottom background, under header */}
      <div className="relative block md:hidden w-full">
        <img
          src={backgroundImage}
          alt="ECOVLUU natural hair care banner"
          className="w-full h-auto"
          loading="eager"
          fetchpriority="high"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-black/15"></div>
        <div className="absolute inset-0 flex items-center text-white">
          <div className="container-custom">
            <div className="max-w-xs">
              <h1
                ref={titleRef}
                className="text-xl font-bold mb-4 opacity-0 transition-all duration-1000 text-left leading-tight"
              >
                <div>WANT A HEALTHY &</div>
                <div>SHINY HAIR ENHANCED</div>
                <div>BY NATURAL INGREDIENTS?</div>
              </h1>
              {bannerDescription && (
                <p className="text-sm mb-4 opacity-90">{bannerDescription}</p>
              )}
              <div className="flex justify-start">
                <Link
                  ref={buttonRef}
                  to="/shop"
                  className="inline-block bg-white text-brand-brown font-medium px-4 py-2 text-sm rounded hover:bg-brand-orange hover:text-white transition-colors opacity-0 transition-all duration-700"
                >
                  SHOP NOW
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: background cover */}
      <div className="relative hidden md:block h-[75vh] bg-gray-200 w-full">
        <img
          src={backgroundImage}
          alt="ECOVLUU natural hair care banner"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          fetchpriority="high"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative h-full flex flex-col justify-center items-start text-white">
          <div className="container-custom">
            <div className="max-w-md">
              <h1
                className="text-4xl w-[650px] lg:text-5xl font-bold mb-6 opacity-100 transition-all duration-1000 text-left leading-tight"
              >
                <div>WANT A HEALTHY &</div>
                <div>SHINY HAIR ENHANCED</div>
                <div>BY NATURAL INGREDIENTS?</div>
              </h1>
              {bannerDescription && (
                <p className="text-lg mb-6 opacity-90">{bannerDescription}</p>
              )}
              <div className="flex justify-start">
                <Link
                  to="/shop"
                  className="inline-block bg-white text-brand-brown font-medium px-6 py-3 text-base rounded hover:bg-brand-orange hover:text-white transition-colors opacity-100 transition-all duration-700"
                >
                  SHOP NOW
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default Hero;