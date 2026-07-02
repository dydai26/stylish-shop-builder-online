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
      el.setAttribute('data-delay', (index * 40).toString());
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
      
      {/* Floating WhatsApp Button */}
      <a
        href="https://api.whatsapp.com/send/?phone=353871155291&text&type=phone_number&app_absent=0"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float-btn fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-3.5 sm:p-4 rounded-full shadow-lg hover:bg-[#20ba5a] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center"
        aria-label="Contact us on WhatsApp"
      >
        <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      <Footer />
    </div>
  );
};

export default Layout;
