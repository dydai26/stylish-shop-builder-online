import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useCart, Product } from "@/context/CartContext";
import { getProductById, getProductBySlug, getRelatedProducts } from "@/lib/api";
import { Minus, Plus, ShoppingCart, Check } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import { toast } from "@/hooks/use-toast";
import { useTikTokTracking } from "@/hooks/useTikTokTracking";
import { useMetaTracking } from "@/hooks/useMetaTracking";
import { useGoogleTracking } from "@/hooks/useGoogleTracking";
import OptimizedImage from "@/components/ui/OptimizedImage";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();
  const { trackViewContent, trackAddToCart } = useTikTokTracking();
  const { trackViewContent: trackMetaViewContent } = useMetaTracking();
  const { trackViewItem: trackGoogleViewItem } = useGoogleTracking();

  useEffect(() => {
    const fetchProductData = async () => {
      if (!slug) return;

      setLoading(true);
      try {
        const productData = await getProductBySlug(slug);
        setProduct(productData);
        setSelectedImage(0);

        // Track product view
        if (productData) {
          trackViewContent({
            id: productData.id.toString(),
            name: productData.name,
            price: productData.price
          });
          
          trackMetaViewContent({
            id: productData.id.toString(),
            name: productData.name,
            price: productData.price
          });

          trackGoogleViewItem({
            id: productData.id.toString(),
            name: productData.name,
            price: productData.price,
            category: productData.category
          });

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
  }, [slug]);

  const handleIncreaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);

      // Track add to cart event
      trackAddToCart({
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        quantity: quantity
      });

      toast({
        title: "Added to cart",
        description: `${quantity} × ${product.name} added to your cart`,
      });
    }
  };

  const getAllImages = (): string[] => {
    if (!product) return [];
    const images = [product.image];
    if (product.images && Array.isArray(product.images)) {
      images.push(...product.images);
    }
    return images.filter(Boolean);
  };

  // Generate Product JSON-LD structured data for Google Merchant Center
  const generateProductJsonLd = () => {
    if (!product) return null;

    const allImages = getAllImages();
    const productUrl = `https://ecovluu.com/product/${product.slug}`;

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "description": product.description || `${product.name} - Premium hair care product from ECOVLUU`,
      "image": allImages.length > 0 ? allImages : [product.image],
      "sku": product.sku || `ECOVLUU-${product.id}`,
      "brand": {
        "@type": "Brand",
        "name": "ECOVLUU"
      },
      "category": product.category,
      "url": productUrl,
      "offers": {
        "@type": "Offer",
        "url": productUrl,
        "priceCurrency": "EUR",
        "price": product.price.toFixed(2),
        "availability": product.status === 'inactive' ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": "ECOVLUU"
        }
      }
    };

    return jsonLd;
  };

  if (loading) {
    return (
      <Layout>
        <div className="container-custom py-4 sm:py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-12">
            <div className="space-y-3 sm:space-y-4">
              <div className="aspect-square bg-gray-200 animate-pulse rounded-lg" />
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-16 sm:w-20 h-16 sm:h-20 bg-gray-200 animate-pulse rounded" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
              <div className="h-8 w-3/4 bg-gray-200 animate-pulse rounded" />
              <div className="h-6 w-1/4 bg-gray-200 animate-pulse rounded" />
              <div className="h-24 w-full bg-gray-200 animate-pulse rounded" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <Helmet>
          <title>Product Not Found - ECOVLUU</title>
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <div className="container-custom py-4 sm:py-8 lg:py-12 text-center">
          <h1 className="text-2xl font-bold text-black">Product Not Found</h1>
          <p className="text-black mt-4">The product you are looking for does not exist.</p>
          <Link to="/shop" className="text-brand-orange hover:underline mt-4 inline-block">
            Back to Shop
          </Link>
        </div>
      </Layout>
    );
  }

  const allImages = getAllImages();
  const productJsonLd = generateProductJsonLd();
  const isInactive = product.status === 'inactive';

  return (
    <Layout>
      {/* Product JSON-LD Structured Data for Google Merchant Center */}
      {productJsonLd && (
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify(productJsonLd)}
          </script>
        </Helmet>
      )}

      <div className="container-custom py-4 sm:py-8 lg:py-12">
        <div className="mb-4 sm:mb-6">
          <nav className="flex mb-4 sm:mb-8 overflow-x-auto" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 sm:space-x-2 md:space-x-3 text-sm sm:text-base whitespace-nowrap">
              <li className="inline-flex items-center">
                <Link to="/" className="text-black hover:text-brand-brown">
                  Home
                </Link>
              </li>
              <li className="flex items-center">
                <span className="mx-1 sm:mx-2 text-black">/</span>
                <Link to="/shop" className="text-black hover:text-brand-brown">
                  Shop
                </Link>
              </li>
              <li className="flex items-center">
                <span className="mx-1 sm:mx-2 text-black">/</span>
                <span className="text-black truncate">{product.name}</span>
              </li>
            </ol>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-3 sm:space-y-4">
            {/* Main Image */}
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <OptimizedImage
                src={allImages[selectedImage] || product.image}
                alt={product.name}
                className={`w-full h-full object-cover transition-all duration-300 ${isInactive ? 'grayscale opacity-75' : ''}`}
              />
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 sm:w-20 h-16 sm:h-20 flex-shrink-0 rounded overflow-hidden border-2 transition-colors ${selectedImage === index
                        ? 'border-brand-orange'
                        : 'border-transparent hover:border-gray-300'
                      } ${isInactive ? 'grayscale opacity-75' : ''}`}
                  >
                    <OptimizedImage
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="px-2 sm:px-0">
            <div className="text-brand-orange text-xs sm:text-sm font-medium uppercase mb-1">
              {product.category} Products
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-brand-brown mb-2 leading-tight">{product.name}</h1>

            <div className="flex items-center gap-4 mb-4 sm:mb-6">
              <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-brand-orange">€{product.price.toFixed(2)}</span>
              {isInactive && (
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wider">
                  OUT OF STOCK
                </span>
              )}
            </div>

            <div className="mb-4 sm:mb-6">
              <h3 className="text-black font-medium mb-2 text-sm sm:text-base">Description:</h3>
              <p className="text-black text-left text-sm sm:text-base leading-relaxed">{product.description}</p>
            </div>

            {/* Quantity Selector */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex items-center border border-gray-300 rounded-md w-fit">
                <button
                  onClick={handleDecreaseQuantity}
                  className="px-3 py-2 hover:bg-gray-100 touch-manipulation"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-2 border-l border-r border-gray-300 min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={handleIncreaseQuantity}
                  className="px-3 py-2 hover:bg-gray-100 touch-manipulation"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={isInactive}
                className={`${isInactive ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-orange hover:bg-brand-orange/90'} text-white py-3 px-6 text-sm sm:text-base w-full sm:w-auto`}
              >
                {isInactive ? 'OUT OF STOCK' : 'Buy Now'}
              </Button>
            </div>

            {/* SKU and Category */}
            <div className="text-sm text-black mb-4">
              <p><span className="font-medium">SKU:</span> {product.sku || `DP-HYD-${product.name}`}</p>
              <p><span className="font-medium">Category:</span> {product.category} Products</p>
            </div>

            {/* Tags */}
            {product.tags && (
              <div className="mb-6">
                <p className="text-sm text-black">
                  <span className="font-medium">Tags:</span> {product.tags.join(', ')}
                </p>
              </div>
            )}

            {/* Key Benefits */}
            {product.benefits && product.benefits.length > 0 && (
              <div className="mb-6">
                <h3 className="text-black font-medium mb-3 text-sm sm:text-base">Key Benefits:</h3>
                <ul className="space-y-2">
                  {product.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="text-green-500 flex-shrink-0 mt-0.5" size={16} />
                      <span className="text-black text-sm sm:text-base">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Usage */}
            {product.usage && (
              <div className="mb-6">
                <h3 className="text-black font-medium mb-2 text-sm sm:text-base">How to Use:</h3>
                <p className="text-black text-sm sm:text-base leading-relaxed">{product.usage}</p>
              </div>
            )}

            {/* Ingredients */}
            {product.ingredients && (
              <div className="mb-6">
                <h3 className="text-black font-medium mb-2 text-sm sm:text-base">Key Ingredients:</h3>
                <p className="text-black text-sm sm:text-base leading-relaxed">{product.ingredients}</p>
              </div>
            )}

            {/* Patch Test Advice */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-800 text-xs sm:text-sm">
                <strong>Patch Test Recommended:</strong> Before first use, apply a small amount to a discreet area and wait 24 hours to check for any adverse reactions.
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-8 sm:mt-12 lg:mt-16">
            <h2 className="text-xl sm:text-2xl font-bold text-brand-brown mb-4 sm:mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id}>
                  <ProductCard product={relatedProduct} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetail;