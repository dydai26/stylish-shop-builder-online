import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import './App.css';
import Index from "@/pages/Index";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/context/CartContext";
import { OrderProvider } from "@/context/OrderContext";
import { ReviewsProvider } from "@/context/ReviewsContext";
import { AdminProvider } from "@/context/AdminContext";
import AdminDashboard from "@/pages/AdminDashboard";
import { usePageTracking } from "@/hooks/usePageTracking";

// Lazy load heavy components
const About = React.lazy(() => import('@/pages/About'));
const Contact = React.lazy(() => import('@/pages/Contact'));
const Shop = React.lazy(() => import('@/pages/Shop'));
const Blog = React.lazy(() => import('@/pages/Blog'));
const BlogPost = React.lazy(() => import('@/pages/BlogPost'));
const ProductDetail = React.lazy(() => import('@/pages/ProductDetail'));
const Cart = React.lazy(() => import('@/pages/Cart'));
const Checkout = React.lazy(() => import('@/pages/Checkout'));
const OrderSuccess = React.lazy(() => import('@/pages/OrderSuccess'));
const Reviews = React.lazy(() => import("@/pages/Reviews"));
const Login = React.lazy(() => import('@/pages/Login'));
// AdminDashboard eagerly imported above to avoid dynamic import fetch issues
const NotFound = React.lazy(() => import("@/pages/NotFound"));
const TermsAndConditions = React.lazy(() => import("@/pages/TermsAndConditions"));
const PrivacyPolicy = React.lazy(() => import("@/pages/PrivacyPolicy"));
const ReturnsAndRefundPolicy = React.lazy(() => import("@/pages/ReturnsAndRefundPolicy"));

// Create a client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

const AppContent = () => {
  usePageTracking();
  
  return (
    <>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        </div>
      }>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/returns" element={<ReturnsAndRefundPolicy />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster />
    </>
  );
};

const App = () => {
  return (
    <HelmetProvider>
      <Router>
        <QueryClientProvider client={queryClient}>
          <AdminProvider>
            <CartProvider>
              <OrderProvider>
                <ReviewsProvider>
                  <AppContent />
                </ReviewsProvider>
              </OrderProvider>
            </CartProvider>
          </AdminProvider>
        </QueryClientProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;