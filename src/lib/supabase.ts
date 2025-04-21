
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://inivoiunisrgdinrcquu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluaXZvaXVuaXNyZ2RpbnJjcXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNzY0OTgsImV4cCI6MjA1OTg1MjQ5OH0.Ruox-xcKxcirSSmTsNHpPIXqUyFCApZOisJViI_Hp1w';

export const supabase = createClient(supabaseUrl, supabaseKey);

// SQL query to create reviews table:
/* ... keep existing code (SQL table creation) ... */

// UPS API credentials - ці ключі зараз використовуються тільки для MOCK_MODE
const UPS_CLIENT_ID = '9X8eEjrWfwfIBZyr0H4T8ZhXGcSwXHzCJNvE0bdFPISoFMxu';
const UPS_CLIENT_SECRET = 'TPG00XQHHbKCZpoBXGrcHCNmSvAuRJFOPPDfoylgdftWt7mR4jxPDTRB9jVyxS8i';

// Важливо: встановити MOCK_MODE=true для використання мокових API викликів під час розробки
const MOCK_MODE = false;

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
    // For production, this would ideally be a server-side call to avoid CORS issues
    const response = await fetch('https://onlinetools.ups.com/security/v1/oauth/token', {
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
  console.log('Starting address validation, MOCK_MODE=', MOCK_MODE);
  
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
    
    const response = await fetch(`https://onlinetools.ups.com/api/addressvalidation/v1/1`, {
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
 * Отримати тарифи доставки UPS через Supabase Edge Function.
 */
export const getUPSShippingRates = async (
  fromAddress: UPSAddress,
  toAddress: UPSAddress,
  packageWeight: number,
  packageDimensions?: { length: number; width: number; height: number }
): Promise<UPSShippingRate[]> => {
  // Якщо включений мок-режим, повертаємо фіктивні дані
  if (MOCK_MODE) {
    console.log('Mock mode ON: Returning mock shipping rates');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return [
      {
        serviceCode: "mock_standard",
        serviceName: "UPS Standard (Mock)",
        totalPrice: 12.99,
        currency: "EUR",
        deliveryTimeEstimate: "3-5 business days"
      },
      {
        serviceCode: "mock_express",
        serviceName: "UPS Express (Mock)",
        totalPrice: 24.99,
        currency: "EUR",
        deliveryTimeEstimate: "1-2 business days"
      },
      {
        serviceCode: "mock_economy",
        serviceName: "UPS Economy (Mock)",
        totalPrice: 8.99,
        currency: "EUR",
        deliveryTimeEstimate: "5-7 business days"
      }
    ];
  }
  
  // Реальний запит через Supabase Edge Function
  console.log('Making REAL request to UPS API via Edge Function');
  
  try {
    // Використовуємо повний URL із Supabase проекту
    const funcUrl = `${supabaseUrl}/functions/v1/ups-shipping-rates`;
    console.log("Calling Edge Function at:", funcUrl);
    
    const response = await fetch(funcUrl, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({ fromAddress, toAddress, packageWeight, packageDimensions }),
    });

    console.log('Response status from Edge Function:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Edge function UPS shipping rates error:", errorText);
      throw new Error(errorText || "Edge function error");
    }

    const data = await response.json();
    console.log('Received rates from Edge Function:', data);
    
    if (Array.isArray(data.rates)) {
      return data.rates;
    }
    throw new Error(data.error || "No rates returned");
  } catch (error) {
    console.error("Error from UPS shipping edge function:", error);
    throw error;
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
