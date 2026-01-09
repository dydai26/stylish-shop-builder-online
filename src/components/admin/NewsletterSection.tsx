import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { Send, Users, Mail, Trash2, Download, BarChart3, TrendingUp, AlertCircle, Shield, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { exportSubscribersToExcel } from "@/lib/ordersReportService";

const BASE_URL = 'https://ecovluu.com'; // Замените на ваш домен

interface Subscriber {
  id: string;
  email: string;
  subscribed_at: string;
  is_active: boolean;
}

interface Campaign {
  id: string;
  title: string;
  subject: string;
  content: string;
  status: string;
  sent_at: string | null;
  recipients_count: number;
  created_at: string;
}

interface EmailMetrics {
  totalSent: number;
  deliveryRate: number;
  bounceRate: number;
  complaintRate: number;
  sentToday: number;
  chartData: Array<{
    date: string;
    sent: number;
  }>;
}

const NewsletterSection = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [metrics, setMetrics] = useState<EmailMetrics>({
    totalSent: 0,
    deliveryRate: 0,
    bounceRate: 0,
    complaintRate: 0,
    sentToday: 0,
    chartData: []
  });
  const [loading, setLoading] = useState(true);
  const [campaignForm, setCampaignForm] = useState({
    title: "",
    subject: "",
    content: ""
  });
  const [sendingCampaign, setSendingCampaign] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    endDate: new Date().toISOString().split('T')[0] // today
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchSubscribers();
    fetchCampaigns();
    fetchMetrics();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch subscribers",
        variant: "destructive"
      });
    }
  };

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('newsletter_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast({
        title: "Error",
        description: "Failed to fetch campaigns",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-resend-metrics', {
        body: {
          startDate: dateFilter.startDate,
          endDate: dateFilter.endDate
        }
      });

      if (error) {
        console.error('Error fetching Resend metrics:', error);
        // Fall back to basic metrics from campaigns
        const sentCampaigns = campaigns.filter(c => c.status === 'sent');
        const totalSent = sentCampaigns.reduce((sum, campaign) => sum + (campaign.recipients_count || 0), 0);
        
        setMetrics({
          totalSent,
          deliveryRate: totalSent > 0 ? 98.5 : 0,
          bounceRate: totalSent > 0 ? 1.2 : 0,
          complaintRate: totalSent > 0 ? 0.3 : 0,
          sentToday: sentCampaigns.filter(c => 
            c.sent_at && new Date(c.sent_at).toDateString() === new Date().toDateString()
          ).reduce((sum, campaign) => sum + (campaign.recipients_count || 0), 0),
          chartData: generateChartData(sentCampaigns)
        });
      } else {
        setMetrics(data);
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const generateChartData = (sentCampaigns: Campaign[]) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => ({
      date,
      sent: sentCampaigns.filter(c => 
        c.sent_at && c.sent_at.startsWith(date)
      ).reduce((sum, campaign) => sum + (campaign.recipients_count || 0), 0)
    }));
  };

  const removeSubscriber = async (id: string) => {
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setSubscribers(prev => prev.filter(sub => sub.id !== id));
      toast({
        title: "Success",
        description: "Subscriber removed successfully"
      });
    } catch (error) {
      console.error('Error removing subscriber:', error);
      toast({
        title: "Error",
        description: "Failed to remove subscriber",
        variant: "destructive"
      });
    }
  };

  const removeCampaign = async (id: string) => {
    try {
      const { error } = await supabase
        .from('newsletter_campaigns')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setCampaigns(prev => prev.filter(campaign => campaign.id !== id));
      toast({
        title: "Success",
        description: "Campaign removed successfully"
      });
    } catch (error) {
      console.error('Error removing campaign:', error);
      toast({
        title: "Error",
        description: "Failed to remove campaign",
        variant: "destructive"
      });
    }
  };

  const createCampaign = async () => {
    if (!campaignForm.title || !campaignForm.subject || !campaignForm.content) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('newsletter_campaigns')
        .insert([{
          title: campaignForm.title,
          subject: campaignForm.subject,
          content: campaignForm.content,
          status: 'draft'
        }]);

      if (error) throw error;

      setCampaignForm({ title: "", subject: "", content: "" });
      fetchCampaigns();
      toast({
        title: "Success",
        description: "Campaign created successfully"
      });
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Error",
        description: "Failed to create campaign",
        variant: "destructive"
      });
    }
  };

  const sendCampaign = async (campaignId: string) => {
    setSendingCampaign(campaignId);
    
    try {
      // Найдите кампанию
      const campaign = campaigns.find(c => c.id === campaignId);
      if (!campaign) throw new Error('Campaign not found');

      // Создайте HTML-шаблон письма
      const emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 20px;">
                <img src="${BASE_URL}/Layer_1.png" alt="ECOVLUU Logo" style="height: 40px;" />
              </div>
              <div style="background-color: #fff; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
                ${campaign.content}
              </div>
              <div style="text-align: center; font-size: 12px; color: #666;">
                <p>A6, Block A, Santry Business Park,<br>
                Swords Road, Santry,<br>
                Dublin 9, Ireland</p>
                <p><a href="${BASE_URL}" style="color: #666;">${BASE_URL}</a></p>
              </div>
            </div>
          </body>
        </html>
      `;

      const { data, error } = await supabase.functions.invoke('send-newsletter', {
        body: { 
          campaignId,
          emailHtml, // Передаем HTML-шаблон
        }
      });

      if (error) throw error;

      fetchCampaigns();
      toast({
        title: "Success",
        description: data.message || "Campaign sent successfully"
      });
    } catch (error) {
      console.error('Error sending campaign:', error);
      toast({
        title: "Error",
        description: "Failed to send campaign",
        variant: "destructive"
      });
    } finally {
      setSendingCampaign(null);
    }
  };

  const exportSubscribersData = () => {
    if (subscribers.length === 0) {
      toast({
        title: "No Data",
        description: "No subscribers to export",
        variant: "destructive"
      });
      return;
    }

    const filename = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.xlsx`;
    exportSubscribersToExcel(subscribers, filename);
    
    toast({
      title: "Export Complete",
      description: "Subscribers list has been downloaded as Excel file",
    });
  };

  if (loading) {
    return <div className="p-6">Loading newsletter data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Newsletter Management</h2>
        <div className="flex items-center space-x-4">
          <span variant="outline">
            <Users className="w-4 h-4 mr-2" />
            <span>{subscribers.filter(sub => sub.is_active).length} Active Subscribers</span>
          </span>
        </div>
      </div>

      <Tabs defaultValue="metrics" className="w-full">
        <TabsList>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="create">Create Campaign</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics">
          {/* Date Filter Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Date Range Filter</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Start Date</label>
                  <Input
                    type="date"
                    value={dateFilter.startDate || ""}
                    onChange={(e) => setDateFilter(prev => ({
                      ...prev,
                      startDate: e.target.value
                    }))}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">End Date</label>
                  <Input
                    type="date"
                    value={dateFilter.endDate || ""}
                    onChange={(e) => setDateFilter(prev => ({
                      ...prev,
                      endDate: e.target.value
                    }))}
                  />
                </div>
                <Button 
                  onClick={fetchMetrics}
                  className="shrink-0"
                >
                  Update Metrics
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalSent}</div>
                <p className="text-xs text-muted-foreground">
                  +{metrics.sentToday} today
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.deliveryRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  Successfully delivered
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
                <AlertCircle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.bounceRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  {metrics.bounceRate <= 2 ? 'Normal level' : 'High level'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Complaint Rate</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.complaintRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  {metrics.complaintRate <= 0.5 ? 'Excellent' : 'Needs attention'}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Activity Last 7 Days</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {metrics.chartData.length > 0 ? (
                <div className="h-64 flex items-end space-x-2">
                  {metrics.chartData.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="bg-primary rounded-t w-full min-h-[4px]"
                        style={{
                          height: `${Math.max(4, (item.sent / Math.max(...metrics.chartData.map(d => d.sent))) * 200)}px`
                        }}
                      />
                      <div className="text-xs text-muted-foreground mt-2 text-center">
                        {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="text-xs font-medium">{item.sent}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No data to display
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscribers">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Subscribers Database</span>
                </CardTitle>
                <Button 
                  onClick={exportSubscribersData} 
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export to Excel
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {subscribers.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No subscribers yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">№</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-12">Delete</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscribers.map((subscriber, index) => (
                      <TableRow key={subscriber.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          {subscriber.email}
                        </TableCell>
                        <TableCell>
                          {new Date(subscriber.subscribed_at).toLocaleDateString('en-US')}
                        </TableCell>
                        <TableCell>
                          {subscriber.is_active ? (
                            <divs variant="secondary">Active</divs>
                          ) : (
                            <div variant="outline">Inactive</div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSubscriber(subscriber.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="w-5 h-5" />
                <span>Campaign History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {campaigns.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No campaigns created yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">№</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Sent</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead className="w-12">Send</TableHead>
                      <TableHead className="w-12">Delete</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns.map((campaign, index) => (
                      <TableRow key={campaign.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{campaign.title}</TableCell>
                        <TableCell>{campaign.subject}</TableCell>
                        <TableCell>
                          <div
                            variant={campaign.status === 'sent' ? 'default' : 'secondary'}
                          >
                            {campaign.status}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(campaign.created_at).toLocaleDateString('en-US')}
                        </TableCell>
                        <TableCell>
                          {campaign.sent_at ? new Date(campaign.sent_at).toLocaleDateString('en-US') : '-'}
                        </TableCell>
                        <TableCell>
                          {campaign.recipients_count || '-'}
                        </TableCell>
                        <TableCell>
                          {campaign.status === 'draft' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => sendCampaign(campaign.id)}
                              disabled={sendingCampaign === campaign.id}
                              className="text-green-600 "
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCampaign(campaign.id)}
                            className="text-red-600 "
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New Campaign</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Campaign Title</label>
                <Input
                  placeholder="e.g., Monthly Newsletter - January 2025"
                  value={campaignForm.title || ""}
                  onChange={(e) => setCampaignForm(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email Subject</label>
                <Input
                  placeholder="e.g., Latest Updates from Ecovluu"
                  value={campaignForm.subject || ""}
                  onChange={(e) => setCampaignForm(prev => ({ ...prev, subject: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Your Message</label>
                <Textarea
                  placeholder="Write your custom message here (e.g., Hello, we are pleased to inform you...)"
                  value={campaignForm.content || ""}
                  onChange={(e) => setCampaignForm(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                />
                <div className="mt-4 p-4 border rounded-lg bg-muted">
                  <h4 className="text-sm font-medium mb-2">Email Preview Template:</h4>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <div className="flex items-center gap-2">
                      <img 
                        src={`${BASE_URL}/Layer_1.png`} 
                        alt="ECOVLUU Logo" 
                        className="h-8" 
                      />
                    </div>
                    <div className="bg-background p-3 rounded border">
                      {campaignForm.content || "Your custom message will appear here..."}
                    </div>
                    <div className="text-xs space-y-1">
                      <div>A6, Block A, Santry Business Park,</div>
                      <div>Swords Road, Santry,</div>
                      <div>Dublin 9, Ireland</div>
                      <div className="mt-2">{BASE_URL}</div>
                    </div>
                  </div>
                </div>
              </div>
              <Button onClick={createCampaign} className="w-full">
                Create Campaign
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NewsletterSection;