
import { Link } from "react-router-dom";

const OrderActions = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link
        to="/shop"
        className="bg-brand-orange text-white font-medium px-6 py-3 rounded hover:bg-brand-orange/90 transition-colors"
      >
        Continue Shopping
      </Link>
      
      <Link
        to="/"
        className="bg-white text-brand-brown border border-brand-brown font-medium px-6 py-3 rounded hover:bg-gray-50 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default OrderActions;
