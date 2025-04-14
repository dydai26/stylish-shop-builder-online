import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/ui/ProductCard";
import { Product } from "@/context/CartContext";
import { getAllProducts } from "@/lib/api";

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const searchQuery = searchParams.get("search");
  
  const categories = ["shampoo", "mask"];

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const allProducts = await getAllProducts();
        setProducts(allProducts);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Create a filter based on the selected category and search query
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    const matchesSearch = searchQuery
      ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      <div className="bg-gray-50 py-8">
        <div className="container-custom">
          <h1 className="text-3xl font-bold mb-6">Shop Our Products</h1>
          
          {searchQuery && (
            <div className="mb-6">
              <p className="text-gray-600">Search results for: <span className="font-semibold">{searchQuery}</span></p>
            </div>
          )}
          
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full ${
                !selectedCategory
                  ? "bg-brand-brown text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              All Products
            </button>
            
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full capitalize ${
                  selectedCategory === category
                    ? "bg-brand-brown text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white h-80 rounded-md animate-pulse"></div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
