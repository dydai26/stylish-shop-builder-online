import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Users, 
  Globe, 
  TrendingUp, 
  Clock, 
  Eye,
  MousePointer,
  Smartphone,
  Monitor,
  RefreshCw,
  Calendar,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    totalPageViews: number;
    averageSessionDuration: string;
    bounceRate: number;
    newUsers: number;
    returningUsers: number;
  };
  traffic: {
    organic: number;
    direct: number;
    referral: number;
    social: number;
    email: number;
    paid: number;
  };
  devices: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  topPages: Array<{
    page: string;
    views: number;
    uniqueViews: number;
    bounceRate: number;
  }>;
  realtime: {
    activeUsers: number;
    topPages: Array<{
      page: string;
      activeUsers: number;
    }>;
  };
  demographics: {
    countries: Array<{
      country: string;
      users: number;
      percentage: number;
    }>;
    cities: Array<{
      city: string;
      users: number;
      percentage: number;
    }>;
  };
}

const GoogleAnalyticsSection = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    overview: {
      totalUsers: 0,
      totalPageViews: 0,
      averageSessionDuration: '0:00',
      bounceRate: 0,
      newUsers: 0,
      returningUsers: 0
    },
    traffic: {
      organic: 0,
      direct: 0,
      referral: 0,
      social: 0,
      email: 0,
      paid: 0
    },
    devices: {
      desktop: 0,
      mobile: 0,
      tablet: 0
    },
    topPages: [],
    realtime: {
      activeUsers: 0,
      topPages: []
    },
    demographics: {
      countries: [],
      cities: []
    }
  });
  const [dateRange, setDateRange] = useState('30days');

  useEffect(() => {
    fetchAnalyticsData();
    
    // Set up auto-refresh every 5 minutes for real-time data
    const interval = setInterval(() => {
      fetchAnalyticsData();
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(interval);
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Try to fetch real Google Analytics data
      try {
        console.log('Fetching real Google Analytics data...');
        const { data, error } = await supabase.functions.invoke('google-analytics', {
          body: { dateRange }
        });

        if (error) {
          console.error('Supabase function error:', error);
          throw error;
        }
        
        if (data && !data.error) {
          console.log('Successfully fetched real analytics data:', data);
          setAnalyticsData(data);
          toast({
            title: "Success",
            description: "Real-time Google Analytics data loaded",
            variant: "default"
          });
          return;
        } else {
          console.warn('Google Analytics API returned error:', data?.error, data?.details);
          throw new Error(data?.error || 'Unknown API error');
        }
      } catch (apiError) {
        console.warn('Failed to fetch real analytics data:', apiError);
        toast({
          title: "Using demo data",
          description: "Configure Google Analytics API for real data. Check logs for details.",
          variant: "destructive"
        });
      }
      
      // Fallback to mock data if API fails
      const mockData: AnalyticsData = {
        overview: {
          totalUsers: 15247,
          totalPageViews: 45891,
          averageSessionDuration: '3:42',
          bounceRate: 32.4,
          newUsers: 12189,
          returningUsers: 3058
        },
        traffic: {
          organic: 8234,
          direct: 3456,
          referral: 2134,
          social: 1098,
          email: 234,
          paid: 91
        },
        devices: {
          desktop: 9148,
          mobile: 5234,
          tablet: 865
        },
        topPages: [
          { page: '/', views: 12456, uniqueViews: 8934, bounceRate: 28.5 },
          { page: '/shop', views: 8934, uniqueViews: 6123, bounceRate: 35.2 },
          { page: '/about', views: 4567, uniqueViews: 3456, bounceRate: 42.1 },
          { page: '/contact', views: 2345, uniqueViews: 1876, bounceRate: 38.9 },
          { page: '/reviews', views: 1876, uniqueViews: 1456, bounceRate: 45.3 }
        ],
        realtime: {
          activeUsers: 23,
          topPages: [
            { page: '/', activeUsers: 12 },
            { page: '/shop', activeUsers: 7 },
            { page: '/about', activeUsers: 3 },
            { page: '/contact', activeUsers: 1 }
          ]
        },
        demographics: {
          countries: [
            { country: 'Romania', users: 5234, percentage: 34.3 },
            { country: 'United Kingdom', users: 3456, percentage: 22.7 },
            { country: 'Germany', users: 2345, percentage: 15.4 },
            { country: 'France', users: 1876, percentage: 12.3 },
            { country: 'Italy', users: 1234, percentage: 8.1 },
            { country: 'Spain', users: 1102, percentage: 7.2 }
          ],
          cities: [
            { city: 'Bucharest', users: 2345, percentage: 15.4 },
            { city: 'London', users: 1876, percentage: 12.3 },
            { city: 'Berlin', users: 1234, percentage: 8.1 },
            { city: 'Paris', users: 1102, percentage: 7.2 },
            { city: 'Rome', users: 987, percentage: 6.5 }
          ]
        }
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getTrafficSourceColor = (source: string) => {
    const colors = {
      organic: 'bg-green-500',
      direct: 'bg-blue-500',
      referral: 'bg-purple-500',
      social: 'bg-pink-500',
      email: 'bg-orange-500',
      paid: 'bg-red-500'
    };
    return colors[source as keyof typeof colors] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Google Analytics</h2>
          <div className="flex items-center gap-2">
            <div className="h-10 w-32 bg-muted animate-pulse rounded"></div>
            <div className="h-10 w-24 bg-muted animate-pulse rounded"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-4 w-20 bg-muted animate-pulse rounded mb-2"></div>
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Google Analytics
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Property ID: 12186918958 | Measurement ID: G-6MVF91T4LG
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="7days">Last 7 days</option>
            <option value="14days">Last 14 days</option>
            <option value="30days">Last 30 days</option>
            <option value="60days">Last 60 days</option>
            <option value="90days">Last 90 days</option>
            <option value="6months">Last 6 months</option>
            <option value="year">This year</option>
          </select>
          <Button onClick={fetchAnalyticsData} size="sm" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{analyticsData.overview.totalUsers.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-500">+12.5%</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Page Views</p>
                <p className="text-2xl font-bold">{analyticsData.overview.totalPageViews.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-500">+8.2%</span>
                </div>
              </div>
              <Eye className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Session Duration</p>
                <p className="text-2xl font-bold">{analyticsData.overview.averageSessionDuration}</p>
                <div className="flex items-center mt-1">
                  <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-500">+5.1%</span>
                </div>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bounce Rate</p>
                <p className="text-2xl font-bold">{analyticsData.overview.bounceRate}%</p>
                <div className="flex items-center mt-1">
                  <ArrowDown className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-500">-2.3%</span>
                </div>
              </div>
              <MousePointer className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Real-time Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Active Users</h4>
              <p className="text-3xl font-bold text-green-500">{analyticsData.realtime.activeUsers}</p>
              <p className="text-sm text-muted-foreground">Users currently on site</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Top Active Pages</h4>
              <div className="space-y-2">
                {analyticsData.realtime.topPages.map((page, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{page.page}</span>
                    <div variant="secondary">{page.activeUsers} users</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Traffic Sources & Devices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(analyticsData.traffic).map(([source, users]) => {
                const trafficValues = Object.values(analyticsData.traffic).map(v => Number(v));
                const total = trafficValues.reduce((sum, val) => sum + val, 0);
                const percentage = ((Number(users) / total) * 100).toFixed(1);
                
                return (
                  <div key={source} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getTrafficSourceColor(source)}`}></div>
                      <span className="text-sm capitalize">{source}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{users.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{percentage}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(analyticsData.devices).map(([device, users]) => {
                const deviceValues = Object.values(analyticsData.devices).map(v => Number(v));
                const total = deviceValues.reduce((sum, val) => sum + val, 0);
                const percentage = ((Number(users) / total) * 100).toFixed(1);
                const Icon = device === 'desktop' ? Monitor : device === 'mobile' ? Smartphone : Smartphone;
                
                return (
                  <div key={device} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm capitalize">{device}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{users.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{percentage}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Pages */}
      <Card>
        <CardHeader>
          <CardTitle>Top Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">Page</th>
                  <th className="text-right py-2 px-4">Views</th>
                  <th className="text-right py-2 px-4">Unique Views</th>
                  <th className="text-right py-2 px-4">Bounce Rate</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.topPages.map((page, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4 font-medium">{page.page}</td>
                    <td className="py-2 px-4 text-right">{page.views.toLocaleString()}</td>
                    <td className="py-2 px-4 text-right">{page.uniqueViews.toLocaleString()}</td>
                    <td className="py-2 px-4 text-right">{page.bounceRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Top Countries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.demographics.countries.map((country, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{country.country}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${country.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-16 text-right">
                      {country.users.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Top Cities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.demographics.cities.map((city, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{city.city}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${city.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-16 text-right">
                      {city.users.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GoogleAnalyticsSection;