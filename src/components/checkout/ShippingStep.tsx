
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  RefreshCw, 
  Truck, 
  HelpCircle,
  AlertTriangle
} from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckoutFormData } from "./types";
import { UPSShippingRate } from "@/lib/supabase";

interface ShippingStepProps {
  formData: CheckoutFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handlePrevStep: () => void;
  handleNextStep: () => void;
  validateAddress: () => Promise<void>;
  isValidatingAddress: boolean;
  shippingRates: UPSShippingRate[];
}

const ShippingStep = ({ 
  formData,
  handleChange,
  handlePrevStep,
  handleNextStep,
  validateAddress,
  isValidatingAddress,
  shippingRates
}: ShippingStepProps) => {
  const [apiErrorOccurred, setApiErrorOccurred] = useState(false);
  
  // Add fallback shipping options to use when API fails
  const fallbackShippingRates = [
    {
      serviceCode: "fallback_standard",
      serviceName: "Standard Delivery",
      totalPrice: 5.99,
      currency: "EUR",
      deliveryTimeEstimate: "3-5 business days"
    },
    {
      serviceCode: "fallback_express",
      serviceName: "Express Delivery",
      totalPrice: 12.99,
      currency: "EUR",
      deliveryTimeEstimate: "1-2 business days"
    },
    {
      serviceCode: "fallback_economy",
      serviceName: "Economy Delivery",
      totalPrice: 3.99,
      currency: "EUR",
      deliveryTimeEstimate: "5-7 business days"
    }
  ];

  // Use fallback rates if API returns empty and user has tried to validate
  const displayRates = shippingRates.length > 0 ? shippingRates : (apiErrorOccurred ? fallbackShippingRates : []);

  const handleValidateAddress = async () => {
    try {
      setApiErrorOccurred(false);
      await validateAddress();
    } catch (error) {
      console.error("Error in validate address:", error);
      setApiErrorOccurred(true);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <h2 className="text-xl font-bold">Shipping Information</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-5 w-5 text-gray-500" />
            </TooltipTrigger>
            <TooltipContent className="max-w-[250px] text-center">
              <p>Validating your address helps calculate the most accurate shipping costs. UPS will verify and potentially correct your shipping details.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <form className="space-y-4">
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City *</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Select a country</option>
            <option value="Ireland">Ireland</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="France">France</option>
            <option value="Germany">Germany</option>
            <option value="Spain">Spain</option>
            <option value="Italy">Italy</option>
            <option value="Netherlands">Netherlands</option>
            <option value="Belgium">Belgium</option>
            <option value="Portugal">Portugal</option>
            <option value="Switzerland">Switzerland</option>
            <option value="Austria">Austria</option>
            <option value="Poland">Poland</option>
            <option value="Sweden">Sweden</option>
            <option value="Denmark">Denmark</option>
            <option value="Norway">Norway</option>
            <option value="Finland">Finland</option>
            <option value="Greece">Greece</option>
          </select>
        </div>
        
        {apiErrorOccurred && (
          <Alert variant="destructive" className="bg-red-100 border-red-200">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>
              We couldn't connect to the UPS shipping provider. Please try again or contact support if the problem persists.
            </AlertDescription>
          </Alert>
        )}
        
        {displayRates.length > 0 && (
          <div className="mt-6 border-t pt-4">
            <h3 className="font-medium mb-3">Select Shipping Method</h3>
            <div className="space-y-2">
              {displayRates.map((rate) => (
                <label key={rate.serviceCode} className="flex items-center justify-between border p-3 rounded hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value={rate.serviceCode}
                      checked={formData.shippingMethod === rate.serviceCode}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <div>
                      <p className="font-medium">{rate.serviceName}</p>
                      <p className="text-sm text-gray-500">{rate.deliveryTimeEstimate}</p>
                    </div>
                  </div>
                  <span className="font-bold">€{rate.totalPrice.toFixed(2)}</span>
                </label>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-between mt-6">
          <Button 
            onClick={handlePrevStep}
            variant="outline"
          >
            Back
          </Button>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    type="button" 
                    onClick={handleValidateAddress} 
                    variant="outline" 
                    size="sm"
                    disabled={isValidatingAddress}
                    className="mr-2"
                  >
                    {isValidatingAddress ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Validating...
                      </>
                    ) : (
                      <>
                        <Truck className="mr-2 h-4 w-4" />
                        Calculate Shipping
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-[250px] text-center">
                  <p>Click here to calculate shipping costs. This validates your address with UPS and shows available shipping options with prices.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button 
              onClick={handleNextStep}
              className="bg-brand-orange hover:bg-brand-orange/90 text-white"
            >
              Continue to Payment
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ShippingStep;
