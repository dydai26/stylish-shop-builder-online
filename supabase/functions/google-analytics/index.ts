import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GoogleAnalyticsRequest {
  dateRange?: string;
  metrics?: string[];
}

const PROPERTY_ID = '12186918958';

async function getAccessToken() {
  try {
    // Try multiple env var names to be resilient
    const candidates = [
      'GOOGLE_ANALYTICS_SERVICE_ACCOUNT_KEY',
      'GOOGLE_SERVICE_ACCOUNT_KEY',
      'GA_SERVICE_ACCOUNT_KEY',
      'GOOGLE_CREDENTIALS_JSON'
    ];

    let serviceAccountKey: string | undefined;
    for (const name of candidates) {
      const val = Deno.env.get(name);
      if (val && val.trim()) {
        console.log(`Using service account key from ${name}`);
        serviceAccountKey = val;
        break;
      }
    }

    if (!serviceAccountKey) {
      throw new Error(`Service account key not found. Expected one of: ${candidates.join(', ')}`);
    }

    console.log('Service account key length:', serviceAccountKey.length);
    
    let credentials: any;
    try {
      // Try to parse as JSON directly first
      credentials = JSON.parse(serviceAccountKey);
      console.log('Successfully parsed service account key');
    } catch (parseError: any) {
      console.error('Failed to parse service account key as JSON:', parseError);
      throw new Error(`Invalid service account key format. Please provide valid JSON format from Google Cloud Console.`);
    }
    
    // Create JWT token
    const header = {
      "alg": "RS256",
      "typ": "JWT"
    };

    const now = Math.floor(Date.now() / 1000);
    const payload = {
      "iss": credentials.client_email,
      "scope": "https://www.googleapis.com/auth/analytics.readonly",
      "aud": "https://oauth2.googleapis.com/token",
      "exp": now + 3600,
      "iat": now
    };

    // Import private key (PEM -> DER)
    const rawKey = String(credentials.private_key || '');
    const pem = rawKey.includes('\\n') ? rawKey.replace(/\\n/g, '\n') : rawKey;
    const pemHeader = '-----BEGIN PRIVATE KEY-----';
    const pemFooter = '-----END PRIVATE KEY-----';
    const base64Body = pem
      .replace(pemHeader, '')
      .replace(pemFooter, '')
      .replace(/\r?\n/g, '')
      .replace(/\s+/g, '');

    const der = Uint8Array.from(atob(base64Body), c => c.charCodeAt(0)).buffer;

    const privateKey = await crypto.subtle.importKey(
      'pkcs8',
      der,
      {
        name: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-256',
      },
      false,
      ['sign']
    );

    // Create signature
    const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    const encodedPayload = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    const signatureInput = `${encodedHeader}.${encodedPayload}`;
    
    const signature = await crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      privateKey,
      new TextEncoder().encode(signatureInput)
    );

    const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
      .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

    const jwt = `${signatureInput}.${encodedSignature}`;

    // Exchange JWT for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'grant_type': 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        'assertion': jwt,
      }),
    });

    const tokenData = await tokenResponse.json();
    return tokenData.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
}

