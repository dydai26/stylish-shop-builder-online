// deno-lint-ignore-file
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface GoogleAnalyticsRequest {
  dateRange?: string;
  metrics?: string[];
  propertyId?: string;
}

const PROPERTY_ID = Deno.env.get("GOOGLE_ANALYTICS_PROPERTY_ID") || "524798829";

async function getAccessToken() {
  try {
    // Try multiple env var names to be resilient
    const candidates = [
      "GOOGLE_ANALYTICS_SERVICE_ACCOUNT_KEY",
      "GOOGLE_SERVICE_ACCOUNT_KEY",
      "GA_SERVICE_ACCOUNT_KEY",
      "GOOGLE_CREDENTIALS_JSON",
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
      throw new Error(
        `Service account key not found. Expected one of: ${
          candidates.join(", ")
        }`,
      );
    }

    console.log("Service account key length:", serviceAccountKey.length);

    let credentials: { 
      client_email?: string; 
      private_key?: string; 
    };
    try {
      // Try to parse as JSON directly first
      credentials = JSON.parse(serviceAccountKey);
      console.log("Service Account Client Email configured in Supabase:", credentials.client_email);
    } catch (parseError) {
      console.error("Failed to parse service account key as JSON:", parseError);
      throw new Error(
        `Invalid service account key format. Please provide valid JSON format from Google Cloud Console.`,
      );
    }

    // Create JWT token
    const header = {
      "alg": "RS256",
      "typ": "JWT",
    };

    const now = Math.floor(Date.now() / 1000);
    const payload = {
      "iss": credentials.client_email,
      "scope": "https://www.googleapis.com/auth/analytics.readonly",
      "aud": "https://oauth2.googleapis.com/token",
      "exp": now + 3600,
      "iat": now,
    };

    // Import private key (PEM -> DER)
    const rawKey = String(credentials.private_key || "");
    const pem = rawKey.includes("\\n") ? rawKey.replace(/\\n/g, "\n") : rawKey;
    const pemHeader = "-----BEGIN PRIVATE KEY-----";
    const pemFooter = "-----END PRIVATE KEY-----";
    const base64Body = pem
      .replace(pemHeader, "")
      .replace(pemFooter, "")
      .replace(/\r?\n/g, "")
      .replace(/\s+/g, "");

    const der = Uint8Array.from(atob(base64Body), (c) =>
      c.charCodeAt(0)).buffer;

    const privateKey = await crypto.subtle.importKey(
      "pkcs8",
      der,
      {
        name: "RSASSA-PKCS1-v1_5",
        hash: "SHA-256",
      },
      false,
      ["sign"],
    );

    // Create signature
    const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, "")
      .replace(/\+/g, "-").replace(/\//g, "_");
    const encodedPayload = btoa(JSON.stringify(payload)).replace(/=/g, "")
      .replace(/\+/g, "-").replace(/\//g, "_");
    const signatureInput = `${encodedHeader}.${encodedPayload}`;

    const signature = await crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      privateKey,
      new TextEncoder().encode(signatureInput),
    );

    const encodedSignature = btoa(
      String.fromCharCode(...new Uint8Array(signature)),
    )
      .replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");

    const jwt = `${signatureInput}.${encodedSignature}`;

    // Exchange JWT for access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
        "assertion": jwt,
      }),
    });

    const tokenData = await tokenResponse.json();
    return tokenData.access_token;
  } catch (error) {
    console.error("Error getting access token:", error);
    throw error;
  }
}

async function fetchAnalyticsData(accessToken: string, dateRange: string, propertyId: string) {
  try {
    const activePropertyId = propertyId || PROPERTY_ID;
    const endDate = new Date();
    const startDate = new Date();

    switch (dateRange) {
      case "today":
        break;
      case "yesterday":
        startDate.setDate(startDate.getDate() - 1);
        endDate.setDate(endDate.getDate() - 1);
        break;
      case "7days":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "14days":
        startDate.setDate(startDate.getDate() - 14);
        break;
      case "30days":
        startDate.setDate(startDate.getDate() - 30);
        break;
      case "60days":
        startDate.setDate(startDate.getDate() - 60);
        break;
      case "90days":
        startDate.setDate(startDate.getDate() - 90);
        break;
      case "6months":
        startDate.setMonth(startDate.getMonth() - 6);
        break;
      case "year":
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }

    const startDateStr = startDate.toISOString().split("T")[0];
    const endDateStr = endDate.toISOString().split("T")[0];

    // Helper to call runReport
    const runReport = async (payload: Record<string, unknown>) => {
      const resp = await fetch(
        `https://analyticsdata.googleapis.com/v1beta/properties/${activePropertyId}:runReport`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await resp.json();
      if (!resp.ok) {
        console.error("GA4 API Error:", data);
        throw new Error(data.error?.message || `GA4 API error: ${resp.status}`);
      }
      return data;
    };

    // Parallel fetching for performance
    const [
      overviewData,
      trafficData,
      deviceData,
      pagesData,
      countriesData,
      citiesData,
      realtimeData,
    ] = await Promise.all([
      runReport({
        dateRanges: [{ startDate: startDateStr, endDate: endDateStr }],
        metrics: [
          { name: "totalUsers" },
          { name: "screenPageViews" },
          { name: "averageSessionDuration" },
          { name: "bounceRate" },
          { name: "newUsers" },
        ],
      }),
      runReport({
        dateRanges: [{ startDate: startDateStr, endDate: endDateStr }],
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
        metrics: [{ name: "totalUsers" }],
      }),
      runReport({
        dateRanges: [{ startDate: startDateStr, endDate: endDateStr }],
        dimensions: [{ name: "deviceCategory" }],
        metrics: [{ name: "totalUsers" }],
      }),
      runReport({
        dateRanges: [{ startDate: startDateStr, endDate: endDateStr }],
        dimensions: [{ name: "pagePath" }],
        metrics: [
          { name: "screenPageViews" },
          { name: "totalUsers" },
          { name: "bounceRate" },
        ],
        limit: 10,
      }),
      runReport({
        dateRanges: [{ startDate: startDateStr, endDate: endDateStr }],
        dimensions: [{ name: "country" }],
        metrics: [{ name: "totalUsers" }],
        limit: 10,
      }),
      runReport({
        dateRanges: [{ startDate: startDateStr, endDate: endDateStr }],
        dimensions: [{ name: "city" }],
        metrics: [{ name: "totalUsers" }],
        limit: 10,
      }),
      (async () => {
        // Fetch total active users without dimensions for accurate distinct count
        const totalResp = await fetch(
          `https://analyticsdata.googleapis.com/v1beta/properties/${activePropertyId}:runRealtimeReport`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              metrics: [{ name: "activeUsers" }],
            }),
          },
        );

        // Fetch pages breakdown
        const pagesResp = await fetch(
          `https://analyticsdata.googleapis.com/v1beta/properties/${activePropertyId}:runRealtimeReport`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              metrics: [{ name: "activeUsers" }],
              dimensions: [{ name: "unifiedScreenName" }],
            }),
          },
        );

        const totalData = await totalResp.json();
        const pagesData = await pagesResp.json();
        
        if (!totalResp.ok || !pagesResp.ok) {
          console.error("GA4 Realtime API Error:", { totalData, pagesData });
          return { totalRows: [], pagesRows: [] };
        }
        return { totalRows: totalData.rows || [], pagesRows: pagesData.rows || [] };
      })(),
    ]);

    // Process and format the data
    const totalUsers = parseInt(
      overviewData.rows?.[0]?.metricValues?.[0]?.value || "0",
    );
    const newUsersCount = parseInt(
      overviewData.rows?.[0]?.metricValues?.[4]?.value || "0",
    );

    const totalUsersFromRealtime = parseInt(
      realtimeData.totalRows?.[0]?.metricValues?.[0]?.value || "0"
    );

    const formatAnalyticsData = {
      overview: {
        totalUsers: totalUsers,
        totalPageViews: parseInt(
          overviewData.rows?.[0]?.metricValues?.[1]?.value || "0",
        ),
        averageSessionDuration: formatDuration(
          parseFloat(overviewData.rows?.[0]?.metricValues?.[2]?.value || "0"),
        ),
        bounceRate: Math.round(
          parseFloat(
            overviewData.rows?.[0]?.metricValues?.[3]?.value || "0",
          ) * 100 * 10,
        ) / 10,
        newUsers: newUsersCount,
        returningUsers: Math.max(0, totalUsers - newUsersCount),
      },
      traffic: processTrafficData(trafficData.rows || []),
      devices: processDeviceData(deviceData.rows || []),
      topPages: processPagesData(pagesData.rows || []),
      realtime: {
        activeUsers: totalUsersFromRealtime,
        topPages: (realtimeData.pagesRows || []).map((row: { dimensionValues?: Array<{ value?: string }>; metricValues?: Array<{ value?: string }> }) => {
          let pageName = row.dimensionValues?.[0]?.value || "/";
          if (pageName === "ECOVLUU - Natural Hair Care Products") {
            pageName = "/";
          }
          return {
            page: pageName,
            activeUsers: parseInt(row.metricValues?.[0]?.value || "0"),
          };
        }).sort((a: { activeUsers: number }, b: { activeUsers: number }) => b.activeUsers - a.activeUsers)
        .slice(0, 5), // Only keep the top 5 active pages
      },
      demographics: {
        countries: processDemographicsData(countriesData.rows || [], "country"),
        cities: processDemographicsData(citiesData.rows || [], "city"),
      },
    };

    return formatAnalyticsData;
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    throw error;
  }
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

interface TrafficData {
  organic: number;
  direct: number;
  referral: number;
  social: number;
  email: number;
  paid: number;
}

function processTrafficData(rows: Array<{ dimensionValues: Array<{ value: string }>; metricValues: Array<{ value: string }> }>): TrafficData {
  const traffic: TrafficData = {
    organic: 0,
    direct: 0,
    referral: 0,
    social: 0,
    email: 0,
    paid: 0,
  };

  rows.forEach((row) => {
    const channel = row.dimensionValues[0].value.toLowerCase();
    const users = parseInt(row.metricValues[0].value);

    if (channel.includes("organic")) traffic.organic += users;
    else if (channel.includes("direct")) traffic.direct += users;
    else if (channel.includes("referral")) traffic.referral += users;
    else if (channel.includes("social")) traffic.social += users;
    else if (channel.includes("email")) traffic.email += users;
    else if (channel.includes("paid")) traffic.paid += users;
  });

  return traffic;
}

function processDeviceData(rows: Array<{ dimensionValues: Array<{ value: string }>; metricValues: Array<{ value: string }> }>): { desktop: number; mobile: number; tablet: number } {
  const devices = {
    desktop: 0,
    mobile: 0,
    tablet: 0,
  };

  rows.forEach((row) => {
    const device = row.dimensionValues[0].value.toLowerCase();
    const users = parseInt(row.metricValues[0].value);

    if (device === "desktop") devices.desktop = users;
    else if (device === "mobile") devices.mobile = users;
    else if (device.includes("tablet")) devices.tablet = users;
  });

  return devices;
}

interface PageData {
  page: string;
  views: number;
  uniqueViews: number;
  bounceRate: number;
}

function processPagesData(rows: Array<{ dimensionValues: Array<{ value: string }>; metricValues: Array<{ value: string }> }>): PageData[] {
  return rows.map((row) => ({
    page: row.dimensionValues[0].value,
    views: parseInt(row.metricValues[0].value),
    uniqueViews: parseInt(row.metricValues[1].value),
    bounceRate: Math.round(parseFloat(row.metricValues[2].value) * 100 * 10) /
      10,
  }));
}

interface DemographicsData {
  country?: string;
  city?: string;
  users: number;
  percentage: number;
}

function processDemographicsData(rows: Array<{ dimensionValues: Array<{ value: string }>; metricValues: Array<{ value: string }> }>, labelKey: string): DemographicsData[] {
  const total = rows.reduce(
    (sum, row) => sum + parseInt(row.metricValues[0].value),
    0,
  );
  return rows.map((row) => ({
    [labelKey === "country" ? "country" : "city"]: row.dimensionValues[0].value,
    users: parseInt(row.metricValues[0].value),
    percentage: total > 0
      ? Math.round((parseInt(row.metricValues[0].value) / total) * 100 * 10) /
        10
      : 0,
  }));
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  let clientEmail = "unknown";
  try {
    const { dateRange = "30days", propertyId }: GoogleAnalyticsRequest = await req.json();

    console.log("Fetching Google Analytics data for property:", propertyId || PROPERTY_ID, "range:", dateRange);

    const serviceAccountKey = Deno.env.get("GOOGLE_ANALYTICS_SERVICE_ACCOUNT_KEY");
    if (serviceAccountKey) {
      try {
        const credentials = JSON.parse(serviceAccountKey);
        clientEmail = credentials.client_email;
      } catch (e) {}
    }

    const accessToken = await getAccessToken();
    const analyticsData = await fetchAnalyticsData(accessToken, dateRange, propertyId || PROPERTY_ID);

    return new Response(JSON.stringify(analyticsData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in google-analytics function:", error);
    const errorMessage = error instanceof Error
      ? error.message
      : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : "";
    
    return new Response(
      JSON.stringify({
        error: errorMessage,
        stack: errorStack,
        details: `Failed to fetch data. Configured email in Supabase is: ${clientEmail}`,
      }),
      {
        status: 200, // Return 200 so the frontend can read the body error message
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
