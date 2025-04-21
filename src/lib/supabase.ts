import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://inivoiunisrgdinrcquu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluaXZvaXVuaXNyZ2RpbnJjcXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNzY0OTgsImV4cCI6MjA1OTg1MjQ5OH0.Ruox-xcKxcirSSmTsNHpPIXqUyFCApZOisJViI_Hp1w';

export const supabase = createClient(supabaseUrl, supabaseKey);

// SQL query to create reviews table:
/*
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  product_id INTEGER NOT NULL,
  user_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  helpful_votes INTEGER DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
*/

// UPS API credentials
const UPS_CLIENT_ID = '9X8eEjrWfwfIBZyr0H4T8ZhXGcSwXHzCJNvE0bdFPISoFMxu';
const UPS_CLIENT_SECRET = 'TPG00XQHHbKCZpoBXGrcHCNmSvAuRJFOPPDfoylgdftWt7mR4jxPDTRB9jVyxS8i';

// For development and testing, we'll use mock data to avoid CORS issues with direct API calls
const MOCK_MODE = true; // Set to false when using a backend proxy for production

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

// Function to get UPS access token
const getUPSAccessToken = async (): Promise<string> => {
  if (MOCK_MODE) {
    console.log('Mock mode: Returning fake access token');
    return 'mock_access_token_for_development';
  }
  
  try {
    // In production, this would be a server-side call to avoid CORS issues
    const response = await fetch('https://wwwcie.ups.com/security/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-merchant-id': UPS_CLIENT_ID,
      },
      body: `grant_type=client_credentials&client_id=${UPS_CLIENT_ID}&client_secret=${UPS_CLIENT_SECRET}`,
    });

    if (!response.ok) {
      console.error('UPS token response:', await response.text());
      throw new Error(`Failed to get UPS access token: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('UPS token obtained successfully');
    return data.access_token;
  } catch (error) {
    console.error('Error getting UPS access token:', error);
    throw error;
  }
};

/**
 * Validate and lookup address through UPS API
 * In development mode, returns mock data to avoid CORS issues
 */
export const validateUPSAddress = async (address: UPSAddress): Promise<UPSAddress[]> => {
  // For development and testing, return a mocked validation response
  if (MOCK_MODE) {
    console.log('Mock mode: Validating address:', address);
    
    // Simulate a slight delay to mimic API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return a slightly modified address to simulate validation correction
    return [{
      addressLine: address.addressLine,
      city: address.city,
      postalCode: address.postalCode,
      countryCode: address.countryCode,
    }];
  }
  
  try {
    const accessToken = await getUPSAccessToken();
    console.log('Validating address:', address);
    
    // Convert country name to ISO country code if needed
    const countryCode = getCountryCode(address.countryCode);
    
    const validationPayload = {
      XAVRequest: {
        AddressKeyFormat: {
          AddressLine: address.addressLine,
          PoliticalDivision2: address.city,
          PostcodePrimaryLow: address.postalCode,
          CountryCode: countryCode,
        },
      },
    };
    
    console.log('Sending address validation request:', JSON.stringify(validationPayload));
    
    const response = await fetch(`https://wwwcie.ups.com/api/addressvalidation/v1/1`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validationPayload),
    });

    const responseText = await response.text();
    console.log('UPS address validation raw response:', responseText);
    
    if (!response.ok) {
      throw new Error(`Address validation failed: ${response.status} ${response.statusText}`);
    }

    try {
      const data = JSON.parse(responseText);
      console.log('Parsed address validation response:', data);
      
      // Handle various response formats
      if (data.XAVResponse?.ValidAddressIndicator) {
        // Address is valid
        console.log('Address is valid according to UPS');
        return [address];
      } else if (data.XAVResponse?.NoCandidatesIndicator) {
        // No matches found
        console.log('No valid addresses found');
        return [];
      } else if (data.XAVResponse?.CandidateAddressList) {
        // Handle candidate addresses
        const candidates = Array.isArray(data.XAVResponse.CandidateAddressList.CandidateAddress)
          ? data.XAVResponse.CandidateAddressList.CandidateAddress
          : [data.XAVResponse.CandidateAddressList.CandidateAddress];
        
        console.log('Found candidate addresses:', candidates.length);
        
        return candidates.map((candidate: any) => ({
          addressLine: candidate.AddressKeyFormat.AddressLine[0] || address.addressLine,
          city: candidate.AddressKeyFormat.PoliticalDivision2 || address.city,
          postalCode: candidate.AddressKeyFormat.PostcodePrimaryLow || address.postalCode,
          countryCode: candidate.AddressKeyFormat.CountryCode || countryCode,
        }));
      } else {
        // Fallback - return original address
        console.log('No specific validation result, returning original address');
        return [address];
      }
    } catch (parseError) {
      console.error('Error parsing UPS response:', parseError);
      // If parsing fails, return the original address
      return [address];
    }
  } catch (error) {
    console.error('Error validating UPS address:', error);
    // In case of API failure, return the original address
    return [address];
  }
};

// Hardcoded shipping rates for each country
const HARDCODED_UPS_RATES: Record<string, UPSShippingRate[]> = {
  "IE": [
    {
      serviceCode: "IE_standard",
      serviceName: "UPS Standard (Ireland)",
      totalPrice: 6.20,
      currency: "EUR",
      deliveryTimeEstimate: "1-2 business days"
    },
    {
      serviceCode: "IE_express",
      serviceName: "UPS Express Saver (Ireland)",
      totalPrice: 10.90,
      currency: "EUR",
      deliveryTimeEstimate: "Next business day"
    }
  ],
  "GB": [
    {
      serviceCode: "GB_standard",
      serviceName: "UPS Standard (UK)",
      totalPrice: 13.99,
      currency: "EUR",
      deliveryTimeEstimate: "2-3 business days"
    },
    {
      serviceCode: "GB_express",
      serviceName: "UPS Express (UK)",
      totalPrice: 23.99,
      currency: "EUR",
      deliveryTimeEstimate: "1-2 business days"
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
      totalPrice: 25.90,
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
 * Get available shipping rates from hardcoded list instead of UPS API.
 */
export const getUPSShippingRates = async (
  fromAddress: UPSAddress,
  toAddress: UPSAddress,
  packageWeight: number,
  packageDimensions?: { length: number; width: number; height: number }
): Promise<UPSShippingRate[]> => {
  const countryCode = getCountryCode(toAddress.countryCode);

  // If there are rates for the country, return them
  if (HARDCODED_UPS_RATES[countryCode]) {
    return HARDCODED_UPS_RATES[countryCode];
  }

  // If no rates for the country, return standard rates for "rest of Europe"
  return [
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
};

// Helper function to get country code
const getCountryCode = (country: string): string => {
  const countryCodes: {[key: string]: string} = {
    'Ireland': 'IE',
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
