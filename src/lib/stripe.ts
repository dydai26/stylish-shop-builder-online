
import { loadStripe } from "@stripe/stripe-js";
import { STRIPE_PUBLISHABLE_KEY } from "./constants";
import { createClient } from '@supabase/supabase-js';
import Stripe from "stripe";

export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

// Initialize Supabase client
const supabase = createClient(
  'https://inivoiunisrgdinrcquu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluaXZvaXVuaXNyZ2RpbnJjcXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNzY0OTgsImV4cCI6MjA1OTg1MjQ5OH0.Ruox-xcKxcirSSmTsNHpPIXqUyFCApZOisJViI_Hp1w'
);

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

    if (error) throw error;
    console.log("Payment created:", data);
    
    return data;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
};
