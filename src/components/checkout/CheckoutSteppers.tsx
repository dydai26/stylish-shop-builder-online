
import { Truck, Check } from "lucide-react";

interface CheckoutStepperProps {
  currentStep: number;
}

const CheckoutStepper = ({ currentStep }: CheckoutStepperProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        <div className="flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
            currentStep >= 1 ? "bg-brand-orange text-white" : "bg-gray-200 text-gray-600"
          }`}>
            {currentStep > 1 ? <Check className="h-5 w-5" /> : "1"}
          </div>
          <span className="text-sm font-medium">Personal Information</span>
        </div>
        
        <div className="flex-1 h-1 mx-2 md:mx-4 bg-gray-200">
          <div className={`h-full ${currentStep >= 2 ? "bg-brand-orange" : "bg-gray-200"}`} style={{ width: currentStep >= 2 ? "100%" : "0%" }}></div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
            currentStep >= 2 ? "bg-brand-orange text-white" : "bg-gray-200 text-gray-600"
          }`}>
            {currentStep > 2 ? <Check className="h-5 w-5" /> : "2"}
          </div>
          <span className="text-sm font-medium">Shipping</span>
        </div>
        
        <div className="flex-1 h-1 mx-2 md:mx-4 bg-gray-200">
          <div className={`h-full ${currentStep >= 3 ? "bg-brand-orange" : "bg-gray-200"}`} style={{ width: currentStep >= 3 ? "100%" : "0%" }}></div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
            currentStep >= 3 ? "bg-brand-orange text-white" : "bg-gray-200 text-gray-600"
          }`}>
            {currentStep > 3 ? <Check className="h-5 w-5" /> : "3"}
          </div>
          <span className="text-sm font-medium">Payment</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutStepper;
