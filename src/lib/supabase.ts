import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://inivoiunisrgdinrcquu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluaXZvaXVuaXNyZ2RpbnJjcXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNzY0OTgsImV4cCI6MjA1OTg1MjQ5OH0.Ruox-xcKxcirSSmTsNHpPIXqUyFCApZOisJViI_Hp1w';

export const supabase = createClient(supabaseUrl, supabaseKey);

// SQL query to create reviews table:
/*
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date TEXT
);
*/

// Use edge function for UPS API calls (bypasses CORS)
const USE_EDGE_FUNCTION = true;

// Types for UPS integration
export interface UPSAddress {
  addressLine: string;
  city: string;
  postalCode: string;
  countryCode: string;
  stateProvinceCode?: string;
}

export interface UPSShippingRate {
  serviceCode: string;
  serviceName: string;
  totalPrice: number;
  currency: string;
  deliveryTimeEstimate: string;
}

// Call edge function for UPS operations
const callUPSEdgeFunction = async (action: string, params: any) => {
  const response = await supabase.functions.invoke('ups-shipping', {
    body: { action, ...params }
  });

  if (response.error) {
    console.error('Edge function error:', response.error);
    throw new Error(response.error.message || 'Failed to call UPS service');
  }

  return response.data;
};

/**
 * Validate address through UPS API via edge function
 */
export const validateUPSAddress = async (address: UPSAddress): Promise<UPSAddress[]> => {
  if (!USE_EDGE_FUNCTION) {
    // Fallback: return original address
    console.log('Edge function disabled, returning original address');
    return [address];
  }

  try {
    console.log('Validating address via edge function:', address);
    
    // Convert country name to ISO code if needed
    const countryCode = getCountryCode(address.countryCode);
    const addressWithCode = { ...address, countryCode };
    
    const result = await callUPSEdgeFunction('validate', { address: addressWithCode });
    
    if (result.success && result.addresses) {
      console.log('Address validated successfully:', result.addresses);
      return result.addresses;
    }
    
    return [address];
  } catch (error) {
    console.error('Error validating address:', error);
    return [address];
  }
};

