import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

interface StripePaymentFormProps {
  onPaymentSuccess: (paymentInfo: any) => void;
  processingPayment: boolean;
  setProcessingPayment: (processing: boolean) => void;
  total: number;
  promoCode?: string;
  shippingCost: number;
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
  promoCode,
  shippingCost,
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
      const paymentMethodResult = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: customerInfo.name,
          email: customerInfo.email,
          address: {
            line1: customerInfo.address
          }
        }
      } as any);

      const { error, paymentMethod } = paymentMethodResult;

      if (error) {
        console.error("Stripe error:", error);
        setCardError(error.message || 'An error occurred with your payment');
        setProcessingPayment(false);
        return;
      }

      console.log("Payment method created:", paymentMethod);

      try {
        const { createPayment } = await import('@/lib/stripe');
        
        // Map cart items to send only product ID and quantity (safe)
        const itemsPayload = orderInfo.items.map((item: any) => ({
          id: item.product.id,
          quantity: item.quantity
        }));

        const paymentResult = await createPayment(
          paymentMethod.id,
          itemsPayload,
          promoCode,
          shippingCost,
          'eur',
          {
            orderId: orderInfo.id,
            customerName: customerInfo.name,
            customerEmail: customerInfo.email
          }
        );

        console.log("Payment result:", paymentResult);

        if (paymentResult.status === 'requires_action' && paymentResult.client_secret) {
          console.log("Payment requires action (3D Secure)");

          const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(paymentResult.client_secret);

          if (confirmError) {
            console.error("Error confirming payment:", confirmError);
            setCardError(confirmError.message || 'Payment authentication failed');
            setProcessingPayment(false);
            return;
          }

          if (paymentIntent && paymentIntent.status === 'succeeded') {
            console.log("Payment confirmed successfully via 3DS");
            onPaymentSuccess({
              id: paymentIntent.id,
              brand: paymentMethod.card?.brand,
              last4: paymentMethod.card?.last4,
              amount: total,
              status: paymentIntent.status,
            });
          } else {
            setCardError('Payment validation failed');
            setProcessingPayment(false);
          }
        } else if (paymentResult.status === 'succeeded') {
          onPaymentSuccess({
            id: paymentResult.id,
            brand: paymentMethod.card?.brand,
            last4: paymentMethod.card?.last4,
            amount: total,
            status: paymentResult.status,
          });
        } else {
          // Handle other statuses or weird states
          console.warn("Unexpected payment status:", paymentResult.status);
          setCardError('Payment failed to capture');
          setProcessingPayment(false);
        }

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
              hidePostalCode: true,
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


    </form>
  );
};

export default StripePaymentForm;