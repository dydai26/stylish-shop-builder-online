
import { Package, Truck } from "lucide-react";
import { OrderData } from "@/components/checkout/types";

interface OrderDetailsProps {
  orderData: OrderData;
}

const OrderDetails = ({ orderData }: OrderDetailsProps) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg mb-8">
      <h2 className="text-xl font-bold mb-4 flex items-center justify-center gap-2">
        <Package className="h-5 w-5" />
        Order #{orderData.orderId}
      </h2>
      
      <div className="mb-4">
        <div className="font-medium mb-2 flex items-center justify-center gap-2">
          <Truck className="h-4 w-4" />
          Expected Delivery
        </div>
        <div className="text-gray-600">3-5 business days</div>
      </div>
      
      <div className="mb-4">
        <div className="font-medium mb-2">Customer Details</div>
        <div className="text-gray-600">
          {orderData.customer.firstName} {orderData.customer.lastName}<br />
          Phone: {orderData.customer.phone}
        </div>
      </div>
      
      <div className="mb-4">
        <div className="font-medium mb-2">Shipping Address</div>
        <div className="text-gray-600">
          {orderData.customer.address}<br />
          {orderData.customer.city}, {orderData.customer.postalCode}<br />
          {orderData.customer.country}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
