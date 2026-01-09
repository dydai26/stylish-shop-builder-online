import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Default package dimensions (cm)
const DEFAULT_PACKAGE_DIMENSIONS = {
  length: 21.5,
  width: 15,
  height: 11,
};

// Cache configuration - 1 hour TTL
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour in milliseconds

interface CacheEntry {
  rates: UPSShippingRate[];
  timestamp: number;
}

// In-memory cache for shipping rates
const ratesCache = new Map<string, CacheEntry>();

// Generate cache key from address and weight
const getCacheKey = (toAddress: UPSAddress, weight: number): string => {
  return `${toAddress.countryCode}-${toAddress.postalCode}-${toAddress.city}-${weight}`;
};

// Check if cache entry is valid
const isCacheValid = (entry: CacheEntry | undefined): boolean => {
  if (!entry) return false;
  return Date.now() - entry.timestamp < CACHE_TTL_MS;
};

interface UPSAddress {
  addressLine: string;
  city: string;
  postalCode: string;
  countryCode: string;
}

interface UPSShippingRate {
  serviceCode: string;
  serviceName: string;
  totalPrice: number;
  currency: string;
  deliveryTimeEstimate: string;
}

interface PackageDimensions {
  length: number;
  width: number;
  height: number;
}

// Get UPS access token - PRODUCTION with Basic Auth
const getUPSAccessToken = async (): Promise<string> => {
  const clientId = Deno.env.get('UPS_CLIENT_ID');
  const clientSecret = Deno.env.get('UPS_CLIENT_SECRET');

  if (!clientId || !clientSecret) {
    throw new Error('UPS credentials not configured');
  }

  console.log('Getting UPS access token (PRODUCTION)...');
  
  // UPS Production API requires Basic Authentication
  const credentials = btoa(`${clientId}:${clientSecret}`);

  const response = await fetch('https://onlinetools.ups.com/security/v1/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${credentials}`,
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('UPS token error:', errorText);
    throw new Error(`Failed to get UPS access token: ${response.status}`);
  }

  const data = await response.json();
  console.log('UPS token obtained successfully');
  return data.access_token;
};

