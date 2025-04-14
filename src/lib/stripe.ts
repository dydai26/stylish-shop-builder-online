
import { loadStripe } from "@stripe/stripe-js";
import { STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY } from "./constants";
import Stripe from "stripe";

export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

// Create a Stripe instance for server-side operations
// Note: This is not the recommended approach for production
// In production, this should be handled by a secure backend
const stripeServer = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
});

/**
 * Creates a payment with Stripe in test mode.
 * This function will create an actual test payment that appears in Stripe dashboard.
 */
export const createTestPayment = async (
  paymentMethodId: string, 
  amount: number, 
  currency: string = 'eur',
  metadata: Record<string, string> = {}
) => {
  try {
    console.log("Creating payment with Stripe...", { paymentMethodId, amount, currency });
    
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripeServer.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amount in cents
      currency,
      payment_method: paymentMethodId,
      metadata,
      confirm: true, // Confirm the payment immediately
      description: "Test payment from EcoVoula shop",
      return_url: window.location.origin + "/order-success",
    });
    
    console.log("Payment intent created:", paymentIntent);
    
    return {
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: amount,
      currency: currency,
      metadata
    };
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
};
