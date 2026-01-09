
import React from "react";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";
import StripePaymentForm from "./StripePaymentForm";
import { CheckoutFormData } from "./types";

interface PaymentStepProps {
  formData: CheckoutFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handlePrevStep: () => void;
  handlePaymentSuccess: (paymentInfo: any) => void;
  processingPayment: boolean;
  setProcessingPayment: (processing: boolean) => void;
  total: number;
  cartItems: any[];
}

const PaymentStep = ({
  formData,
  handleChange,
  handlePrevStep,
  handlePaymentSuccess,
  processingPayment,
  setProcessingPayment,
  total,
  cartItems
}: PaymentStepProps) => {
  return (
    <div>
      <div className="flex items-center mb-6">
        <CreditCard className="h-5 w-5 text-brand-orange mr-2" />
        <h2 className="text-xl font-bold">Payment Information</h2>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
        <div className="flex flex-col space-y-1">
          <div className="flex items-center space-x-2 rounded-md border p-3">
            <input 
              type="radio" 
              id="stripe" 
              name="paymentMethod"
              value="stripe"
              checked={formData.paymentMethod === "stripe"}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <label htmlFor="stripe" className="flex-1">
              <div className="font-medium">Credit Card</div>
              <div className="text-sm text-gray-500">Pay securely with your credit card</div>
            </label>
            <div className="flex gap-1">
              <img src="/Item4 → SVG.png" alt="Visa" className="h-6 w-10 rounded" />
              <img src="/Item3 → SVG.png" alt="Mastercard" className="h-6 w-10 rounded" />
            </div>
          </div>
        </div>
      </div>
      
      {formData.paymentMethod === "stripe" && (
        <Elements stripe={stripePromise}>
          <StripePaymentForm 
            onPaymentSuccess={handlePaymentSuccess}
            processingPayment={processingPayment}
            setProcessingPayment={setProcessingPayment}
            total={total}
            customerInfo={{
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              address: formData.address
            }}
            orderInfo={{
              id: `EC${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
              items: cartItems
            }}
          />
        </Elements>
      )}
      
      <div className="flex justify-between mt-6">
        <Button 
          onClick={handlePrevStep}
          variant="outline"
          disabled={processingPayment}
        >
          Back
        </Button>
      </div>
    </div>
  );
};

export default PaymentStep;
