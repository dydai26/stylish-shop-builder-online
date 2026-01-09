import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MetricsRequest {
  startDate?: string;
  endDate?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      throw new Error('Resend API key not configured');
    }

    const { startDate, endDate }: MetricsRequest = await req.json();

    // Build query parameters for date filtering
    const params = new URLSearchParams();
    if (startDate) params.append('created_at[from]', startDate);
    if (endDate) params.append('created_at[to]', endDate);

    // Fetch emails from Resend API
    const emailsResponse = await fetch(`https://api.resend.com/emails?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!emailsResponse.ok) {
      throw new Error(`Resend API error: ${emailsResponse.status}`);
    }

    const emailsData = await emailsResponse.json();
    const emails = emailsData.data || [];

    // Calculate metrics
    const totalSent = emails.length;
    const delivered = emails.filter((email: any) => email.last_event === 'delivered').length;
    const bounced = emails.filter((email: any) => email.last_event === 'bounced').length;
    const complained = emails.filter((email: any) => email.last_event === 'complained').length;

    const deliveryRate = totalSent > 0 ? (delivered / totalSent) * 100 : 0;
    const bounceRate = totalSent > 0 ? (bounced / totalSent) * 100 : 0;
    const complaintRate = totalSent > 0 ? (complained / totalSent) * 100 : 0;

    // Calculate today's sent emails
    const today = new Date().toISOString().split('T')[0];
    const sentToday = emails.filter((email: any) => 
      email.created_at && email.created_at.startsWith(today)
    ).length;

    // Generate chart data for last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const chartData = last7Days.map(date => ({
      date,
      sent: emails.filter((email: any) => 
        email.created_at && email.created_at.startsWith(date)
      ).length
    }));

    const metrics = {
      totalSent,
      deliveryRate: Math.round(deliveryRate * 10) / 10,
      bounceRate: Math.round(bounceRate * 10) / 10,
      complaintRate: Math.round(complaintRate * 10) / 10,
      sentToday,
      chartData
    };

    console.log('Resend metrics fetched successfully:', metrics);

    return new Response(JSON.stringify(metrics), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error fetching Resend metrics:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        // Return default metrics on error
        totalSent: 0,
        deliveryRate: 0,
        bounceRate: 0,
        complaintRate: 0,
        sentToday: 0,
        chartData: []
      }),
      {
        status: 200, // Return 200 with default data instead of error
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);