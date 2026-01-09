import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReceiptRequest {
  customerEmail: string;
  customerName: string;
  orderId: string;
  receiptFile: {
    filename: string;
    content: string; // base64
    contentType: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Send receipt function called");

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY')!;

    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY not configured');
    }

    const resend = new Resend(resendApiKey);
    
    const { customerEmail, customerName, orderId, receiptFile }: ReceiptRequest = await req.json();
    console.log(`Sending receipt to ${customerEmail} for order ${orderId}`);

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="https://ecovluu.com/intro.png" alt="ECOVLUU Logo" style="max-width: 200px; height: auto; margin-bottom: 20px;" />
              <div style="font-size: 32px; font-weight: bold; color: #8B5A3C; letter-spacing: 2px;">ECOVLUU</div>
            </div>
            
            <div style="margin-bottom: 30px;">
              <h2 style="color: #333; margin-bottom: 20px;">Your Order Has Been Shipped!</h2>
              <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">Hello, ${customerName}!</p>
              <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">
                Your order <strong>#${orderId}</strong> has been shipped. You will find the delivery receipt in the attachment.
              </p>
              <p style="color: #666; line-height: 1.6;">
                Thank you for your purchase!
              </p>
            </div>
            
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

    const { data, error } = await resend.emails.send({
      from: "ECOVLUU <info@ecovluu.com>",
      to: [customerEmail],
      subject: `Your Order #${orderId} Has Been Shipped`,
      html: emailHtml,
      attachments: [
        {
          filename: receiptFile.filename,
          content: receiptFile.content,
        },
      ],
    });

    if (error) {
      console.error("Resend error:", error);
      throw error;
    }

    console.log(`Receipt sent successfully to ${customerEmail}, ID: ${data?.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Receipt sent successfully to ${customerEmail}`,
        emailId: data?.id,
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
    console.error("Error in send-receipt function:", error);
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