// Hardcoded shipping rates for each country
const HARDCODED_UPS_RATES: Record<string, UPSShippingRate[]> = {
  "IE": [
    {
      serviceCode: "IE_standard",
      serviceName: "UPS Standard (Ireland)",
      totalPrice: 8.99,
      currency: "EUR",
      deliveryTimeEstimate: "1-2 business days"
    },
    {
      serviceCode: "IE_express",
      serviceName: "UPS Express  (Ireland)",
      totalPrice: 34.99,
      currency: "EUR",
      deliveryTimeEstimate: "Next business day"
    }
  ],
  "RO": [
    {
      "serviceCode": "RO_standard",
      "serviceName": "UPS Standard (IE → RO)",
      "totalPrice": 10.19,
      "currency": "EUR",
      "deliveryTimeEstimate": "3–5 business days"
    },
    {
      "serviceCode": "RO_express",
      "serviceName": "UPS Express (IE → RO)",
      "totalPrice": 22.29,
      "currency": "EUR",
      "deliveryTimeEstimate": "1–2 business days"
    }
  ],
  "FR": [
    {
      serviceCode: "FR_standard",
      serviceName: "UPS Standard (France)",
      totalPrice: 15.90,
      currency: "EUR",
      deliveryTimeEstimate: "2-4 business days"
    },
    {
      serviceCode: "FR_express",
      serviceName: "UPS Express (France)",
      totalPrice: 32.90,
      currency: "EUR",
      deliveryTimeEstimate: "1-2 business days"
    }
  ],
  "DE": [
    {
      serviceCode: "DE_standard",
      serviceName: "UPS Standard (Germany)",
      totalPrice: 15.90,
      currency: "EUR",
      deliveryTimeEstimate: "2-4 business days"
    },
    {
      serviceCode: "DE_express",
      serviceName: "UPS Express (Germany)",
      totalPrice: 25.90,
      currency: "EUR",
      deliveryTimeEstimate: "1-2 business days"
    }
  ],
  "ES": [
    {
      serviceCode: "ES_standard",
      serviceName: "UPS Standard (Spain)",
      totalPrice: 18.99,
      currency: "EUR",
      deliveryTimeEstimate: "3-5 business days"
    },
    {
      serviceCode: "ES_express",
      serviceName: "UPS Express (Spain)",
      totalPrice: 29.99,
      currency: "EUR",
      deliveryTimeEstimate: "2-3 business days"
    }
  ],
  "IT": [
    {
      serviceCode: "IT_standard",
      serviceName: "UPS Standard (Italy)",
      totalPrice: 17.50,
      currency: "EUR",
      deliveryTimeEstimate: "3-5 business days"
    },
    {
      serviceCode: "IT_express",
      serviceName: "UPS Express (Italy)",
      totalPrice: 27.00,
      currency: "EUR",
      deliveryTimeEstimate: "2-3 business days"
    }
  ],
  "NL": [
    {
      serviceCode: "NL_standard",
      serviceName: "UPS Standard (Netherlands)",
      totalPrice: 16.70,
      currency: "EUR",
      deliveryTimeEstimate: "2-4 business days"
    },
    {
      serviceCode: "NL_express",
      serviceName: "UPS Express (Netherlands)",
      totalPrice: 26.20,
      currency: "EUR",
      deliveryTimeEstimate: "1-2 business days"
    }
  ],
  "BE": [
    {
      serviceCode: "BE_standard",
      serviceName: "UPS Standard (Belgium)",
      totalPrice: 16.50,
      currency: "EUR",
      deliveryTimeEstimate: "2-4 business days"
    },
    {
      serviceCode: "BE_express",
      serviceName: "UPS Express (Belgium)",
      totalPrice: 26.00,
      currency: "EUR",
      deliveryTimeEstimate: "1-2 business days"
    }
  ],
  "PT": [
    {
      serviceCode: "PT_standard",
      serviceName: "UPS Standard (Portugal)",
      totalPrice: 18.50,
      currency: "EUR",
      deliveryTimeEstimate: "3-5 business days"
    },
    {
      serviceCode: "PT_express",
      serviceName: "UPS Express (Portugal)",
      totalPrice: 28.00,
      currency: "EUR",
      deliveryTimeEstimate: "2-3 business days"
    }
  ],
  "CH": [
    {
      serviceCode: "CH_standard",
      serviceName: "UPS Standard (Switzerland)",
      totalPrice: 21.00,
      currency: "EUR",
      deliveryTimeEstimate: "3-7 business days"
    },
    {
      serviceCode: "CH_express",
      serviceName: "UPS Express (Switzerland)",
      totalPrice: 32.00,
      currency: "EUR",
      deliveryTimeEstimate: "2-4 business days"
    }
  ],
  "AT": [
    {
      serviceCode: "AT_standard",
      serviceName: "UPS Standard (Austria)",
      totalPrice: 17.00,
      currency: "EUR",
      deliveryTimeEstimate: "2-4 business days"
    },
    {
      serviceCode: "AT_express",
      serviceName: "UPS Express (Austria)",
      totalPrice: 27.00,
      currency: "EUR",
      deliveryTimeEstimate: "1-2 business days"
    }
  ],
  "PL": [
    {
      serviceCode: "PL_standard",
      serviceName: "UPS Standard (Poland)",
      totalPrice: 18.80,
      currency: "EUR",
      deliveryTimeEstimate: "3-5 business days"
    },
    {
      serviceCode: "PL_express",
      serviceName: "UPS Express (Poland)",
      totalPrice: 29.00,
      currency: "EUR",
      deliveryTimeEstimate: "2-3 business days"
    }
  ],
  "SE": [
    {
      serviceCode: "SE_standard",
      serviceName: "UPS Standard (Sweden)",
      totalPrice: 20.00,
      currency: "EUR",
      deliveryTimeEstimate: "3-5 business days"
    },
    {
      serviceCode: "SE_express",
      serviceName: "UPS Express (Sweden)",
      totalPrice: 32.00,
      currency: "EUR",
      deliveryTimeEstimate: "2-4 business days"
    }
  ],
  "DK": [
    {
      serviceCode: "DK_standard",
      serviceName: "UPS Standard (Denmark)",
      totalPrice: 19.00,
      currency: "EUR",
      deliveryTimeEstimate: "3-5 business days"
    },
    {
      serviceCode: "DK_express",
      serviceName: "UPS Express (Denmark)",
      totalPrice: 30.00,
      currency: "EUR",
      deliveryTimeEstimate: "2-4 business days"
    }
  ],
  "NO": [
    {
      serviceCode: "NO_standard",
      serviceName: "UPS Standard (Norway)",
      totalPrice: 25.00,
      currency: "EUR",
      deliveryTimeEstimate: "4-7 business days"
    },
    {
      serviceCode: "NO_express",
      serviceName: "UPS Express (Norway)",
      totalPrice: 36.00,
      currency: "EUR",
      deliveryTimeEstimate: "2-4 business days"
    }
  ],
  "FI": [
    {
      serviceCode: "FI_standard",
      serviceName: "UPS Standard (Finland)",
      totalPrice: 21.00,
      currency: "EUR",
      deliveryTimeEstimate: "4-7 business days"
    },
    {
      serviceCode: "FI_express",
      serviceName: "UPS Express (Finland)",
      totalPrice: 33.00,
      currency: "EUR",
      deliveryTimeEstimate: "2-4 business days"
    }
  ],
  "GR": [
    {
      serviceCode: "GR_standard",
      serviceName: "UPS Standard (Greece)",
      totalPrice: 28.00,
      currency: "EUR",
      deliveryTimeEstimate: "4-8 business days"
    },
    {
      serviceCode: "GR_express",
      serviceName: "UPS Express (Greece)",
      totalPrice: 45.00,
      currency: "EUR",
      deliveryTimeEstimate: "2-5 business days"
    }
  ]
};