// Validate address with UPS - PRODUCTION
const validateAddress = async (address: UPSAddress): Promise<UPSAddress[]> => {
  const accessToken = await getUPSAccessToken();
  
  const validationPayload = {
    XAVRequest: {
      AddressKeyFormat: {
        AddressLine: address.addressLine,
        PoliticalDivision2: address.city,
        PostcodePrimaryLow: address.postalCode,
        CountryCode: address.countryCode,
      },
    },
  };

  console.log('Validating address:', address);

  const response = await fetch('https://onlinetools.ups.com/api/addressvalidation/v1/1', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(validationPayload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Address validation error:', errorText);
    return [address];
  }

  const data = await response.json();
  console.log('Address validation response:', data);

  if (data.XAVResponse?.ValidAddressIndicator) {
    return [address];
  } else if (data.XAVResponse?.CandidateAddressList) {
    const candidates = Array.isArray(data.XAVResponse.CandidateAddressList.CandidateAddress)
      ? data.XAVResponse.CandidateAddressList.CandidateAddress
      : [data.XAVResponse.CandidateAddressList.CandidateAddress];
    
    return candidates.map((candidate: any) => ({
      addressLine: candidate.AddressKeyFormat.AddressLine[0] || address.addressLine,
      city: candidate.AddressKeyFormat.PoliticalDivision2 || address.city,
      postalCode: candidate.AddressKeyFormat.PostcodePrimaryLow || address.postalCode,
      countryCode: candidate.AddressKeyFormat.CountryCode || address.countryCode,
    }));
  }

  return [address];
};

// Get shipping rates from UPS - using Rate endpoint for individual services
const getShippingRates = async (
  fromAddress: UPSAddress,
  toAddress: UPSAddress,
  weight: number,
  dimensions: PackageDimensions = DEFAULT_PACKAGE_DIMENSIONS
): Promise<UPSShippingRate[]> => {
  // Check cache first
  const cacheKey = getCacheKey(toAddress, weight);
  const cachedEntry = ratesCache.get(cacheKey);
  
  if (isCacheValid(cachedEntry)) {
    console.log(`Cache HIT for ${cacheKey}`);
    return cachedEntry!.rates;
  }
  
  console.log(`Cache MISS for ${cacheKey}, fetching from UPS API...`);
  
  const accessToken = await getUPSAccessToken();
  const rates: UPSShippingRate[] = [];
  
  // Service codes available for EU/Ireland: 11 (Standard), 07 (Express), 08 (Expedited), 65 (Saver)
  const servicesToTry = ['11', '07', '08', '65'];
  
  for (const serviceCode of servicesToTry) {
    try {
      const ratePayload = {
        RateRequest: {
          Request: {
            TransactionReference: {
              CustomerContext: `rate-${serviceCode}`,
            },
          },
          Shipment: {
            Shipper: {
              Address: {
                AddressLine: [fromAddress.addressLine],
                City: fromAddress.city,
                PostalCode: fromAddress.postalCode,
                CountryCode: fromAddress.countryCode,
              },
            },
            ShipTo: {
              Address: {
                AddressLine: [toAddress.addressLine],
                City: toAddress.city,
                PostalCode: toAddress.postalCode,
                CountryCode: toAddress.countryCode,
              },
            },
            Service: {
              Code: serviceCode,
            },
            Package: {
              PackagingType: {
                Code: "02",
              },
              Dimensions: {
                UnitOfMeasurement: {
                  Code: "CM",
                },
                Length: dimensions.length.toString(),
                Width: dimensions.width.toString(),
                Height: dimensions.height.toString(),
              },
              PackageWeight: {
                UnitOfMeasurement: {
                  Code: "KGS",
                },
                Weight: weight.toString(),
              },
            },
          },
        },
      };

      console.log(`Getting rate for service ${serviceCode} to ${toAddress.countryCode}`);

      const response = await fetch('https://onlinetools.ups.com/api/rating/v1/Rate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ratePayload),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.RateResponse?.RatedShipment) {
          const shipment = data.RateResponse.RatedShipment;
          rates.push({
            serviceCode: serviceCode,
            serviceName: getServiceName(serviceCode),
            totalPrice: parseFloat(shipment.TotalCharges?.MonetaryValue || '0'),
            currency: shipment.TotalCharges?.CurrencyCode || 'EUR',
            deliveryTimeEstimate: getDeliveryEstimate(serviceCode),
          });
          console.log(`Got rate for ${serviceCode}: ${shipment.TotalCharges?.MonetaryValue}`);
        }
      } else {
        console.log(`Service ${serviceCode} not available for this route`);
      }
    } catch (err) {
      console.log(`Error getting rate for service ${serviceCode}:`, err);
    }
  }

  console.log('Final rates:', rates);
  
  // Store in cache
  if (rates.length > 0) {
    ratesCache.set(cacheKey, { rates, timestamp: Date.now() });
    console.log(`Cached rates for ${cacheKey}`);
  }
  
  return rates;

// Get delivery estimate based on service code
const getDeliveryEstimate = (serviceCode: string): string => {
  const estimates: Record<string, string> = {
    '11': '1-2 business days',
    '07': 'Next business day',
    '08': '2-3 business days',
    '54': 'Next business day AM',
    '65': '1-2 business days',
    '96': '3-5 business days',
  };
  return estimates[serviceCode] || '2-5 business days';
};

// Map UPS service codes to readable names
const getServiceName = (serviceCode: string): string => {
  const serviceNames: Record<string, string> = {
    '01': 'UPS Next Day Air',
    '02': 'UPS 2nd Day Air',
    '03': 'UPS Ground',
    '07': 'UPS Worldwide Express',
    '08': 'UPS Worldwide Expedited',
    '11': 'UPS Standard',
    '12': 'UPS 3 Day Select',
    '13': 'UPS Next Day Air Saver',
    '14': 'UPS Next Day Air Early',
    '54': 'UPS Worldwide Express Plus',
    '59': 'UPS 2nd Day Air A.M.',
    '65': 'UPS Worldwide Saver',
    '82': 'UPS Today Standard',
    '83': 'UPS Today Dedicated Courier',
    '84': 'UPS Today Intercity',
    '85': 'UPS Today Express',
    '86': 'UPS Today Express Saver',
    '96': 'UPS Worldwide Express Freight',
  };
  return serviceNames[serviceCode] || `UPS Service ${serviceCode}`;
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { action, ...params } = await req.json();

    if (action === 'validate') {
      const { address } = params as { address: UPSAddress };
      const validatedAddresses = await validateAddress(address);
      
      return new Response(
        JSON.stringify({ success: true, addresses: validatedAddresses }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'rates') {
      const { fromAddress, toAddress, weight, dimensions } = params as {
        fromAddress: UPSAddress;
        toAddress: UPSAddress;
        weight: number;
        dimensions?: PackageDimensions;
      };
      
      const rates = await getShippingRates(fromAddress, toAddress, weight, dimensions);
      
      return new Response(
        JSON.stringify({ success: true, rates }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
