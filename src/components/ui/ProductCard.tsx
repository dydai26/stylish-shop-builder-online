import React from "react";
import { Link } from "react-router-dom";
import { Product } from "@/context/CartContext";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import OptimizedImage from "@/components/ui/OptimizedImage";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const isInactive = product.status === 'inactive';

  const handleAddToCart = (e: React.MouseEvent) => {
    if (isInactive) return;
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className={`group flex flex-col h-full border border-gray-200 rounded-md overflow-hidden transition-all duration-300 ${isInactive ? 'grayscale opacity-75' : ''}`}>
      <div className="relative overflow-hidden shrink-0">
        <Link to={`/product/${product.slug}`}>
          <OptimizedImage
            src={product.images ? product.images[0] : product.image}
            alt={product.name}
            className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.category && (
            <span className="absolute top-2 left-2 bg-white text-brand-orange text-xs uppercase py-1 px-2 rounded">
              {product.category}
            </span>
          )}
          {isInactive && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <span className="bg-black/70 text-white px-4 py-2 rounded text-sm font-semibold uppercase tracking-wider">
                OUT OF STOCK
              </span>
            </div>
          )}
        </Link>
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-medium text-lg mb-1 text-black">{product.name}</h3>
        </Link>
        <div className="flex justify-between items-center mt-auto pt-4">
          <span className="font-bold text-lg">€{product.price.toFixed(2)}</span>
          <Button 
            onClick={handleAddToCart}
            variant="outline"
            disabled={isInactive}
            className={`text-brand-orange border-brand-orange ${isInactive ? 'opacity-50 cursor-not-allowed' : 'hover:bg-brand-orange hover:text-white'}`}
          >
            {isInactive ? 'OUT OF STOCK' : 'Add to cart'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
