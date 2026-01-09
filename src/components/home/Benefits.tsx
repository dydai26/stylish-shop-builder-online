import * as React from "react";
import { Truck, CreditCard, RefreshCw } from "lucide-react";

const Benefits = () => {
  return (
    <div className="py-8 md:py-12 bg-gray-50">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center">
          <div className="flex flex-col items-center px-4">
            <div className="bg-white p-3 md:p-4 rounded-full mb-3 md:mb-4 shadow-sm">
              <CreditCard className="h-8 w-8 md:h-10 md:w-10 text-black" />
            </div>
            <h3 className="font-medium text-lg md:text-xl mb-2">Easy Payment</h3>
            <p className="text-black text-sm md:text-base leading-relaxed">Pay for the order online quickly without stress!</p>
          </div>
          
          <div className="flex flex-col items-center px-4">
            <div className="bg-white p-3 md:p-4 rounded-full mb-3 md:mb-4 shadow-sm">
              <RefreshCw className="h-8 w-8 md:h-10 md:w-10 text-black" />
            </div>
            <h3 className="font-medium text-lg md:text-xl mb-2">Money Back Guarantee</h3>
            <p className="text-black text-sm md:text-base leading-relaxed">If your order isn't perfect, refund accepted for damaged items within 14 days.</p>
          </div>
          
          <div className="flex flex-col items-center px-4">
            <div className="bg-white p-3 md:p-4 rounded-full mb-3 md:mb-4 shadow-sm">
              <Truck className="h-8 w-8 md:h-10 md:w-10 text-black" />
            </div>
            <h3 className="font-medium text-lg md:text-xl mb-2">Fast Shipping</h3>
            <p className="text-black text-sm md:text-base leading-relaxed">Get your favourite products delivered quickly to your door!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Benefits;