/**
 * Get shipping rates from UPS API via edge function, with hardcoded fallback
 */
export const getUPSShippingRates = async (
  fromAddress: UPSAddress,
  toAddress: UPSAddress,
  packageWeight: number,
  packageDimensions?: { length: number; width: number; height: number }
): Promise<UPSShippingRate[]> => {
  const countryCode = getCountryCode(toAddress.countryCode);

  if (!USE_EDGE_FUNCTION) {
    // Use hardcoded rates as fallback
    console.log('Using hardcoded rates for country:', countryCode);
    return HARDCODED_UPS_RATES[countryCode] || [
      {
        serviceCode: 'EU_other_standard',
        serviceName: 'UPS Standard (Europe)',
        totalPrice: 21.99,
        currency: 'EUR',
        deliveryTimeEstimate: '3-6 business days'
      },
      {
        serviceCode: 'EU_other_express',
        serviceName: 'UPS Express (Europe)',
        totalPrice: 32.99,
        currency: 'EUR',
        deliveryTimeEstimate: '2-4 business days'
      }
    ];
  }

  try {
    console.log('Getting shipping rates via edge function');
    
    const fromAddressWithCode = { ...fromAddress, countryCode: getCountryCode(fromAddress.countryCode) };
    const toAddressWithCode = { ...toAddress, countryCode };
    
    const result = await callUPSEdgeFunction('rates', {
      fromAddress: fromAddressWithCode,
      toAddress: toAddressWithCode,
      weight: packageWeight
    });
    
    if (result.success && result.rates && result.rates.length > 0) {
      console.log('Got shipping rates from UPS API:', result.rates);
      return result.rates;
    }
    
    // Fallback to hardcoded rates if API returns no rates
    console.log('API returned no rates, using hardcoded fallback');
    return HARDCODED_UPS_RATES[countryCode] || [
      {
        serviceCode: 'EU_other_standard',
        serviceName: 'UPS Standard (Europe)',
        totalPrice: 21.99,
        currency: 'EUR',
        deliveryTimeEstimate: '3-6 business days'
      }
    ];
  } catch (error) {
    console.error('Error getting shipping rates, using hardcoded fallback:', error);
    return HARDCODED_UPS_RATES[countryCode] || [
      {
        serviceCode: 'EU_other_standard',
        serviceName: 'UPS Standard (Europe)',
        totalPrice: 21.99,
        currency: 'EUR',
        deliveryTimeEstimate: '3-6 business days'
      }
    ];
  }
};

// Helper function to get country code
const getCountryCode = (country: string): string => {
  const countryCodes: {[key: string]: string} = {
    'Ireland': 'IE',
    'Romania': 'RO',
    'United Kingdom': 'GB',
    'France': 'FR',
    'Germany': 'DE',
    'Spain': 'ES',
    'Italy': 'IT',
    'Netherlands': 'NL',
    'Belgium': 'BE',
    'Portugal': 'PT',
    'Switzerland': 'CH',
    'Austria': 'AT',
    'Poland': 'PL',
    'Sweden': 'SE',
    'Denmark': 'DK',
    'Norway': 'NO',
    'Finland': 'FI',
    'Greece': 'GR',
    // Already a country code
    'IE': 'IE',
    'GB': 'GB',
    'FR': 'FR',
    'DE': 'DE',
    'ES': 'ES',
    'IT': 'IT',
    'NL': 'NL',
    'BE': 'BE',
    'PT': 'PT',
    'CH': 'CH',
    'AT': 'AT',
    'PL': 'PL',
    'SE': 'SE',
    'DK': 'DK',
    'NO': 'NO',
    'FI': 'FI',
    'GR': 'GR',
  };
  
  return countryCodes[country] || country;
};

// Helper function to get service name from service code
const getServiceName = (serviceCode: string): string => {
  const serviceNames: {[key: string]: string} = {
    '01': 'UPS Next Day Air',
    '02': 'UPS 2nd Day Air',
    '03': 'UPS Ground',
    '07': 'UPS Worldwide Express',
    '08': 'UPS Worldwide Expedited',
    '11': 'UPS Standard',
    '12': 'UPS 3 Day Select',
    '14': 'UPS Next Day Air Early',
    '54': 'UPS Worldwide Express Plus',
    '59': 'UPS 2nd Day Air A.M.',
    '65': 'UPS Saver',
    '82': 'UPS Today Standard',
    '83': 'UPS Today Dedicated Courier',
    '84': 'UPS Today Intercity',
    '85': 'UPS Today Express',
    '86': 'UPS Today Express Saver',
    '96': 'UPS Worldwide Express Freight'
  };
  
  return serviceNames[serviceCode] || `UPS Service (${serviceCode})`;
};

