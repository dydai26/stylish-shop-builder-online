import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Eye, Search, Package, Clock, CheckCircle, XCircle, Download, FileText, Calendar as CalendarIcon, Filter, Upload, Send } from 'lucide-react';
import { DatabaseOrder, fetchOrders, updateOrderStatus } from '@/lib/orderService';
import { 
  generateOrdersReport, 
  exportOrdersToExcel, 
  getOrdersWithFilter, 
  getOrdersByMonth,
  getTopProducts,
  type OrdersFilter, 
  type OrdersReport,
  type TopProduct 
} from '@/lib/ordersReportService';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const OrdersSection = () => {
  const [orders, setOrders] = useState<DatabaseOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<DatabaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<DatabaseOrder | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentReport, setCurrentReport] = useState<OrdersReport | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [showTopProducts, setShowTopProducts] = useState(false);
  
  // Date filters
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  
  const { toast } = useToast();

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [orders, searchTerm, statusFilter, startDate, endDate, selectedMonth, selectedYear]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await fetchOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    try {
      const filter: OrdersFilter = {
        status: statusFilter === 'all' ? undefined : statusFilter
      };

      // Handle date filtering
      if (selectedMonth && selectedMonth !== 'all' && selectedYear) {
        const monthIndex = parseInt(selectedMonth) - 1;
        const year = parseInt(selectedYear);
        const start = new Date(year, monthIndex, 1);
        const end = new Date(year, monthIndex + 1, 0);
        
        filter.startDate = format(start, 'yyyy-MM-dd');
        filter.endDate = format(end, 'yyyy-MM-dd');
      } else {
        if (startDate) {
          filter.startDate = format(startDate, 'yyyy-MM-dd');
        }
        if (endDate) {
          filter.endDate = format(endDate, 'yyyy-MM-dd');
        }
      }

      const filtered = await getOrdersWithFilter(filter);
      
      // Apply text search
      let finalFiltered = filtered;
      if (searchTerm) {
        finalFiltered = filtered.filter(order => 
          order.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          `${order.customer_first_name} ${order.customer_last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredOrders(finalFiltered);
    } catch (error) {
      console.error('Error applying filters:', error);
      setFilteredOrders(orders);
    }
  };

  const generateReport = async () => {
    try {
      const filter: OrdersFilter = {
        status: statusFilter === 'all' ? undefined : statusFilter
      };

      if (selectedMonth && selectedMonth !== 'all' && selectedYear) {
        const monthIndex = parseInt(selectedMonth) - 1;
        const year = parseInt(selectedYear);
        const start = new Date(year, monthIndex, 1);
        const end = new Date(year, monthIndex + 1, 0);
        
        filter.startDate = format(start, 'yyyy-MM-dd');
        filter.endDate = format(end, 'yyyy-MM-dd');
      } else {
        if (startDate) {
          filter.startDate = format(startDate, 'yyyy-MM-dd');
        }
        if (endDate) {
          filter.endDate = format(endDate, 'yyyy-MM-dd');
        }
      }

      const report = await generateOrdersReport(filter);
      setCurrentReport(report);

      // Also get top products data
      const topProductsData = await getTopProducts(filter, 10);
      setTopProducts(topProductsData);

      toast({
        title: "Report Generated",
        description: `Found ${report.totalOrders} orders with €${report.totalRevenue.toFixed(2)} total revenue`,
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive"
      });
    }
  };

  const exportToExcel = () => {
    if (!currentReport) {
      toast({
        title: "No Report",
        description: "Please generate a report first",
        variant: "destructive"
      });
      return;
    }

    const filename = `orders-report-${selectedMonth ? `${selectedYear}-${selectedMonth.padStart(2, '0')}` : 
      (startDate || endDate) ? `${startDate ? format(startDate, 'yyyy-MM-dd') : 'all'}-to-${endDate ? format(endDate, 'yyyy-MM-dd') : 'now'}` : 
      'all-time'}.xlsx`;

    exportOrdersToExcel(currentReport, filename);
    
    toast({
      title: "Export Complete",
      description: "Report has been downloaded as Excel file",
    });
  };

  const clearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedMonth('all');
    setSelectedYear(new Date().getFullYear().toString());
    setStatusFilter('all');
    setSearchTerm('');
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order.order_id === orderId ? { ...order, status: newStatus } : order
      ));
      toast({
        title: "Success",
        description: "Order status updated successfully"
      });
      // Refresh filters to update the view
      applyFilters();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, icon: Clock, label: 'Pending' },
      processing: { variant: 'default' as const, icon: Package, label: 'Processing' },
      shipped: { variant: 'outline' as const, icon: Package, label: 'Shipped' },
      delivered: { variant: 'outline' as const, icon: CheckCircle, label: 'Delivered' },
      cancelled: { variant: 'destructive' as const, icon: XCircle, label: 'Cancelled' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant as "default" | "secondary" | "destructive" | "outline"} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const OrderDetailsDialog = ({ order }: { order: DatabaseOrder }) => {
    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const [sendingReceipt, setSendingReceipt] = useState(false);
    const [localStatus, setLocalStatus] = useState(order.status);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setReceiptFile(file);
      }
    };

    const handleSendReceipt = async () => {
      if (!receiptFile) {
        toast({
          title: "Error",
          description: "Please upload a receipt",
          variant: "destructive"
        });
        return;
      }

      try {
        setSendingReceipt(true);

        // Convert file to base64
        const reader = new FileReader();
        reader.readAsDataURL(receiptFile);
        
        await new Promise((resolve, reject) => {
          reader.onload = resolve;
          reader.onerror = reject;
        });

        const base64Content = (reader.result as string).split(',')[1];

        const { supabase } = await import('@/integrations/supabase/client');
        const { data, error } = await supabase.functions.invoke('send-receipt', {
          body: {
            customerEmail: order.customer_email,
            customerName: `${order.customer_first_name} ${order.customer_last_name}`,
            orderId: order.order_id,
            receiptFile: {
              filename: receiptFile.name,
              content: base64Content,
              contentType: receiptFile.type
            }
          }
        });

        if (error) throw error;

        toast({
          title: "Success",
          description: `Receipt sent to ${order.customer_email}`
        });

        setReceiptFile(null);
      } catch (error: any) {
        console.error('Error sending receipt:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to send receipt",
          variant: "destructive"
        });
      } finally {
        setSendingReceipt(false);
      }
    };

    const handleStatusChange = async (value: string) => {
      setLocalStatus(value);
      await handleStatusUpdate(order.order_id, value);
    };

    return (
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details - {order.order_id}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Name:</strong> {order.customer_first_name} {order.customer_last_name}</p>
                <p><strong>Email:</strong> {order.customer_email}</p>
                <p><strong>Phone:</strong> {order.customer_phone}</p>
                <p><strong>Address:</strong> {order.customer_address}</p>
                <p><strong>City:</strong> {order.customer_city}, {order.customer_postal_code}</p>
                <p><strong>Country:</strong> {order.customer_country}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Order ID:</strong> {order.order_id}</p>
                <p><strong>Date:</strong> {formatDate(order.order_date)}</p>
                <p><strong>Status:</strong> {getStatusBadge(localStatus)}</p>
                <p><strong>Shipping:</strong> {order.shipping_name} (€{order.shipping_price?.toFixed(2)})</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(Array.isArray(order.items) ? order.items : []).map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <h4 className="font-medium">{item.product?.name || 'Unknown Product'}</h4>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity || 1} × €{(item.product?.price || 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-left w-full flex flex-col items-start">
                      <p className="font-medium">€{((item.quantity || 1) * (item.product?.price || 0)).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>€{order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>€{order.shipping_price?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>€{order.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Select 
                value={localStatus} 
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {localStatus === 'shipped' && (
              <Card className="border-brand-orange/20 bg-brand-orange/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5 text-brand-orange" />
                    Send Receipt to Customer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                  <Label htmlFor="receipt-file">Receipt (all formats)</Label>
                    <div className="flex gap-2 items-center">
                      <div className="relative flex-1">
                        <input
                          id="receipt-file"
                          type="file"
                          onChange={handleFileChange}
                          accept="*/*"
                          className="hidden"
                        />
                        <label
                          htmlFor="receipt-file"
                          className="flex h-10 w-full cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          <Upload className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {receiptFile ? receiptFile.name : "Choose file - No file selected"}
                          </span>
                        </label>
                      </div>
                      {receiptFile && (
                        <Button
                          onClick={handleSendReceipt}
                          disabled={sendingReceipt}
                          className="bg-brand-orange hover:bg-brand-orange/90"
                        >
                          {sendingReceipt ? (
                            <>Sending...</>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Send to {order.customer_email}
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                    {receiptFile && (
                      <p className="text-sm text-muted-foreground">
                        Selected: {receiptFile.name} ({(receiptFile.size / 1024).toFixed(2)} KB)
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Orders Management</h2>
        <div className="flex items-center justify-center h-64">
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Orders Management</h2>
        <div className="flex gap-2">
          <Button onClick={generateReport} variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Generate Report
          </Button>
          {currentReport && (
            <Button onClick={exportToExcel} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Excel
            </Button>
          )}
          <Button onClick={loadOrders} variant="outline">
            Refresh Orders
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-sm text-muted-foreground">Total Orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{orders.filter(o => o.status === 'pending').length}</div>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{orders.filter(o => o.status === 'processing').length}</div>
            <p className="text-sm text-muted-foreground">Processing</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">€{orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Date Filters and Report Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Reports
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>
        </CardHeader>
        
        {showFilters && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {/* Quick Month/Year Filter */}
              <div className="space-y-2">
                <Label>Month</Label>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All months</SelectItem>
                    <SelectItem value="1">January</SelectItem>
                    <SelectItem value="2">February</SelectItem>
                    <SelectItem value="3">March</SelectItem>
                    <SelectItem value="4">April</SelectItem>
                    <SelectItem value="5">May</SelectItem>
                    <SelectItem value="6">June</SelectItem>
                    <SelectItem value="7">July</SelectItem>
                    <SelectItem value="8">August</SelectItem>
                    <SelectItem value="9">September</SelectItem>
                    <SelectItem value="10">October</SelectItem>
                    <SelectItem value="11">November</SelectItem>
                    <SelectItem value="12">December</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Year</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 5 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Date Range */}
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "MMM dd, yyyy") : "Pick start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "MMM dd, yyyy") : "Pick end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button onClick={clearFilters} variant="outline" className="w-full">
                  Clear Filters
                </Button>
              </div>
            </div>

            {/* Report Summary */}
            {currentReport && (
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-3">Report Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Orders</p>
                    <p className="font-semibold text-lg">{currentReport.totalOrders}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Revenue</p>
                    <p className="font-semibold text-lg">€{currentReport.totalRevenue.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Items Sold</p>
                    <p className="font-semibold text-lg">{currentReport.totalItems}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Avg. Order Value</p>
                    <p className="font-semibold text-lg">€{currentReport.averageOrderValue.toFixed(2)}</p>
                  </div>
                </div>
                <div className="mt-3 text-sm text-muted-foreground">
                  Date Range: {currentReport.dateRange.start || 'All time'} - {currentReport.dateRange.end || 'Present'}
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Top Products Section */}
      {topProducts.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Top Selling Products
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowTopProducts(!showTopProducts)}
              >
                {showTopProducts ? 'Hide' : 'Show'} Top Products
              </Button>
            </div>
          </CardHeader>
          
          {showTopProducts && (
            <CardContent>
              <div className="space-y-3">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="font-bold text-sm">#{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {product.orders} orders
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">€{product.revenue.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">{product.quantity} units sold</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders by ID, email, or customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                {orders.length === 0 ? 'No orders found' : 'No orders match your filters'}
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 hover:bg-muted/50">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-medium text-left w-full">{order.order_id}</h3>
                        <p className="text-sm text-muted-foreground text-left w-full">
                          {order.customer_first_name} {order.customer_last_name} • {order.customer_email}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium text-left w-full">€{order.total.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(order.order_date)}
                      </p>
                    </div>
                    
                    {getStatusBadge(order.status)}
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <OrderDetailsDialog order={order} />
                    </Dialog>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersSection;