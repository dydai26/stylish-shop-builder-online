
import { Link } from "react-router-dom";
import { Product } from "@/context/CartContext";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="group border border-gray-200 rounded-md overflow-hidden">
      <div className="relative overflow-hidden">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.images ? product.images[0] : product.image}
            alt={product.name}
            className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.category && (
            <span className="absolute top-2 left-2 bg-brand-orange text-white text-xs uppercase py-1 px-2 rounded">
              {product.category}
            </span>
          )}
        </Link>
      </div>
      
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-medium text-lg mb-1 text-brand-brown">{product.name}</h3>
        </Link>
        <div className="flex justify-between items-center mt-4">
          <span className="font-bold text-lg">€{product.price.toFixed(2)}</span>
          <Button 
            onClick={handleAddToCart}
            variant="outline"
            className="text-brand-orange border-brand-orange hover:bg-brand-orange hover:text-white"
          >
            Add to cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
