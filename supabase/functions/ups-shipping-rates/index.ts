
/**
 * Edge Function для отримання тарифів UPS.
 * 
 * Endpoint: POST /ups-shipping-rates
 */

// Потрібно використовувати правильний імпорт з префіксом
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  // Дані мають містити fromAddress, toAddress, packageWeight, (optionally packageDimensions)
  const { fromAddress, toAddress, packageWeight, packageDimensions } = body;

  if (!fromAddress || !toAddress || typeof packageWeight !== 'number') {
    return new Response(JSON.stringify({ error: 'Missing required parameters' }), { status: 400 });
  }

  // Витягуємо секрети з Environment (налаштовуються через Supabase Secrets)
  const UPS_CLIENT_ID = Deno.env.get("UPS_CLIENT_ID");
  const UPS_CLIENT_SECRET = Deno.env.get("UPS_CLIENT_SECRET");

  console.log("Edge Function: Starting UPS rates calculation");
  console.log(`Edge Function: Client ID available? ${Boolean(UPS_CLIENT_ID)}`);  
  console.log(`Edge Function: Client Secret available? ${Boolean(UPS_CLIENT_SECRET)}`);  

  if (!UPS_CLIENT_ID || !UPS_CLIENT_SECRET) {
    console.error("Edge Function: UPS credentials missing");
    return new Response(JSON.stringify({ 
      error: 'UPS credentials not configured in Supabase Secrets',
      debug: { hasClientId: Boolean(UPS_CLIENT_ID), hasClientSecret: Boolean(UPS_CLIENT_SECRET) }
    }), { status: 500 });
  }

  // Функція для отримання токену
  async function getUPSToken() {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', UPS_CLIENT_ID);
    params.append('client_secret', UPS_CLIENT_SECRET);

    console.log("Edge Function: Getting UPS token");

    const resp = await fetch("https://onlinetools.ups.com/security/v1/oauth/token", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-merchant-id': UPS_CLIENT_ID,
      },
      body: params,
    });
    if (!resp.ok) {
      const errorText = await resp.text();
      console.error('Edge Function: UPS token error:', errorText);
      throw new Error('UPS token error: ' + errorText);
    }
    const data = await resp.json();
    console.log("Edge Function: Token obtained successfully");
    return data.access_token;
  }

  // Функція для отримання тарифів UPS
  async function getRates(token: string) {
    const from = fromAddress;
    const to = toAddress;

    const getCountryCode = (country: string) => {
      // Може бути деталізованіше за потреби
      const cc: { [k: string]: string } = {
        'Ireland': 'IE', 'United Kingdom': 'GB', 'France': 'FR', 'Germany': 'DE',
        'Spain': 'ES', 'Italy': 'IT', 'Netherlands': 'NL', 'Belgium': 'BE',
        'Portugal': 'PT', 'Switzerland': 'CH', 'Austria': 'AT', 'Poland': 'PL',
        'Sweden': 'SE', 'Denmark': 'DK', 'Norway': 'NO', 'Finland': 'FI', 'Greece': 'GR',
        // ... контролюйте інші при потребі
      };
      return cc[country] || country;
    };

    console.log("Edge Function: Preparing rate request");
    console.log(`Edge Function: From ${from.city}, ${from.countryCode} to ${to.city}, ${to.countryCode}`);
    console.log(`Edge Function: Package weight ${packageWeight}kg`);

    const rateRequest = {
      RateRequest: {
        Request: {
          RequestOption: "Shop",
          TransactionReference: { CustomerContext: "Rating and Service" }
        },
        Shipment: {
          Shipper: {
            Address: {
              AddressLine: from.addressLine,
              City: from.city,
              PostalCode: from.postalCode,
              CountryCode: getCountryCode(from.countryCode),
            }
          },
          ShipTo: {
            Address: {
              AddressLine: to.addressLine,
              City: to.city,
              PostalCode: to.postalCode,
              CountryCode: getCountryCode(to.countryCode),
            }
          },
          Package: {
            PackagingType: { Code: "02", Description: "Package" },
            PackageWeight: { UnitOfMeasurement: { Code: "KGS" }, Weight: packageWeight.toString() },
            ...(packageDimensions && {
              Dimensions: {
                UnitOfMeasurement: { Code: "CM" },
                Length: packageDimensions.length.toString(),
                Width: packageDimensions.width.toString(),
                Height: packageDimensions.height.toString()
              }
            })
          }
        }
      }
    };

    console.log("Edge Function: Sending UPS rates request");

    const resp = await fetch("https://onlinetools.ups.com/api/rating/v1/Shop", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(rateRequest)
    });

    const text = await resp.text();
    if (!resp.ok) {
      console.error('Edge Function: UPS rates error:', text);
      throw new Error('UPS rates error: ' + text);
    }

    let data;
    try {
      data = JSON.parse(text);
      console.log("Edge Function: Received UPS rates response");
    } catch (e) {
      console.error('Edge Function: Failed to parse UPS response:', e);
      throw new Error("Parsing UPS rates JSON fail");
    }

    // Обробимо відповідь у форматі очікуваної структури
    const ratedShipments = Array.isArray(data?.RateResponse?.RatedShipment)
      ? data.RateResponse.RatedShipment
      : (data?.RateResponse?.RatedShipment ? [data.RateResponse.RatedShipment] : []);
      
    console.log(`Edge Function: Found ${ratedShipments.length} shipping options`);
    
    const rates = ratedShipments.map((rate: any) => ({
      serviceCode: rate.Service.Code,
      serviceName: rate.Service.Description || rate.Service.Code,
      totalPrice: parseFloat(rate.TotalCharges.MonetaryValue),
      currency: rate.TotalCharges.CurrencyCode,
      deliveryTimeEstimate: rate.GuaranteedDelivery?.BusinessDaysInTransit
        ? `${rate.GuaranteedDelivery.BusinessDaysInTransit} business days`
        : 'Delivery time varies'
    }));

    console.log("Edge Function: Processed rates:", JSON.stringify(rates));
    return rates;
  }

  try {
    console.log("Edge Function: Starting UPS API flow");
    const token = await getUPSToken();
    const rates = await getRates(token);
    
    // Додаємо трохи розширену відповідь для зручності діагностики
    return new Response(JSON.stringify({ 
      rates: rates,
      meta: {
        requestTime: new Date().toISOString(),
        origin: `${fromAddress.city}, ${fromAddress.countryCode}`,
        destination: `${toAddress.city}, ${toAddress.countryCode}`,
        packageWeight: packageWeight
      }
    }), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (e) {
    console.error("Edge Function: Error processing request:", e);
    return new Response(JSON.stringify({ 
      error: String(e),
      details: "Помилка при обробці запиту UPS API в Edge Function"
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
});
