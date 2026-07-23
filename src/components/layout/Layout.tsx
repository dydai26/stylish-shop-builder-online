import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import CustomChatbot from "@/components/ui/CustomChatbot";

interface LayoutProps {
  children: ReactNode;
}

const GLOBAL_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.ecovluu.com/#organization",
      "name": "Ecovluu",
      "url": "https://www.ecovluu.com/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.ecovluu.com/Layer_1.png",
        "inLanguage": "en"
      },
      "description": "Hair care products developed by professionals. Deep hydration and hair restoration with EcoVluu - shampoos and rich masks for dry, damaged, and colour-treated hair.",
      "email": "info@ecovluu.com",
      "foundingDate": "2022",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "email": "info@ecovluu.com",
        "availableLanguage": ["English"],
        "areaServed": [
          { "@type": "Country", "name": "Ireland" },
          { "@type": "Country", "name": "Austria" },
          { "@type": "Country", "name": "Belgium" },
          { "@type": "Country", "name": "Bulgaria" },
          { "@type": "Country", "name": "Croatia" },
          { "@type": "Country", "name": "Cyprus" },
          { "@type": "Country", "name": "Czech Republic" },
          { "@type": "Country", "name": "Denmark" },
          { "@type": "Country", "name": "Estonia" },
          { "@type": "Country", "name": "Finland" },
          { "@type": "Country", "name": "France" },
          { "@type": "Country", "name": "Germany" },
          { "@type": "Country", "name": "Greece" },
          { "@type": "Country", "name": "Hungary" },
          { "@type": "Country", "name": "Italy" },
          { "@type": "Country", "name": "Latvia" },
          { "@type": "Country", "name": "Lithuania" },
          { "@type": "Country", "name": "Luxembourg" },
          { "@type": "Country", "name": "Malta" },
          { "@type": "Country", "name": "Netherlands" },
          { "@type": "Country", "name": "Poland" },
          { "@type": "Country", "name": "Portugal" },
          { "@type": "Country", "name": "Romania" },
          { "@type": "Country", "name": "Slovakia" },
          { "@type": "Country", "name": "Slovenia" },
          { "@type": "Country", "name": "Spain" },
          { "@type": "Country", "name": "Sweden" }
        ]
      },
      "sameAs": [
        "https://www.facebook.com/people/Ecovluu/100089921524516/",
        "https://www.instagram.com/ecovluu/",
        "https://www.tiktok.com/@ecovluu"
      ]
    },
    {
      "@type": ["LocalBusiness", "Store"],
      "@id": "https://www.ecovluu.com/#localbusiness",
      "name": "Ecovluu",
      "url": "https://www.ecovluu.com/",
      "parentOrganization": { "@id": "https://www.ecovluu.com/#organization" },
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.ecovluu.com/Layer_1.png"
      },
      "image": "https://www.ecovluu.com/baner-home.jpg",
      "description": "Hair care products developed by professionals. Deep hydration and hair restoration with EcoVluu - shampoos and rich masks for dry, damaged, and colour-treated hair.",
      "email": "info@ecovluu.com",
      "priceRange": "$ - $$$",
      "currenciesAccepted": "EUR",
      "paymentAccepted": "Cash, Credit Card, Debit Card",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "A6, Block A, Santry Business Park, Swords Road, Santry",
        "addressLocality": "Dublin",
        "postalCode": "D09",
        "addressRegion": "Dublin 9",
        "addressCountry": "IE"
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
          "opens": "09:00",
          "closes": "17:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "Saturday",
          "opens": "10:00",
          "closes": "16:00"
        }
      ],
      "areaServed": [
        { "@type": "Country", "name": "Ireland" },
        { "@type": "Country", "name": "Austria" },
        { "@type": "Country", "name": "Belgium" },
        { "@type": "Country", "name": "Bulgaria" },
        { "@type": "Country", "name": "Croatia" },
        { "@type": "Country", "name": "Cyprus" },
        { "@type": "Country", "name": "Czech Republic" },
        { "@type": "Country", "name": "Denmark" },
        { "@type": "Country", "name": "Estonia" },
        { "@type": "Country", "name": "Finland" },
        { "@type": "Country", "name": "France" },
        { "@type": "Country", "name": "Germany" },
        { "@type": "Country", "name": "Greece" },
        { "@type": "Country", "name": "Hungary" },
        { "@type": "Country", "name": "Italy" },
        { "@type": "Country", "name": "Latvia" },
        { "@type": "Country", "name": "Lithuania" },
        { "@type": "Country", "name": "Luxembourg" },
        { "@type": "Country", "name": "Malta" },
        { "@type": "Country", "name": "Netherlands" },
        { "@type": "Country", "name": "Poland" },
        { "@type": "Country", "name": "Portugal" },
        { "@type": "Country", "name": "Romania" },
        { "@type": "Country", "name": "Slovakia" },
        { "@type": "Country", "name": "Slovenia" },
        { "@type": "Country", "name": "Spain" },
        { "@type": "Country", "name": "Sweden" }
      ],
      "sameAs": [
        "https://www.facebook.com/people/Ecovluu/100089921524516/",
        "https://www.instagram.com/ecovluu/",
        "https://www.tiktok.com/@ecovluu"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://www.ecovluu.com/#website",
      "url": "https://www.ecovluu.com/",
      "name": "Ecovluu",
      "description": "Premium hair care products developed by professionals.",
      "publisher": { "@id": "https://www.ecovluu.com/#organization" },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://www.ecovluu.com/?s={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      },
      "inLanguage": "en"
    }
  ]
};

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
      let url = currentPath;
      
      // Handle specific routes for better names and paths (like Shop at position 2)
      if (path === 'product' && index === 0) {
        name = 'Shop';
        url = '/shop';
      }
      
      items.push({
        name: name,
        url: url
      });
    });
    
    return items;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(GLOBAL_SCHEMA)}
        </script>
      </Helmet>
      <BreadcrumbSchema items={generateBreadcrumbs()} />
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Custom Chatbot Widget */}
      <CustomChatbot />

      <Footer />
    </div>
  );
};

export default Layout;