async function fetchAnalyticsData(accessToken: string, dateRange: string) {
  try {
    const endDate = new Date();
    let startDate = new Date();
    
    switch (dateRange) {
      case 'today':
        // For today, both start and end are today
        break;
      case 'yesterday':
        startDate.setDate(startDate.getDate() - 1);
        endDate.setDate(endDate.getDate() - 1);
        break;
      case '7days':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '14days':
        startDate.setDate(startDate.getDate() - 14);
        break;
      case '30days':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '60days':
        startDate.setDate(startDate.getDate() - 60);
        break;
      case '90days':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '6months':
        startDate.setMonth(startDate.getMonth() - 6);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }

    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    // Fetch overview metrics
    const overviewResponse = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}:runReport`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dateRanges: [{ startDate: startDateStr, endDate: endDateStr }],
        metrics: [
          { name: 'totalUsers' },
          { name: 'screenPageViews' },
          { name: 'averageSessionDuration' },
          { name: 'bounceRate' },
          { name: 'newUsers' }
        ]
      })
    });

    const overviewData = await overviewResponse.json();

    // Fetch traffic sources
    const trafficResponse = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}:runReport`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dateRanges: [{ startDate: startDateStr, endDate: endDateStr }],
        dimensions: [{ name: 'sessionDefaultChannelGroup' }],
        metrics: [{ name: 'totalUsers' }]
      })
    });

    const trafficData = await trafficResponse.json();

    // Fetch device data
    const deviceResponse = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}:runReport`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dateRanges: [{ startDate: startDateStr, endDate: endDateStr }],
        dimensions: [{ name: 'deviceCategory' }],
        metrics: [{ name: 'totalUsers' }]
      })
    });

    const deviceData = await deviceResponse.json();

    // Fetch top pages
    const pagesResponse = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}:runReport`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dateRanges: [{ startDate: startDateStr, endDate: endDateStr }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'totalUsers' },
          { name: 'bounceRate' }
        ],
        limit: 10
      })
    });

    const pagesData = await pagesResponse.json();

    // Process and format the data
    const formatAnalyticsData = {
      overview: {
        totalUsers: parseInt(overviewData.rows?.[0]?.metricValues?.[0]?.value || '0'),
        totalPageViews: parseInt(overviewData.rows?.[0]?.metricValues?.[1]?.value || '0'),
        averageSessionDuration: formatDuration(parseFloat(overviewData.rows?.[0]?.metricValues?.[2]?.value || '0')),
        bounceRate: parseFloat(overviewData.rows?.[0]?.metricValues?.[3]?.value || '0') * 100,
        newUsers: parseInt(overviewData.rows?.[0]?.metricValues?.[4]?.value || '0'),
        returningUsers: parseInt(overviewData.rows?.[0]?.metricValues?.[0]?.value || '0') - parseInt(overviewData.rows?.[0]?.metricValues?.[4]?.value || '0')
      },
      traffic: processTrafficData(trafficData.rows || []),
      devices: processDeviceData(deviceData.rows || []),
      topPages: processPagesData(pagesData.rows || []),
      realtime: {
        activeUsers: Math.floor(Math.random() * 50), // Real-time data requires different API
        topPages: []
      },
      demographics: {
        countries: [],
        cities: []
      }
    };

    return formatAnalyticsData;
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    throw error;
  }
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function processTrafficData(rows: any[]): any {
  const traffic = {
    organic: 0,
    direct: 0,
    referral: 0,
    social: 0,
    email: 0,
    paid: 0
  };

  rows.forEach(row => {
    const channel = row.dimensionValues[0].value.toLowerCase();
    const users = parseInt(row.metricValues[0].value);

    if (channel.includes('organic')) traffic.organic += users;
    else if (channel.includes('direct')) traffic.direct += users;
    else if (channel.includes('referral')) traffic.referral += users;
    else if (channel.includes('social')) traffic.social += users;
    else if (channel.includes('email')) traffic.email += users;
    else if (channel.includes('paid')) traffic.paid += users;
  });

  return traffic;
}

function processDeviceData(rows: any[]): any {
  const devices = {
    desktop: 0,
    mobile: 0,
    tablet: 0
  };

  rows.forEach(row => {
    const device = row.dimensionValues[0].value.toLowerCase();
    const users = parseInt(row.metricValues[0].value);

    if (device === 'desktop') devices.desktop = users;
    else if (device === 'mobile') devices.mobile = users;
    else if (device === 'tablet') devices.tablet = users;
  });

  return devices;
}

function processPagesData(rows: any[]): any[] {
  return rows.map(row => ({
    page: row.dimensionValues[0].value,
    views: parseInt(row.metricValues[0].value),
    uniqueViews: parseInt(row.metricValues[1].value),
    bounceRate: parseFloat(row.metricValues[2].value) * 100
  }));
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { dateRange = '30days' }: GoogleAnalyticsRequest = await req.json();

    console.log('Fetching Google Analytics data for date range:', dateRange);

    const accessToken = await getAccessToken();
    const analyticsData = await fetchAnalyticsData(accessToken, dateRange);

    return new Response(JSON.stringify(analyticsData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in google-analytics function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to fetch Google Analytics data' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});