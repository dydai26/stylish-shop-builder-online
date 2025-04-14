import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useCart, Product } from "@/context/CartContext";
import { getProductById, getRelatedProducts } from "@/lib/api";
import { Minus, Plus, ShoppingCart, Check } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import { toast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const productData = await getProductById(parseInt(id));
        setProduct(productData);
        setSelectedImage(0);
        
        if (productData) {
          const related = await getRelatedProducts(productData.category);
          setRelatedProducts(related.filter(p => p.id !== productData.id).slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
    // Reset quantity when product changes
    setQuantity(1);
  }, [id]);

  const handleIncreaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart(product, quantity);
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} has been added to your cart.`,
    });
  };

  const renderThumbnails = () => {
    if (!product || !product.images) return null;
    
    return product.images.map((image, index) => (
      <div 
        key={index} 
        className={`border cursor-pointer mb-2 p-1 ${selectedImage === index ? 'border-brand-orange' : 'border-gray-200'}`}
        onClick={() => setSelectedImage(index)}
      >
        <img 
          src={image} 
          alt={`${product.name} thumbnail ${index + 1}`} 
          className="w-full h-20 object-cover"
        />
      </div>
    ));
  };

  if (loading) {
    return (
      <Layout>
        <div className="container-custom py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-gray-100 h-96 rounded-md animate-pulse"></div>
            <div>
              <div className="h-8 bg-gray-100 rounded mb-4 animate-pulse"></div>
              <div className="h-6 bg-gray-100 rounded mb-4 w-1/4 animate-pulse"></div>
              <div className="h-4 bg-gray-100 rounded mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-100 rounded mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-100 rounded mb-4 w-3/4 animate-pulse"></div>
              <div className="h-10 bg-gray-100 rounded w-1/2 mt-6 animate-pulse"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container-custom py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="mb-6">Sorry, the product you are looking for doesn't exist or has been removed.</p>
          <Link to="/shop" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-custom py-12">
        <div className="mb-6">
          <nav className="flex mb-8" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/" className="text-gray-700 hover:text-brand-brown">
                  Home
                </Link>
              </li>
              <li className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <Link to="/shop" className="text-gray-700 hover:text-brand-brown">
                  Shop
                </Link>
              </li>
              <li className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-500">{product.name}</span>
              </li>
            </ol>
          </nav>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Images - Updated Layout */}
          <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="bg-gray-50 p-0 rounded-lg flex items-center justify-center w-full h-[490px]">
              <img
                src={product.images ? product.images[selectedImage] : product.image}
                alt={product.name}
                className="w-full h-full object-cover mx-auto"
              />
            </div>
            
            {/* Thumbnails Row */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.map((image, index) => (
                  <div 
                    key={index} 
                    className={`cursor-pointer border p-1 rounded ${
                      selectedImage === index ? 'border-brand-orange' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} thumbnail ${index + 1}`} 
                      className="w-full h-18 object-scale-down"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="text-brand-orange text-sm font-medium uppercase mb-1">
              {product.category} Products
            </div>
            
            <h1 className="text-2xl font-bold text-brand-brown mb-2">{product.name}</h1>
            
            <div className="flex items-center gap-2 mb-4">
              <span className="text-gray-400 line-through">€{(product.price * 1.2).toFixed(2)}</span>
              <span className="text-2xl font-bold text-brand-orange">€{product.price.toFixed(2)}</span>
            </div>
            
            <div className="mb-6">
              <h3 className="text-brand-brown font-medium mb-1">Description:</h3>
              <p className="text-gray-600 text-left">{product.description}</p>
            </div>
            
            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={handleDecreaseQuantity}
                  className="px-3 py-1 hover:bg-gray-100"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-1 border-l border-r border-gray-300">
                  {quantity}
                </span>
                <button
                  onClick={handleIncreaseQuantity}
                  className="px-3 py-1 hover:bg-gray-100"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
              
              <Button
                onClick={handleAddToCart}
                className="bg-brand-orange hover:bg-brand-orange/90 text-white"
              >
                Buy Now
              </Button>
            </div>
            
            {/* SKU and Category */}
            <div className="text-sm text-gray-600 mb-4">
              <p><span className="font-medium">SKU:</span> {product.sku || `DP-HYD-${product.id}`}</p>
              <p><span className="font-medium">Category:</span> {product.category} Products</p>
            </div>
            
            {/* Tags */}
            {product.tags && (
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Tags:</span> {product.tags.join(', ')}
                </p>
              </div>
            )}
            
            {/* Secure Checkout */}
            <div className="border border-gray-200 rounded-md p-4 mb-6">
              <h3 className="font-medium text-center mb-3">Guaranteed Safe Checkout</h3>
              <div className="flex justify-center gap-2">
                <img src="/Item4 → SVG.png" alt="Visa" className="h-8" />
                <img src="/Item3 → SVG.png" alt="Mastercard" className="h-8" />
                <img src="/Item2 → SVG.png" alt="American Express" className="h-8" />
                <img src="/Item → SVG.png" alt="Discover" className="h-8" />
              </div>
            </div>
            
            {/* Shipping Info */}
            <div className="mb-6">
              <p className="font-medium mb-2">Free shipping on orders over €100!</p>
              <ul className="space-y-1">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span>No-Risk Money Back Guarantee</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span>No-Hassle Returns</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span>Secure Payments</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Product Details Sections */}
        <div className="mt-12 border-t pt-8">
          {/* Key Benefits */}
          {product.benefits && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-brand-brown mb-4">Key Benefits</h2>
              <ul className="list-disc pl-5 space-y-2">
                {product.benefits.map((benefit, index) => (
                  <li key={index} className="text-gray-600 text-left">{benefit}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* How to Use */}
          {product.usage && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-brand-brown mb-4">How to Use</h2>
              <p className="text-gray-600">{product.usage}</p>
            </div>
          )}
          
          {/* Ingredients */}
          {product.ingredients && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-brand-brown mb-4">Full Ingredients List</h2>
              <p className="text-gray-600 text-left">{product.ingredients}</p>
            </div>
          )}
          
          {/* Patch Test Advice */}
          <div className="mb-8 p-4 bg-amber-50 border border-amber-100 rounded-md">
            <h2 className="text-xl font-bold text-brand-brown mb-2">Patch Test Advice</h2>
            <p className="text-gray-600">Always perform a patch test before using any new hair care product to check for sensitivities.</p>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 border-t pt-8">
            <h2 className="text-2xl font-bold text-brand-brown mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetail;
