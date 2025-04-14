import { ReactNode, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  useEffect(() => {
    // Add scroll animation effect with improved timing
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.10 // Increased threshold for better trigger timing
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add a delay based on the element's position to stagger animations
          const delay = parseInt(entry.target.getAttribute('data-delay') || '0');
          
          setTimeout(() => {
            entry.target.classList.add('animate-fade-in');
          }, delay);
          
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Select all sections with data-animate attribute
    const animateElements = document.querySelectorAll('[data-animate]');
    animateElements.forEach((el, index) => {
      el.classList.add('opacity-0');
      // Add a data-delay attribute with staggered delays
      el.setAttribute('data-delay', (index * 120).toString());
      observer.observe(el);
    });

    return () => {
      animateElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
