
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useCart } from "@/context/CartContext";
import { useOrder } from "@/context/OrderContext";
import { sendOrderConfirmationEmail } from "@/components/checkout/EmailService";
import OrderSuccessHeader from "@/components/order/OrderSuccessHeader";
import OrderDetails from "@/components/order/OrderDetails";
import OrderItems from "@/components/order/OrderItems";
import PaymentInfo from "@/components/order/PaymentInfo";
import OrderActions from "@/components/order/OrderActions";

const OrderSuccess = () => {
  const { clearCart } = useCart();
  const { orderData } = useOrder();
  const navigate = useNavigate();
  const location = useLocation();
  const [dataProcessed, setDataProcessed] = useState(false);
  const orderDataFromState = location.state?.orderData;
  
  useEffect(() => {
    console.log("OrderSuccess mount, orderData:", orderData);
    console.log("OrderSuccess mount, orderDataFromState:", orderDataFromState);
    
    if (!orderData && !orderDataFromState) {
      navigate("/");
      return;
    }
    
    if (!dataProcessed) {
      clearCart();
      
      const dataToUse = orderData || orderDataFromState;
      if (dataToUse) {
        sendOrderConfirmationEmail(dataToUse)
          .catch(err => console.error("Failed to send order confirmation email:", err));
      }
      
      setDataProcessed(true);
    }
  }, [orderData, orderDataFromState, navigate, clearCart, dataProcessed]);

  const dataToDisplay = orderData || orderDataFromState;

  if (!dataToDisplay) {
    return null;
  }

  return (
    <Layout>
      <div className="bg-gray-50 py-16">
        <div className="container-custom max-w-2xl">
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <OrderSuccessHeader />
            
            <OrderDetails orderData={dataToDisplay} />
            
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <OrderItems orderData={dataToDisplay} />
              
              <PaymentInfo paymentInfo={dataToDisplay.paymentInfo} />
            </div>
            
            <OrderActions />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderSuccess;
