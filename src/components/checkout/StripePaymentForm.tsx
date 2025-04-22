
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

interface StripePaymentFormProps {
  onPaymentSuccess: (paymentInfo: any) => void;
  processingPayment: boolean;
  setProcessingPayment: (processing: boolean) => void;
  total: number;
  customerInfo: {
    name: string;
    email: string;
    address: string;
  };
  orderInfo: {
    id: string;
    items: any[];
  };
}

const StripePaymentForm = ({
  onPaymentSuccess,
  processingPayment,
  setProcessingPayment,
  total,
  customerInfo,
  orderInfo
}: StripePaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      console.log("Stripe not loaded");
      return;
    }
    
    setProcessingPayment(true);
    setCardError(null);
    
    try {
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('Card element not found');
      }
      
      console.log("Creating payment method...");
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: customerInfo.name,
          email: customerInfo.email,
          address: {
            line1: customerInfo.address
          }
        }
      });
      
      if (error) {
        console.error("Stripe error:", error);
        setCardError(error.message || 'An error occurred with your payment');
        setProcessingPayment(false);
        return;
      }
      
      console.log("Payment method created:", paymentMethod);
      
      try {
        const { createPayment } = await import('@/lib/stripe');
        const paymentResult = await createPayment(
          paymentMethod.id,
          total,
          'eur',
          {
            orderId: orderInfo.id,
            customerName: customerInfo.name,
            customerEmail: customerInfo.email
          }
        );
        
        console.log("Payment result:", paymentResult);
        
        onPaymentSuccess({
          id: paymentResult.id,
          brand: paymentMethod.card?.brand,
          last4: paymentMethod.card?.last4,
          amount: total,
          status: paymentResult.status,
        });
        
      } catch (paymentError: any) {
        console.error("Payment error:", paymentError);
        setCardError(paymentError.message || 'An error occurred with your payment');
        setProcessingPayment(false);
      }
      
    } catch (err: any) {
      console.error("Payment error:", err);
      setCardError(err.message || 'An error occurred with your payment');
      setProcessingPayment(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details
        </label>
        <div className="p-3 border border-gray-300 rounded">
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
        {cardError && (
          <div className="mt-2 text-sm text-red-600">
            {cardError}
          </div>
        )}
      </div>
      
      <Button 
        type="submit" 
        disabled={!stripe || processingPayment}
        className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white font-medium py-3 rounded"
      >
        {processingPayment ? 'Processing...' : `Pay €${total.toFixed(2)}`}
      </Button>
      
      <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded">
        <p className="font-medium">Test Card Information:</p>
        <p>Card number: 4242 4242 4242 4242</p>
        <p>Expiry date: Any future date</p>
        <p>CVC: Any 3 digits</p>
        <p>ZIP: Any 5 digits</p>
        <p className="mt-2 text-xs text-gray-500">Note: This is a test mode payment that will appear in your Stripe dashboard.</p>
      </div>
    </form>
  );
};

export default StripePaymentForm;
