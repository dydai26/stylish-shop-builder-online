import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdmin } from '@/context/AdminContext';
import { 
  Home, 
  Image, 
  Layout, 
  LogOut, 
  Edit3,
  Plus,
  Trash2,
  Package,
  MessageSquare,
  Menu,
  X,
  TrendingUp,
  Users,
  ShoppingCart,
  BarChart3,
  Mail,
  FileText,
  Globe,
  ExternalLink
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import OrdersSection from '@/components/admin/OrdersSection';
import { ReviewsSection } from '@/components/admin/ReviewsSection';
import ProductsSection from '@/components/admin/ProductsSection';
import BannersSection from '@/components/admin/BannersSection';
import PromoCodesSection from '@/components/admin/PromoCodesSection';
import GoogleAnalyticsSection from '@/components/admin/GoogleAnalyticsSection';
import NewsletterSection from '@/components/admin/NewsletterSection';
import BlogSection from '@/components/admin/BlogSection';
import AboutSection from '@/components/admin/AboutSection';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

const AdminDashboard = () => {
  const { isAuthenticated, user, logout } = useAdmin();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Dashboard stats state
  const [dashboardStats, setDashboardStats] = useState({
    totalProducts: 0,
    totalImages: 0,
    activeBanners: 0,
    totalOrders: 0,
    totalReviews: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  // Fetch dashboard stats
  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardStats();
    }
  }, [isAuthenticated]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, images, created_at')
        .neq('status', 'deleted');
      
      if (productsError) throw productsError;

      // Fetch banners
      const { data: banners, error: bannersError } = await supabase
        .from('banners')
        .select('id, created_at')
        .eq('is_active', true);
      
      if (bannersError) throw bannersError;

      // Fetch orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id, created_at, total')
        .order('created_at', { ascending: false });
      
      if (ordersError) throw ordersError;

      // Fetch reviews
      const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('id, created_at')
        .order('created_at', { ascending: false });
      
      if (reviewsError) throw reviewsError;

      // Calculate total images from products
      const totalImages = products?.reduce((count, product) => {
        const images = Array.isArray(product.images) ? product.images : [];
        return count + images.length;
      }, 0) || 0;

      // Create recent activity
      const recentActivity = [];
      
      if (orders && orders.length > 0) {
        recentActivity.push({
          type: 'order',
          message: `New order received - €${orders[0].total}`,
          time: orders[0].created_at,
          icon: ShoppingCart
        });
      }

      if (products && products.length > 0) {
        const recentProduct = products.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0];
        recentActivity.push({
          type: 'product',
          message: 'New product added',
          time: recentProduct.created_at,
          icon: Package
        });
      }

      if (reviews && reviews.length > 0) {
        recentActivity.push({
          type: 'review',
          message: 'New customer review',
          time: reviews[0].created_at,
          icon: MessageSquare
        });
      }

      // Sort by time
      recentActivity.sort((a, b) => 
        new Date(b.time).getTime() - new Date(a.time).getTime()
      );

      setDashboardStats({
        totalProducts: products?.length || 0,
        totalImages,
        activeBanners: banners?.length || 0,
        totalOrders: orders?.length || 0,
        totalReviews: reviews?.length || 0,
        recentActivity: recentActivity.slice(0, 3)
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Redirect if not authenticated - Force rebuild with Orders
  if (!isAuthenticated) {
    return <Navigate to="/auth-access" replace />;
  }

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'analytics', label: 'Google Analytics', icon: BarChart3 },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'blog', label: 'Blog', icon: FileText },
    { id: 'newsletter', label: 'Newsletter', icon: Mail },
    { id: 'banners', label: 'Banners', icon: Layout },
    { id: 'about', label: 'About Us CMS', icon: FileText },
    { id: 'promo-codes', label: 'Promo Codes', icon: Edit3 },
  ];



  const renderOverview = () => {
    if (loading) {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 w-16 bg-muted animate-pulse rounded mb-1"></div>
                  <div className="h-3 w-24 bg-muted animate-pulse rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">Active products in store</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Product Images</CardTitle>
              <Image className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.totalImages}</div>
              <p className="text-xs text-muted-foreground">Total product images</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Banners</CardTitle>
              <Layout className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.activeBanners}</div>
              <p className="text-xs text-muted-foreground">Currently displayed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">All time orders</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dashboardStats.recentActivity.length > 0 ? (
                dashboardStats.recentActivity.map((activity, index) => {
                  const Icon = activity.icon;
                  const timeAgo = format(new Date(activity.time), 'MMM dd, yyyy');
                  
                  return (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{timeAgo}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground">No recent activity</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Customer Reviews</span>
                </div>
                <span className="text-sm font-medium">{dashboardStats.totalReviews}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Active Products</span>
                </div>
                <span className="text-sm font-medium">{dashboardStats.totalProducts}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Layout className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Active Banners</span>
                </div>
                <span className="text-sm font-medium">{dashboardStats.activeBanners}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };




  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'analytics':
        return <GoogleAnalyticsSection />;
      case 'orders':
        return <OrdersSection />;
      case 'reviews':
        return <ReviewsSection />;
      case 'products':
        return <ProductsSection />;
      case 'blog':
        return <BlogSection />;
      case 'newsletter':
        return <NewsletterSection />;
      case 'banners':
        return <BannersSection />;
      case 'about':
        return <AboutSection />;
      case 'promo-codes':
        return <PromoCodesSection />;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {/* Left Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-card border-r border-border flex flex-col transition-all duration-300 ease-in-out`}>
        {/* Logo/Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-3">
                <img 
                  src="/intro.png" 
                  alt="ECOVLUU Logo" 
                  className="h-8 w-auto" 
                />
                <h1 className="text-lg font-bold text-foreground">
                  Admin Panel
                </h1>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="h-8 w-8 p-0"
            >
              {sidebarCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === item.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
                </button>
              );
            })}
          </div>
        </nav>

        {/* View Site Button */}
        <div className="px-4 py-2 border-t border-border">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2 rounded-lg text-left transition-colors text-muted-foreground hover:bg-muted hover:text-foreground`}
            title={sidebarCollapsed ? "View Website" : undefined}
          >
            <Globe className="h-4 w-4 flex-shrink-0" />
            {!sidebarCollapsed && <span className="font-medium">View Website</span>}
            {!sidebarCollapsed && <ExternalLink className="h-3 w-3 ml-auto opacity-50" />}
          </a>
        </div>

        {/* User info and logout */}
        <div className="p-4 border-t border-border">
          {sidebarCollapsed ? (
            <div className="flex justify-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="h-8 w-8 p-0"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{user?.name}</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="h-8 w-8 p-0"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;