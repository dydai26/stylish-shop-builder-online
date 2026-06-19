import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <Helmet>
        <title>Page Not Found - ECOVLUU</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      
      <div className="min-h-[70vh] flex items-center justify-center bg-white py-16 px-4">
        <div className="text-center max-w-lg mx-auto">
          <h1 className="text-9xl font-bold text-gray-100 mb-4">404</h1>
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">Oops! Page not found</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. 
            Don't worry, we still have plenty of amazing products for your hair!
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild variant="default" className="w-full sm:w-auto bg-brand-orange hover:bg-brand-orange/90 text-white border-0">
              <Link to="/">Return to Home</Link>
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link to="/shop">Go to Shop</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
