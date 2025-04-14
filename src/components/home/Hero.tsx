
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.classList.add('animate-fade-in');
    }
    if (buttonRef.current) {
      setTimeout(() => {
        buttonRef.current?.classList.add('animate-fade-in');
      }, 500); // Delay button animation by 500ms
    }
  }, []);

  return (
    <div className="relative h-[75vh] bg-cover bg-center w-full overflow-hidden" style={{ backgroundImage: 'url(/baner-home.jpg)' }}>
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      
      <div className="relative h-full flex flex-col justify-center items-start text-white px-4 md:px-8 lg:px-12 max-w-full">
        <div className="max-w-lg">
          <h1 
            ref={titleRef}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 opacity-0 transition-all duration-1000 text-left"
          >
            WANT A HEALTHY <br/> & SHINY HAIR ENHANCED BY NATURAL HAIR CARE INGREDIENTS?
          </h1>
          
          {/* Кнопка під текстом, вирівняна по лівому краю */}
          <div className="flex justify-start ">
            <Link 
              ref={buttonRef}
              to="/shop" 
              className="inline-block bg-white text-brand-brown font-medium px-6 py-3 rounded hover:bg-brand-orange hover:text-white transition-colors opacity-0 transition-all duration-700"
            >
              SHOP NOW
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default Hero;
