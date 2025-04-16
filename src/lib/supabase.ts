
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://inivoiunisrgdinrcquu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluaXZvaXVuaXNyZ2RpbnJjcXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNzY0OTgsImV4cCI6MjA1OTg1MjQ5OH0.Ruox-xcKxcirSSmTsNHpPIXqUyFCApZOisJViI_Hp1w';

export const supabase = createClient(supabaseUrl, supabaseKey);

// SQL query to create reviews table:
/* ... keep existing code (SQL table creation) ... */

// UPS API credentials
const UPS_CLIENT_ID = '9X8eEjrWfwfIBZyr0H4T8ZhXGcSwXHzCJNvE0bdFPISoFMxu';
const UPS_CLIENT_SECRET = 'TPG00XQHHbKCZpoBXGrcHCNmSvAuRJFOPPDfoylgdftWt7mR4jxPDTRB9jVyxS8i';
const UPS_API_URL = 'https://wwwcie.ups.com/api'; // Using test environment URL

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
  try {
    const response = await fetch('https://wwwcie.ups.com/security/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-merchant-id': UPS_CLIENT_ID,
      },
      body: `grant_type=client_credentials&client_id=${UPS_CLIENT_ID}&client_secret=${UPS_CLIENT_SECRET}`,
    });

    if (!response.ok) {
      throw new Error('Failed to get UPS access token');
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting UPS access token:', error);
    throw error;
  }
};

/**
 * Validate and lookup address through UPS API
 */
export const validateUPSAddress = async (address: UPSAddress): Promise<UPSAddress[]> => {
  try {
    const accessToken = await getUPSAccessToken();
    
    const response = await fetch(`${UPS_API_URL}/addressvalidation/v1/1`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        XAVRequest: {
          AddressKeyFormat: {
            AddressLine: address.addressLine,
            PoliticalDivision2: address.city,
            PostcodePrimaryLow: address.postalCode,
            CountryCode: address.countryCode,
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Address validation failed');
    }

    const data = await response.json();
    
    // Parse and return validated addresses
    const validatedAddresses = data.XAVResponse.ValidAddressIndicator 
      ? [address] // If address is valid, return the original
      : data.XAVResponse.CandidateAddressList?.CandidateAddress?.map((candidate: any) => ({
          addressLine: candidate.AddressKeyFormat.AddressLine,
          city: candidate.AddressKeyFormat.PoliticalDivision2,
          postalCode: candidate.AddressKeyFormat.PostcodePrimaryLow,
          countryCode: candidate.AddressKeyFormat.CountryCode,
        })) || [];

    return validatedAddresses;
  } catch (error) {
    console.error('Error validating UPS address:', error);
    throw error;
  }
};

/**
 * Get available shipping rates from UPS
 */
export const getUPSShippingRates = async (
  fromAddress: UPSAddress,
  toAddress: UPSAddress,
  packageWeight: number,
  packageDimensions?: { length: number; width: number; height: number }
): Promise<UPSShippingRate[]> => {
  try {
    const accessToken = await getUPSAccessToken();

    const response = await fetch(`${UPS_API_URL}/rating/v1/Shop`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
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
                CountryCode: fromAddress.countryCode,
              }
            },
            ShipTo: {
              Address: {
                AddressLine: toAddress.addressLine,
                City: toAddress.city,
                PostalCode: toAddress.postalCode,
                CountryCode: toAddress.countryCode,
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
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get shipping rates');
    }

    const data = await response.json();
    
    return data.RateResponse.RatedShipment.map((rate: any) => ({
      serviceCode: rate.Service.Code,
      serviceName: rate.Service.Description,
      totalPrice: parseFloat(rate.TotalCharges.MonetaryValue),
      currency: rate.TotalCharges.CurrencyCode,
      deliveryTimeEstimate: rate.GuaranteedDelivery?.BusinessDaysInTransit 
        ? `${rate.GuaranteedDelivery.BusinessDaysInTransit} business days`
        : 'Delivery time varies'
    }));
  } catch (error) {
    console.error('Error getting UPS shipping rates:', error);
    throw error;
  }
};
