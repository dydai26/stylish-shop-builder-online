import * as React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@/context/CartContext";
import { getFeaturedProducts } from "@/lib/api";
import OptimizedImage from "@/components/ui/OptimizedImage";

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const featuredProducts = await getFeaturedProducts();
        setProducts(featuredProducts);
      } catch (error) {
        console.error("Failed to load featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);


  if (loading) {
    return (
      <div className="py-12">
        <div className="container-custom">
          <h2 className="text-2xl font-bold mb-8 text-center">Deep Hydrating Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-gray-100 h-64 rounded-md animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Left side - Text and Products */}
          <div className="w-full lg:w-7/12">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-black text-center lg:text-left">Deep Hydrating Products</h2>
            <p className="text-black mb-6 md:mb-8 text-center lg:text-left">Natural hair care solutions</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {products.slice(0, 2).map(product => {
                const isInactive = product.status === 'inactive';
                return (
                  <Link key={product.id} to={`/product/${product.slug}`} className="flex h-full">
                    <Card className={`flex flex-col w-full h-full border border-gray-200 overflow-hidden shadow-none hover:shadow-md transition-shadow duration-300 ${isInactive ? 'grayscale opacity-75' : ''}`}>
                      <div className="relative">
                        <div className="absolute top-2 left-2 bg-white text-brand-orange text-xs uppercase py-1 px-2 rounded z-10">
                          {product.category}
                        </div>
                        {isInactive && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
                            <span className="bg-black/70 text-white px-3 py-1 rounded text-[10px] font-semibold uppercase tracking-wider">
                              OUT OF STOCK
                            </span>
                          </div>
                        )}
                        <OptimizedImage 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-80 sm:h-80 md:h-64 object-cover"
                        />
                      </div>
                      <CardContent className="p-3 md:p-4 flex flex-col flex-grow">
                        <h3 className="font-medium text-sm mb-2">{product.name}</h3>
                        <p className="text-xs md:text-sm mb-2 font-light text-gray-500 flex-grow">
                          {product.category === "shampoo" ? "For intense hydration" : "Repair damaged hair"}
                        </p>
                        <div className="flex justify-between items-center mt-auto pt-2">
                          <Button 
                            variant="default"
                            disabled={isInactive}
                            className={`${isInactive ? 'bg-gray-400 opacity-50' : 'bg-brand-orange hover:bg-brand-orange/90'} text-white text-xs h-7 px-2 md:px-3`}
                          >
                            {isInactive ? 'OUT OF STOCK' : 'SHOP NOW'}
                          </Button>
                          <span className="font-medium text-sm">€{product.price.toFixed(2)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 animate-fade-in mt-6 lg:mt-0 hidden lg:block">
          <OptimizedImage 
            src="/image22.jpg"
            alt="Woman with beautiful hydrated hair" 
            className="w-full h-64 md:h-80 lg:h-full object-cover lg:object-contain rounded-md mx-auto"
          />
        </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
