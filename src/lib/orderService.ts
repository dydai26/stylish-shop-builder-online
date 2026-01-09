import { supabase } from "@/integrations/supabase/client";
import { OrderData } from "@/components/checkout/types";

export interface DatabaseOrder {
  id: string;
  order_id: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_address: string;
  customer_city: string;
  customer_postal_code: string;
  customer_country: string;
  items: any;
  shipping_name?: string;
  shipping_price?: number;
  subtotal: number;
  total: number;
  payment_info?: any;
  order_date: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const saveOrderToDatabase = async (orderData: OrderData): Promise<void> => {
  try {
    const { error } = await (supabase as any)
      .from('orders')
      .insert({
        order_id: orderData.orderId,
        customer_first_name: orderData.customer.firstName,
        customer_last_name: orderData.customer.lastName,
        customer_email: orderData.customer.email,
        customer_phone: orderData.customer.phone || null,
        customer_address: orderData.customer.address,
        customer_city: orderData.customer.city,
        customer_postal_code: orderData.customer.postalCode,
        customer_country: orderData.customer.country,
        items: orderData.items,
        shipping_name: orderData.shipping?.name || null,
        shipping_price: orderData.shipping?.price || null,
        subtotal: orderData.subtotal,
        total: orderData.total,
        payment_info: orderData.paymentInfo || null,
        order_date: orderData.date,
        status: 'pending'
      });

    if (error) {
      console.error('Error saving order to database:', error);
      throw error;
    }

    console.log('Order saved to database successfully');
  } catch (error) {
    console.error('Failed to save order to database:', error);
    throw error;
  }
};

export const fetchOrders = async (): Promise<DatabaseOrder[]> => {
  try {
    const { data, error } = await (supabase as any)
      .from('orders')
      .select('*')
      .order('order_date', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: string, status: string): Promise<void> => {
  try {
    const { error } = await (supabase as any)
      .from('orders')
      .update({ status })
      .eq('order_id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
      throw error;
    }

    console.log('Order status updated successfully');
  } catch (error) {
    console.error('Failed to update order status:', error);
    throw error;
  }
};