import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <>
    <footer className="bg-[#4A3F3B] text-white py-10">
      <div className="container mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Contact Information */}
          <div className="md:col-span-1">
            <img src="/Layer_2.png" alt="ECOVLUU" className="h-14 mb-3 text-left" />
            <p className="text-sm mb-2 font-light text-left ">info@ecovluu.com</p>
            <address className="not-italic text-sm font-light text-left">
              A6, Block A, Santry Business Park,<br/>
              Swords Road, Santry,<br />
              Dublin 9, Ireland
            </address>
          </div>
          
          {/* Navigation */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium mb-4 text-left">Navigation</h3>
            <ul className="space-y-2 text-sm font-light text-left">
              <li><Link to="/" className="hover:text-gray-300 transition-colors">Home</Link></li>
              <li><Link to="/shop" className="hover:text-gray-300 transition-colors">Shop</Link></li>
              <li><Link to="/about" className="hover:text-gray-300 transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-gray-300 transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium mb-4 text-left">Quick Links</h3>
            <ul className="space-y-2 text-sm font-light text-left">
              <li><Link to="/terms" className="hover:text-gray-300 transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/returns" className="hover:text-gray-300 transition-colors">Returns & Refund Policy</Link></li>
            </ul>
          </div>

          {/* Connect with us */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium mb-4 text-left">Connect with us</h3>
            <div className="flex space-x-4 text-left">
              <a href="https://www.facebook.com/profile.php?id=100089921524516" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
                <Facebook size={18} />
              </a>
              <a href="https://www.instagram.com/ecovluu/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
                <Instagram size={18} />
              </a>
             
              <a href="https://www.tiktok.com/@Ecovlu" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
                <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
    <div className="bg-white text-center text-sm text-[#4A3F3B] py-4 border-t border-[#ddd]">
    Copyright © 2025 Ecovluu | Powered by Ecovluu
  </div>
</>
  );
};

export default Footer;
