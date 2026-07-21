import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import './App.css';
import Index from "@/pages/Index";
import { Toaster } from "@/components/ui/toaster";
import { AppProviders } from "@/components/AppProviders";
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
const AdminDashboard = React.lazy(() => import('@/pages/AdminDashboard'));
const NotFound = React.lazy(() => import("@/pages/NotFound"));
const TermsAndConditions = React.lazy(() => import("@/pages/TermsAndConditions"));
const PrivacyPolicy = React.lazy(() => import("@/pages/PrivacyPolicy"));
const ReturnsAndRefundPolicy = React.lazy(() => import("@/pages/ReturnsAndRefundPolicy"));
const ShippingAndDeliveryPolicy = React.lazy(() => import("@/pages/ShippingAndDeliveryPolicy"));
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
          <Route path="/shampoo" element={<Shop />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          {/* ── Legacy URL redirects (301-style) ── */}
          <Route path="/product/-deep-hydrating-shampoo-ecovluu" element={<Navigate to="/product/deep-hydrating-shampoo" replace />} />
          <Route path="/product/-deep-conditioning-mask-dry-damaged-hair-ecovluu" element={<Navigate to="/product/deep-conditioning-hair-mask" replace />} />
          <Route path="/blog/Ecovluu – The Honest Beginning of a New​Haircare Era" element={<Navigate to="/blog/beginning-new-haircare-era" replace />} />
          <Route path="/blog/Ecovluu%20%E2%80%93%20The%20Honest%20Beginning%20of%20a%20New%E2%80%A8Haircare%20Era" element={<Navigate to="/blog/beginning-new-haircare-era" replace />} />
          <Route path="/privacy-policy" element={<Navigate to="/privacy" replace />} />
          <Route path="/terms-and-conditions" element={<Navigate to="/terms" replace />} />
          <Route path="/returns-and-refund-policy" element={<Navigate to="/returns" replace />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/returns" element={<ReturnsAndRefundPolicy />} />
          <Route path="/shipping-policy" element={<ShippingAndDeliveryPolicy />} />
          <Route path="/auth-access" element={<Login />} />
          <Route path="/admin" element={<Navigate to="/ev-control-panel" replace />} />
          <Route path="/ev-control-panel" element={<AdminDashboard />} />
          <Route path="/404" element={<NotFound />} />
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
      <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <AppProviders queryClient={queryClient}>
          <AppContent />
        </AppProviders>
      </Router>
    </HelmetProvider>
  );
}

export default App;