import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from 'react';
import './App.css';
import Index from "@/pages/Index";
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Shop from '@/pages/Shop';
import ProductDetail from '@/pages/ProductDetail';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import OrderSuccess from '@/pages/OrderSuccess';
import Reviews from "@/pages/Reviews";
import NotFound from "@/pages/NotFound";
import TermsAndConditions from "@/pages/TermsAndConditions";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import ReturnsAndRefundPolicy from "@/pages/ReturnsAndRefundPolicy";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/context/CartContext";
import { OrderProvider } from "@/context/OrderContext";
import { ReviewsProvider } from "@/context/ReviewsContext";

// Create a client
import IntroAnimation from "@/components/intro/IntroAnimation";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [contentLoaded, setContentLoaded] = useState(false);

  useEffect(() => {
    // Check if this is the first visit in this session
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
    
    if (hasSeenIntro) {
      setShowIntro(false);
      setContentLoaded(true);
    } else {
      // Set flag in session storage
      sessionStorage.setItem('hasSeenIntro', 'true');
    }
  }, []);

  const handleAnimationComplete = () => {
    setShowIntro(false);
    setContentLoaded(true);
  };

  return (
    <>
      {showIntro && <IntroAnimation onAnimationComplete={handleAnimationComplete} />}
      
      <div className={`transition-opacity duration-500 ${contentLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <Router>
          <QueryClientProvider client={queryClient}>
            <CartProvider>
              <OrderProvider>
                <ReviewsProvider>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-success" element={<OrderSuccess />} />
                    <Route path="/reviews" element={<Reviews />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <Toaster />
                </ReviewsProvider>
              </OrderProvider>
            </CartProvider>
          </QueryClientProvider>
        </Router>
      </div>
    </>
  );
}

export default App;