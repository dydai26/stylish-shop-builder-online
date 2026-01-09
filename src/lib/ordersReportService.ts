import { supabase } from "@/integrations/supabase/client";
import * as XLSX from 'xlsx';

export interface OrdersReport {
  totalOrders: number;
  totalRevenue: number;
  totalItems: number;
  averageOrderValue: number;
  orders: any[];
  dateRange: {
    start: string;
    end: string;
  };
}

export interface OrdersFilter {
  startDate?: string;
  endDate?: string;
  status?: string;
}

export interface TopProduct {
  name: string;
  quantity: number;
  revenue: number;
  orders: number;
}

// Get orders with filtering
export const getOrdersWithFilter = async (filter: OrdersFilter) => {
  let query = supabase
    .from('orders')
    .select('*')
    .order('order_date', { ascending: false });

  if (filter.startDate) {
    query = query.gte('order_date', filter.startDate);
  }

  if (filter.endDate) {
    // Add one day to include the end date
    const endDate = new Date(filter.endDate);
    endDate.setDate(endDate.getDate() + 1);
    query = query.lt('order_date', endDate.toISOString().split('T')[0]);
  }

  if (filter.status && filter.status !== 'all') {
    query = query.eq('status', filter.status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching filtered orders:', error);
    throw error;
  }

  return data || [];
};

// Generate orders report
export const generateOrdersReport = async (filter: OrdersFilter): Promise<OrdersReport> => {
  const orders = await getOrdersWithFilter(filter);
  
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (typeof order.total === 'string' ? parseFloat(order.total) : order.total), 0);
  const totalItems = orders.reduce((sum, order) => {
    const items = Array.isArray(order.items) ? order.items : [];
    return sum + items.reduce((itemSum: number, item: any) => itemSum + (item.quantity || 0), 0);
  }, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return {
    totalOrders,
    totalRevenue,
    totalItems,
    averageOrderValue,
    orders,
    dateRange: {
      start: filter.startDate || '',
      end: filter.endDate || ''
    }
  };
};

// Export orders to Excel
export const exportOrdersToExcel = (report: OrdersReport, filename?: string) => {
  // Prepare summary data
  const summaryData = [
    ['Orders Report Summary'],
    [''],
    ['Date Range:', `${report.dateRange.start || 'All time'} - ${report.dateRange.end || 'Present'}`],
    ['Total Orders:', report.totalOrders],
    ['Total Revenue:', `€${report.totalRevenue.toFixed(2)}`],
    ['Total Items Sold:', report.totalItems],
    ['Average Order Value:', `€${report.averageOrderValue.toFixed(2)}`],
    [''],
    ['Detailed Orders:']
  ];

  // Prepare orders data
  const ordersData = report.orders.map(order => {
    const items = Array.isArray(order.items) ? order.items : [];
    const itemsText = items.map((item: any) => 
      `${item.product?.name || item.name || 'Product'} x${item.quantity}`
    ).join('; ');

    return {
      'Order ID': order.order_id,
      'Date': new Date(order.order_date).toLocaleDateString(),
      'Customer': `${order.customer_first_name} ${order.customer_last_name}`,
      'Email': order.customer_email,
      'Phone': order.customer_phone || '',
      'Country': order.customer_country,
      'City': order.customer_city,
      'Status': order.status,
      'Items': itemsText,
      'Subtotal': `€${(typeof order.subtotal === 'string' ? parseFloat(order.subtotal) : order.subtotal).toFixed(2)}`,
      'Shipping': `€${(typeof order.shipping_price === 'string' ? parseFloat(order.shipping_price || '0') : (order.shipping_price || 0)).toFixed(2)}`,
      'Total': `€${(typeof order.total === 'string' ? parseFloat(order.total) : order.total).toFixed(2)}`
    };
  });

  // Create workbook
  const wb = XLSX.utils.book_new();

  // Add summary sheet
  const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

  // Add orders sheet
  if (ordersData.length > 0) {
    const ordersWs = XLSX.utils.json_to_sheet(ordersData);
    XLSX.utils.book_append_sheet(wb, ordersWs, 'Orders');
  }

  // Generate filename
  const defaultFilename = `orders-report-${new Date().toISOString().split('T')[0]}.xlsx`;
  const finalFilename = filename || defaultFilename;

  // Download file
  XLSX.writeFile(wb, finalFilename);
};

// Get orders by month for charts/analytics
export const getOrdersByMonth = async (year?: number): Promise<{ month: string; orders: number; revenue: number }[]> => {
  const currentYear = year || new Date().getFullYear();
  const startDate = `${currentYear}-01-01`;
  const endDate = `${currentYear + 1}-01-01`;

  const { data, error } = await supabase
    .from('orders')
    .select('order_date, total')
    .gte('order_date', startDate)
    .lt('order_date', endDate)
    .order('order_date');

  if (error) {
    console.error('Error fetching orders by month:', error);
    throw error;
  }

  // Group by month
  const monthlyData: { [key: string]: { orders: number; revenue: number } } = {};
  
  // Initialize all months
  for (let i = 0; i < 12; i++) {
    const monthDate = new Date(currentYear, i, 1);
    const month = monthDate.toLocaleDateString('en-US', { month: 'short' });
    monthlyData[month] = { orders: 0, revenue: 0 };
  }

  // Process orders
  (data || []).forEach(order => {
    const orderDate = new Date(order.order_date);
    const month = orderDate.toLocaleDateString('en-US', { month: 'short' });
    if (monthlyData[month]) {
      monthlyData[month].orders += 1;
      monthlyData[month].revenue += (typeof order.total === 'string' ? parseFloat(order.total) : order.total);
    }
  });

  return Object.entries(monthlyData).map(([month, data]) => ({
    month,
    orders: data.orders,
    revenue: data.revenue
  }));
};

// Get top selling products
export const getTopProducts = async (filter: OrdersFilter, limit: number = 10): Promise<TopProduct[]> => {
  const orders = await getOrdersWithFilter(filter);
  
  const productStats: { [productName: string]: TopProduct } = {};
  
  orders.forEach(order => {
    const items = Array.isArray(order.items) ? order.items : [];
    items.forEach((item: any) => {
      const productName = item.product?.name || item.name || 'Unknown Product';
      const quantity = item.quantity || 0;
      const price = item.product?.price || 0;
      
      if (!productStats[productName]) {
        productStats[productName] = {
          name: productName,
          quantity: 0,
          revenue: 0,
          orders: 0
        };
      }
      
      productStats[productName].quantity += quantity;
      productStats[productName].revenue += quantity * price;
      productStats[productName].orders += 1;
    });
  });
  
  return Object.values(productStats)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit);
};

// Export subscribers to Excel
export const exportSubscribersToExcel = (subscribers: any[], filename?: string) => {
  const subscribersData = subscribers.map((subscriber, index) => ({
    '№': index + 1,
    'Email': subscriber.email,
    'Date': new Date(subscriber.subscribed_at).toLocaleDateString('en-US'),
    'Status': subscriber.is_active ? 'Active' : 'Inactive'
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(subscribersData);
  XLSX.utils.book_append_sheet(wb, ws, 'Subscribers');

  const defaultFilename = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.xlsx`;
  const finalFilename = filename || defaultFilename;

  XLSX.writeFile(wb, finalFilename);
};