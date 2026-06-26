import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import DeliveryAnnouncement from "@/components/ui/DeliveryAnnouncement";
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
      <Helmet>
        <title>Natural Hydrating Shampoo & Best Hair Mask Buy At Best Deals</title>
        <meta name="description" content="Healthy, gorgeous hair is just awash away! Our best hair care shampoo and hair repair mask are made to restore, hydrate & revive every single strand. Shop now!" />
        <meta name="keywords" content="natural hair care, hair products, organic shampoo, hair mask, deep hydrating, ECOVLUU" />
        <link rel="canonical" href="https://www.ecovluu.com/shop" />
      </Helmet>
      <DeliveryAnnouncement />
      <div className="bg-gray-50 py-4 sm:py-8">
        <div className="container-custom">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center sm:text-left">Shop Our Products</h1>
          
          {searchQuery && (
            <div className="mb-4 sm:mb-6">
              <p className="text-black text-sm sm:text-base text-center sm:text-left">
                Search results for: <span className="font-semibold">{searchQuery}</span>
              </p>
            </div>
          )}
          
          <div className="mb-6 sm:mb-8 flex flex-wrap gap-2 justify-center sm:justify-start">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 sm:px-4 py-2 rounded-full text-sm sm:text-base ${
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
                className={`px-3 sm:px-4 py-2 rounded-full capitalize text-sm sm:text-base ${
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white h-80 rounded-md animate-pulse"></div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {filteredProducts.map(product => (
                <div key={product.id}><ProductCard product={product} /></div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-500 text-sm sm:text-base px-4">No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Shop;