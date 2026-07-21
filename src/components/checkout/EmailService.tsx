
import emailjs from '@emailjs/browser';
import { OrderData } from '@/components/checkout/types';

export const sendOrderConfirmationEmail = async (orderData: OrderData) => {
  try {
    emailjs.init("5Oigz1bCaEn2zPhRC");
    
    const itemsList = orderData.items.map((item: any) => 
      `${item.product.name} x ${item.quantity} - €${(item.product.price * item.quantity).toFixed(2)}`
    ).join('<br>');
    
    const templateParams = {
      order_id: orderData.orderId,
      to_email: "ecovluu@gmail.com",
      recipient: "ecovluu@gmail.com", // Explicitly specifying recipient
      to_name: "Administrator",       // Name of the administrator receiving the email
      customer_name: `${orderData.customer.firstName} ${orderData.customer.lastName}`,
      customer_email: orderData.customer.email,
      customer_phone: orderData.customer.phone,
      shipping_address: `${orderData.customer.address}, ${orderData.customer.city}, ${orderData.customer.postalCode}, ${orderData.customer.country}`,
      order_date: new Date(orderData.date).toLocaleDateString(),
      items_list: itemsList,
      subtotal: `€${orderData.subtotal.toFixed(2)}`,
      promo_code: orderData.discount ? orderData.discount.code : "",
      discount_amount: orderData.discount ? `€${orderData.discount.amount.toFixed(2)}` : "€0.00",
      shipping: `€${(orderData.shipping?.price || 0).toFixed(2)}`,
      tax: `€${orderData.tax.toFixed(2)}`,
      total: `€${orderData.total.toFixed(2)}`,
      payment_method: orderData.paymentInfo ? "Credit Card (Stripe)" : "N/A",
      shipping_method: orderData.shipping?.name || "Standard Shipping",
      email: "ecovluu@gmail.com" // Adding explicit email parameter which EmailJS might require
    };
    
    console.log("Sending order confirmation email with params:", templateParams);
    
    const result = await emailjs.send(
      "service_3301k2m", // Using service ID specified by user
      "template_gs9l77e", 
      templateParams
    );
    
    console.log("Order confirmation email sent successfully:", result);
    return result;
    
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    throw error;
  }
};
