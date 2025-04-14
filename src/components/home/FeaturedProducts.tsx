import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@/context/CartContext";
import { useCart } from "@/context/CartContext";
import { getFeaturedProducts } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

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

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    // Stop propagation to prevent navigation when clicking the button
    e.stopPropagation();
    
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

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
    <section className="py-12 bg-white">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side - Text and Products */}
          <div className="w-full lg:w-7/12">
            <h2 className="text-3xl font-bold mb-2 text-brand-brown">Deep Hydrating Products</h2>
            <p className="text-gray-600 mb-8">Natural hair care solutions</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.slice(0, 2).map(product => (
                <Link key={product.id} to={`/product/${product.id}`}>
                  <Card className="border border-gray-200 overflow-hidden shadow-none hover:shadow-md transition-shadow duration-300">
                    <div className="relative">
                      <div className="absolute top-2 left-2 bg-brand-orange text-white text-xs uppercase py-1 px-2 rounded">
                        {product.category}
                      </div>
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-57 object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium text-sm mb-2">{product.name}</h3>
                      <p className="text-sm mb-2 font-light text-gray-500">
                        {product.category === "shampoo" ? "For intense hydration" : "Repair damaged hair"}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <Button 
                          onClick={(e) => handleAddToCart(product, e)}
                          variant="default"
                          className="bg-brand-orange hover:bg-brand-orange/90 text-white text-xs h-7 px-3"
                        >
                          SHOP NOW
                        </Button>
                        <span className="font-medium text-sm">€{product.price.toFixed(2)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Right side - Large image */}
          <div className="w-full lg:w-1/2 animate-fade-in hidden lg:block">
            <img 
              src="/image container.jpg"
              alt="Woman with beautiful hydrated hair" 
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
