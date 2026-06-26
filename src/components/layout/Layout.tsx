import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

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

  // Generate dynamic breadcrumbs based on current path
  const generateBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(p => p);
    
    const items = [
      { name: "Home", url: "/" }
    ];
    
    let currentPath = "";
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      
      // Format the name: capitalize first letter, replace hyphens with spaces
      let name = path.replace(/-/g, ' ');
      name = name.charAt(0).toUpperCase() + name.slice(1);
      
      // Handle specific routes for better names
      if (path === 'product' && index === 0) name = 'Products';
      
      items.push({
        name: name,
        url: currentPath
      });
    });
    
    return items;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <BreadcrumbSchema items={generateBreadcrumbs()} />
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
