// Using import_map.json specifiers
import Stripe from "stripe";
import { createClient } from "supabase";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CartItemPayload {
  id: number;
  quantity: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      paymentMethodId, 
      items, 
      promoCode, 
      shippingCost = 0, 
      currency = "eur", 
      metadata = {} 
    }: {
      paymentMethodId: string;
      items: CartItemPayload[];
      promoCode?: string;
      shippingCost?: number;
      currency?: string;
      metadata?: Record<string, string>;
    } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("Invalid or empty items list");
    }

    // Initialize Supabase Client with Service Role Key (Secure)
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch product prices from DB
    const productIds = items.map((item) => item.id);
    const { data: dbProducts, error: dbError } = await supabase
      .from("products")
      .select("id, price")
      .in("id", productIds);

    if (dbError || !dbProducts) {
      console.error("Error fetching products from database:", dbError);
      throw new Error("Failed to retrieve product details");
    }

    // Calculate subtotal
    let subtotal = 0;
    for (const item of items) {
      const dbProduct = dbProducts.find((p: { id: number; price: number | string }) => p.id === item.id);
      if (!dbProduct) {
        throw new Error(`Product not found in database: ${item.id}`);
      }
      const price = typeof dbProduct.price === "string" ? parseFloat(dbProduct.price) : dbProduct.price;
      subtotal += price * item.quantity;
    }

    // Calculate promo code discount if applicable
    let discountAmount = 0;
    if (promoCode) {
      const { data: promo, error: promoError } = await supabase
        .from("promo_codes")
        .select("*")
        .eq("code", promoCode.toUpperCase())
        .eq("is_active", true)
        .maybeSingle();

      if (promoError) {
        console.error("Error checking promo code:", promoError);
      }

      if (promo) {
        if (!promo.max_usage_count || promo.usage_count < promo.max_usage_count) {
          discountAmount = (subtotal * promo.discount_percentage) / 100;
        }
      }
    }

    const discountedSubtotal = subtotal - discountAmount;
    
    // Add the automatically calculated shipping cost from the client
    const total = discountedSubtotal + shippingCost;

    // Initialize Stripe using secret key
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
      apiVersion: "2023-10-16",
    });

    const amountInCents = Math.round(total * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency,
      payment_method: paymentMethodId,
      metadata: {
        ...metadata,
        subtotal: subtotal.toFixed(2),
        discount: discountAmount.toFixed(2),
        shipping: shippingCost.toFixed(2),
        total: total.toFixed(2)
      },
      confirm: true,
      description: "Payment from EcoVluu shop",
      return_url: "https://www.ecovluu.com/order-success",
    });

    return new Response(
      JSON.stringify({
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: total,
        currency,
        metadata: paymentIntent.metadata,
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
