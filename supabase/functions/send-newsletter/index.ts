import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NewsletterRequest {
  campaignId: string;
}

// Rate limiting and retry helpers for Resend (to avoid 429 rate_limit_exceeded)
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function sendEmailWithRetry(
  resend: Resend,
  to: string,
  subject: string,
  html: string,
  attachments?: any[],
  maxRetries = 4
): Promise<{ id?: string } | undefined> {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      const { data, error } = await resend.emails.send({
        from: "ECOVLUU <info@ecovluu.com>",
        to: [to],
        subject,
        html,
        attachments,
      });

      if (error) throw error;
      return { id: data?.id };
    } catch (e: any) {
      attempt++;
      if (attempt >= maxRetries) throw e;
      // Exponential backoff with jitter
      const backoff = Math.min(2000, 400 * Math.pow(2, attempt)) + Math.floor(Math.random() * 200);
      console.warn(`Retrying ${to} (attempt ${attempt}) after ${backoff}ms due to:`, e);
      await sleep(backoff);
    }
  }
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Newsletter function called");

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendApiKey = Deno.env.get('RESEND_API_KEY')!;

    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY not configured');
    }

    // Initialize clients
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const resend = new Resend(resendApiKey);
    
    console.log("Supabase client initialized with URL:", supabaseUrl);

    const { campaignId, emailHtml }: NewsletterRequest & { emailHtml?: string } = await req.json();
    console.log("Processing campaign:", campaignId);

    // Get campaign details
    const { data: campaign, error: campaignError } = await supabase
      .from('newsletter_campaigns')
      .select('*')
      .eq('id', campaignId)
      .single();

    if (campaignError || !campaign) {
      console.error("Campaign not found:", campaignError);
      throw new Error('Campaign not found');
    }

    // Get active subscribers
    console.log("Fetching active subscribers...");
    const { data: subscribers, error: subscribersError } = await supabase
      .from('newsletter_subscribers')
      .select('email')
      .eq('is_active', true);

    console.log("Subscribers query result:", { subscribers, subscribersError });

    if (subscribersError) {
      console.error("Error fetching subscribers:", subscribersError);
      throw new Error('Failed to fetch subscribers');
    }

    if (!subscribers || subscribers.length === 0) {
      console.log("No active subscribers found");
      throw new Error('No active subscribers found');
    }

    console.log(`Found ${subscribers.length} active subscribers:`, subscribers.map(s => s.email));
    console.log(`Sending to ${subscribers.length} subscribers`);

    // Send emails using Resend
    let successCount = 0;
    let failureCount = 0;
    const errorDetails: { email: string; error: string }[] = [];

    const RATE_DELAY_MS = 600; // ~2 requests per second (Resend limit)
    let index = 0;
    for (const subscriber of subscribers) {
      try {
        if (index > 0) {
          await sleep(RATE_DELAY_MS);
        }
        // Use provided emailHtml or generate template
        let finalEmailHtml = emailHtml;
        let logoBase64 = '';
        
        if (!emailHtml) {
          // Read and encode logo as base64 for default template
          try {
            const logoPath = './logo.png';
            const logoFile = await Deno.readFile(logoPath);
            logoBase64 = btoa(String.fromCharCode(...logoFile));
          } catch (error) {
            console.warn('Could not load logo file:', error);
          }

          finalEmailHtml = `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                <div style="background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <!-- Header with Logo -->
                  <div style="text-align: center; margin-bottom: 30px;">
                    ${logoBase64 ? `<img src="cid:ecovluu-logo" alt="ECOVLUU Logo" style="height: 60px;" />` : '<div style="height: 60px; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #8B5A3C;">ECOVLUU</div>'}
                  </div>
                  
                  <!-- Main Content -->
                  <div style="background-color: #f8f9fa; padding: 25px; border-radius: 6px; margin-bottom: 30px; border-left: 4px solid #8B5A3C; text-align: center;">
                    <div style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 auto; text-align: center; display: block;">
                      ${campaign.content.replace(/\n/g, '<br>')}
                    </div>
                  </div>
                  
                  <!-- Footer with Company Info -->
                  <div style="text-align: center; color: #666; font-size: 14px; line-height: 1.5; border-top: 1px solid #eee; padding-top: 20px;">
                    <div style="margin-bottom: 15px;">
                      <div>A6, Block A, Santry Business Park,</div>
                      <div>Swords Road, Santry,</div>
                      <div>Dublin 9, Ireland</div>
                    </div>
                    <div style="margin-top: 15px;">
                      <a href="https://ecovluu.com" style="color: #8B5A3C; text-decoration: none; font-weight: 500;">https://ecovluu.com</a>
                    </div>
                  </div>
                </div>
              </body>
            </html>
          `;
        }

        const res = await sendEmailWithRetry(
          resend,
          subscriber.email,
          campaign.subject,
          finalEmailHtml,
          logoBase64
            ? [
                {
                  filename: 'logo.png',
                  content: logoBase64,
                  content_id: 'ecovluu-logo',
                },
              ]
            : undefined
        );
        successCount++;
        console.log(`Email sent to: ${subscriber.email}, ID: ${res?.id}`);
      } catch (emailError: any) {
        console.error(`Failed to send email to ${subscriber.email}:`, emailError);
        failureCount++;
        errorDetails.push({ email: subscriber.email, error: String(emailError?.message || emailError) });
      }
      index++;
    }

    // Update campaign status based on results
    const newStatus = successCount > 0 ? 'sent' : 'failed';
    const { error: updateError } = await supabase
      .from('newsletter_campaigns')
      .update({
        status: newStatus,
        sent_at: new Date().toISOString(),
        recipients_count: successCount,
      })
      .eq('id', campaignId);

    if (updateError) {
      console.error("Error updating campaign:", updateError);
    }

    console.log(`Campaign result: ${successCount} success, ${failureCount} failures`);

    if (successCount === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'All emails failed to send',
          successCount,
          failureCount,
          errors: errorDetails,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Newsletter sent successfully to ${successCount} recipients (failed: ${failureCount})`,
        successCount,
        failureCount,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error("Error in send-newsletter function:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);