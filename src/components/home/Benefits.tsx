import React from "react";
import { Truck, CreditCard, RefreshCw } from "lucide-react";

const Benefits = () => {
  return (
    <div className="py-12 bg-gray-50">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-full mb-4 shadow-sm">
              <CreditCard className="h-10 w-10 text-brand-brown" />
            </div>
            <h3 className="font-medium text-xl mb-2">Easy Payment</h3>
            <p className="text-gray-600">Pay for the order online quickly without stress!</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-full mb-4 shadow-sm">
              <RefreshCw className="h-10 w-10 text-brand-brown" />
            </div>
            <h3 className="font-medium text-xl mb-2">Money Back Guarantee</h3>
            <p className="text-gray-600">If your order isn't perfect, refund accepted for damaged items within 14 days.</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-full mb-4 shadow-sm">
              <Truck className="h-10 w-10 text-brand-brown" />
            </div>
            <h3 className="font-medium text-xl mb-2">Fast Shipping</h3>
            <p className="text-gray-600">Get your favourite products delivered quickly to your door!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Benefits;

