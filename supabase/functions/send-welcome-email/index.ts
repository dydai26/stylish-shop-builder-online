import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WelcomeEmailRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('Welcome email function called');

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: WelcomeEmailRequest = await req.json();
    console.log('Sending welcome email to:', email);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Read the logo file
    const logoResponse = await fetch('https://inivoiunisrgdinrcquu.supabase.co/storage/v1/object/public/product-images/Layer_1.png');
    const logoBuffer = await logoResponse.arrayBuffer();
    const logoBase64 = btoa(String.fromCharCode(...new Uint8Array(logoBuffer)));

    // Create welcome email HTML template
    const emailHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to ECOVLUU</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f4f4f4;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              }
              .header {
                  text-align: center;
                  padding: 20px 0;
                  border-bottom: 2px solid #4A3F3B;
                  margin-bottom: 30px;
              }
              .logo {
                  max-width: 200px;
                  height: auto;
              }
              .content {
                  padding: 20px 0;
                  text-align: center;
              }
              .title {
                  font-size: 28px;
                  color: #4A3F3B;
                  margin-bottom: 20px;
                  font-weight: bold;
              }
              .message {
                  font-size: 16px;
                  color: #666;
                  line-height: 1.6;
                  margin-bottom: 30px;
              }
              .footer {
                  text-align: center;
                  padding: 20px 0;
                  border-top: 1px solid #e0e0e0;
                  margin-top: 30px;
                  font-size: 12px;
                  color: #999;
              }
              .social-links {
                  margin: 20px 0;
              }
              .social-links a {
                  margin: 0 10px;
                  text-decoration: none;
                  color: #4A3F3B;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <img src="data:image/png;base64,${logoBase64}" alt="ECOVLUU" class="logo">
              </div>
              
              <div class="content">
                  <h1 class="title">Congratulations!</h1>
                  <p class="message">
                      We are glad that you have joined the ecoflow family.<br>
                      Follow the news and promotions!
                  </p>
                  
                  <div class="social-links">
                      <a href="https://www.facebook.com/profile.php?id=100089921524516" target="_blank">Facebook</a>
                      <a href="https://www.instagram.com/ecovluu/" target="_blank">Instagram</a>
                      <a href="https://www.tiktok.com/@ecovluu" target="_blank">TikTok</a>
                  </div>
              </div>
              
              <div class="footer">
                  <p>ECOVLUU</p>
                  <p>A6, Block A, Santry Business Park, Swords Road, Santry, Dublin 9, Ireland</p>
                  <p>info@ecovluu.com</p>
                  <p>© 2025 Ecovluu. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
    `;

    // Send welcome email
    const result = await resend.emails.send({
      from: 'ECOVLUU <noreply@ecovluu.com>',
      to: [email],
      subject: 'Welcome to ECOVLUU Family! 🌿',
      html: emailHtml,
    });

    console.log('Welcome email sent successfully:', result);

    return new Response(JSON.stringify({ success: true, result }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error in send-welcome-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);