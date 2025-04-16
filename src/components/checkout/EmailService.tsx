import emailjs from '@emailjs/browser';
import { OrderData } from '@/components/checkout/types';

export const sendOrderConfirmationEmail = async (orderData: OrderData) => {
  try {
    emailjs.init("a779AWRXZ-BFm5EfZ");
    
    const itemsList = orderData.items.map((item: any) => 
      `${item.product.name} x ${item.quantity} - €${(item.product.price * item.quantity).toFixed(2)}`
    ).join('<br>');
    
    const templateParams = {
      order_id: orderData.orderId,
      to_email: "dydai26@gmail.com",
      recipient: "dydai26@gmail.com", // Явно вказуємо отримувача
      to_name: "Адміністратор",       // Ім'я адміністратора, який отримує листа
      customer_name: `${orderData.customer.firstName} ${orderData.customer.lastName}`,
      customer_email: orderData.customer.email,
      customer_phone: orderData.customer.phone,
      shipping_address: `${orderData.customer.address}, ${orderData.customer.city}, ${orderData.customer.postalCode}, ${orderData.customer.country}`,
      order_date: new Date(orderData.date).toLocaleDateString(),
      items_list: itemsList,
      subtotal: `€${orderData.subtotal.toFixed(2)}`,
      shipping: `€${(orderData.shipping?.price || 0).toFixed(2)}`,
      total: `€${orderData.total.toFixed(2)}`,
      payment_method: orderData.paymentInfo ? "Credit Card (Stripe)" : "N/A",
      shipping_method: orderData.shipping?.name || "Standard Shipping",
      email: "dydai26@gmail.com" // Додаємо явний email параметр, який EmailJS може вимагати
    };
    
    console.log("Sending order confirmation email with params:", templateParams);
    
    const result = await emailjs.send(
      "service_xzm5uka", // Використовуємо сервіс ID як вказано користувачем
      "template_gofuiw7", 
      templateParams
    );
    
    console.log("Order confirmation email sent successfully:", result);
    return result;
    
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    throw error;
  }
};
