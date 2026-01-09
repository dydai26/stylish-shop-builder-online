
import { loadStripe } from "@stripe/stripe-js";
import { STRIPE_PUBLISHABLE_KEY } from "./constants";
import { supabase } from "@/integrations/supabase/client";

export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

export const createPayment = async (
  paymentMethodId: string, 
  amount: number, 
  currency: string = 'eur',
  metadata: Record<string, string> = {}
) => {
  try {
    console.log("Calling create-payment function...", { paymentMethodId, amount, currency });
    
    const { data, error } = await supabase.functions.invoke('create-payment', {
      body: {
        paymentMethodId,
        amount,
        currency,
        metadata,
      }
    });

    if (error) {
      console.error("Edge function error:", error);
      let errorMessage = "Payment failed. Please try another card.";
      
      try {
        const resp = (error as any).context?.response;
        if (resp) {
          const details = await resp.clone().json().catch(() => null);
          if (details) {
            if (details.decline_code === 'insufficient_funds') {
              errorMessage = "Your card has insufficient funds. Please try another card.";
            } else if (details.decline_code === 'generic_decline' || details.code === 'card_declined') {
              errorMessage = "Your card was declined. Please try another card.";
            } else if (details.error) {
              errorMessage = details.error;
            }
          }
        }
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
      }
      
      throw new Error(errorMessage);
    }
    console.log("Payment created:", data);
    
    return data;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
};