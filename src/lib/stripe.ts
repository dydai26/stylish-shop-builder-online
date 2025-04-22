import { loadStripe } from "@stripe/stripe-js";
import { STRIPE_PUBLISHABLE_KEY } from "./constants";
import Stripe from "stripe";

export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

// For server-side operations that require a secret key
// This would normally be handled by a secure backend service like Supabase Edge Functions
// We're using runtime environment variables here, but this code should be in a secure backend
const getStripeInstance = () => {
  // This should NEVER be exposed in client-side code
  // In production, this should be accessed ONLY from a secure backend environment
  if (typeof process !== 'undefined' && process.env.STRIPE_SECRET_KEY) {
    return new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
    });
  }
  
  // For security reasons, if the secret key isn't available through proper channels,
  // we don't provide a fallback that could expose sensitive keys
  console.error("Stripe secret key not available in environment. Use Supabase Edge Functions for Stripe operations.");
  throw new Error("Stripe secret key not available. Payment operations cannot proceed.");
};

/**
 * Creates a payment with Stripe in live mode.
 * This function should be called from a secure backend environment only.
 */
export const createTestPayment = async (
  paymentMethodId: string, 
  amount: number, 
  currency: string = 'eur',
  metadata: Record<string, string> = {}
) => {
  try {
    console.log("Creating payment with Stripe...", { paymentMethodId, amount, currency });
    
    // This would ideally be a secure API call to a backend service
    // For demo purposes, we're keeping the same function signature
    // but this should be refactored to call a Supabase Edge Function
    
    // Create a PaymentIntent with the order amount and currency
    const stripeServer = getStripeInstance();
    const paymentIntent = await stripeServer.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amount in cents
      currency,
      payment_method: paymentMethodId,
      metadata,
      confirm: true, // Confirm the payment immediately
      description: "Payment from EcoVoula shop",
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
