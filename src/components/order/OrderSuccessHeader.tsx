
import { CheckCircle } from "lucide-react";

const OrderSuccessHeader = () => {
  return (
    <>
      <div className="flex justify-center mb-6">
        <CheckCircle className="h-20 w-20 text-green-500" />
      </div>
      
      <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
      
      <p className="text-gray-600 mb-6">
        Your order has been placed successfully. We'll send you tracking information when the order ships.
      </p>
    </>
  );
};

export default OrderSuccessHeader;
