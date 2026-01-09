// Використовуємо esm.sh для Stripe у Deno
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { paymentMethodId, amount, currency = "eur", metadata = {} } = await req.json();

    // Ініціалізація Stripe через секретний ключ (налаштований у Supabase secrets)
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
      apiVersion: "2023-10-16",
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe очікує amount у центах
      currency,
      payment_method: paymentMethodId,
      metadata,
      confirm: true,
      description: "Payment from EcoVoula shop",
      return_url: "https://www.ecovluu.com/order-success",
    });

    return new Response(
      JSON.stringify({
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount,
        currency,
        metadata,
        client_secret: paymentIntent.client_secret,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );

  } catch (error: unknown) {
    console.error("Error creating payment:", error);
    
    const stripeError = error as { type?: string; message?: string; decline_code?: string; code?: string };
    
    // Якщо це помилка Stripe, повертаємо більш детальну інформацію
    if (stripeError.type) {
      return new Response(
        JSON.stringify({ 
          error: stripeError.message,
          type: stripeError.type,
          decline_code: stripeError.decline_code,
          code: stripeError.code
        }), 
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
    
    return new Response(JSON.stringify({ error: stripeError.message || "Unknown error" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
