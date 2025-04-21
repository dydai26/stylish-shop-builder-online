
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://inivoiunisrgdinrcquu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluaXZvaXVuaXNyZ2RpbnJjcXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNzY0OTgsImV4cCI6MjA1OTg1MjQ5OH0.Ruox-xcKxcirSSmTsNHpPIXqUyFCApZOisJViI_Hp1w';

export const supabase = createClient(supabaseUrl, supabaseKey);

// SQL query to create reviews table:
/* ... keep existing code (SQL table creation) ... */

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

/**
 * Get available shipping rates from UPS
 * In development mode, returns mock data to avoid CORS issues
 */
export const getUPSShippingRates = async (
  fromAddress: UPSAddress,
  toAddress: UPSAddress,
  packageWeight: number,
  packageDimensions?: { length: number; width: number; height: number }
): Promise<UPSShippingRate[]> => {
  // For development and testing, return mocked rates
  if (MOCK_MODE) {
    console.log('Mock mode: Getting shipping rates from', fromAddress, 'to', toAddress);
    
    // Simulate a slight delay to mimic API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate different rates based on destination country
    const countryCode = getCountryCode(toAddress.countryCode);
    let rates: UPSShippingRate[] = [];
    
    // Mock different rates based on country and package weight
    if (countryCode === 'IE') {
      // Ireland rates
      rates = [
        {
          serviceCode: 'IE_standard',
          serviceName: 'UPS Standard (Ireland)',
          totalPrice: 5.99,
          currency: 'EUR',
          deliveryTimeEstimate: '1-2 business days'
        },
        {
          serviceCode: 'IE_express',
          serviceName: 'UPS Express Saver (Ireland)',
          totalPrice: 9.99,
          currency: 'EUR',
          deliveryTimeEstimate: 'Next business day'
        }
      ];
    } else if (['GB', 'UK'].includes(countryCode)) {
      // UK rates
      rates = [
        {
          serviceCode: 'GB_standard',
          serviceName: 'UPS Standard (UK)',
          totalPrice: 12.99,
          currency: 'EUR',
          deliveryTimeEstimate: '2-3 business days'
        },
        {
          serviceCode: 'GB_express',
          serviceName: 'UPS Express (UK)',
          totalPrice: 22.99,
          currency: 'EUR',
          deliveryTimeEstimate: '1-2 business days'
        }
      ];
    } else if (['FR', 'DE', 'ES', 'IT', 'NL', 'BE', 'PT'].includes(countryCode)) {
      // Core EU countries
      rates = [
        {
          serviceCode: 'EU_standard',
          serviceName: 'UPS Standard (EU)',
          totalPrice: 14.99,
          currency: 'EUR',
          deliveryTimeEstimate: '2-4 business days'
        },
        {
          serviceCode: 'EU_express',
          serviceName: 'UPS Express (EU)',
          totalPrice: 24.99,
          currency: 'EUR',
          deliveryTimeEstimate: '1-2 business days'
        }
      ];
    } else {
      // Rest of Europe
      rates = [
        {
          serviceCode: 'EU_other_standard',
          serviceName: 'UPS Standard (Europe)',
          totalPrice: 19.99,
          currency: 'EUR',
          deliveryTimeEstimate: '3-5 business days'
        },
        {
          serviceCode: 'EU_other_express',
          serviceName: 'UPS Express (Europe)',
          totalPrice: 29.99,
          currency: 'EUR',
          deliveryTimeEstimate: '2-3 business days'
        }
      ];
    }
    
    // Adjust prices based on weight
    if (packageWeight > 2) {
      rates = rates.map(rate => ({
        ...rate,
        totalPrice: parseFloat((rate.totalPrice * 1.5).toFixed(2))
      }));
    }
    
    console.log('Returning mock shipping rates:', rates);
    return rates;
  }
  
  try {
    const accessToken = await getUPSAccessToken();
    console.log('Getting shipping rates from', fromAddress, 'to', toAddress);
    
    // Convert country names to ISO country codes if needed
    const fromCountryCode = getCountryCode(fromAddress.countryCode);
    const toCountryCode = getCountryCode(toAddress.countryCode);
    
    const rateRequest = {
      RateRequest: {
        Request: {
          RequestOption: "Shop",
          TransactionReference: {
            CustomerContext: "Rating and Service"
          }
        },
        Shipment: {
          Shipper: {
            Address: {
              AddressLine: fromAddress.addressLine,
              City: fromAddress.city,
              PostalCode: fromAddress.postalCode,
              CountryCode: fromCountryCode,
            }
          },
          ShipTo: {
            Address: {
              AddressLine: toAddress.addressLine,
              City: toAddress.city,
              PostalCode: toAddress.postalCode,
              CountryCode: toCountryCode,
            }
          },
          Package: {
            PackagingType: {
              Code: "02", // Customer Supplied Package
              Description: "Package"
            },
            PackageWeight: {
              UnitOfMeasurement: {
                Code: "KGS"
              },
              Weight: packageWeight.toString()
            },
            ...(packageDimensions && {
              Dimensions: {
                UnitOfMeasurement: {
                  Code: "CM"
                },
                Length: packageDimensions.length.toString(),
                Width: packageDimensions.width.toString(),
                Height: packageDimensions.height.toString()
              }
            })
          }
        }
      }
    };
    
    console.log('Sending rate request:', JSON.stringify(rateRequest));
    
    const response = await fetch(`https://wwwcie.ups.com/api/rating/v1/Shop`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rateRequest),
    });

    const responseText = await response.text();
    console.log('UPS shipping rates raw response:', responseText);
    
    if (!response.ok) {
      throw new Error(`Failed to get shipping rates: ${response.status} ${response.statusText}`);
    }

    try {
      const data = JSON.parse(responseText);
      console.log('Parsed shipping rates response:', data);
      
      if (!data.RateResponse?.RatedShipment) {
        console.warn('No shipping rates returned');
        return [];
      }
      
      const ratedShipments = Array.isArray(data.RateResponse.RatedShipment) 
        ? data.RateResponse.RatedShipment 
        : [data.RateResponse.RatedShipment];
      
      return ratedShipments.map((rate: any) => ({
        serviceCode: rate.Service.Code,
        serviceName: getServiceName(rate.Service.Code),
        totalPrice: parseFloat(rate.TotalCharges.MonetaryValue),
        currency: rate.TotalCharges.CurrencyCode,
        deliveryTimeEstimate: rate.GuaranteedDelivery?.BusinessDaysInTransit 
          ? `${rate.GuaranteedDelivery.BusinessDaysInTransit} business days`
          : 'Delivery time varies'
      }));
    } catch (parseError) {
      console.error('Error parsing UPS rates response:', parseError);
      return [];
    }
  } catch (error) {
    console.error('Error getting UPS shipping rates:', error);
    return [];
  }
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
