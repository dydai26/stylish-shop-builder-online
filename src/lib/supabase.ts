
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

// UPS API credentials
const UPS_CLIENT_ID = '9X8eEjrWfwfIBZyr0H4T8ZhXGcSwXHzCJNvE0bdFPISoFMxu';
const UPS_CLIENT_SECRET = 'TPG00XQHHbKCZpoBXGrcHCNmSvAuRJFOPPDfoylgdftWt7mR4jxPDTRB9jVyxS8i';

// Типи для інтеграції з UPS
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

// Функція для отримання токену доступу UPS API
const getUPSAccessToken = async (): Promise<string> => {
  try {
    // У реальному проекті цей запит повинен виконуватися на стороні сервера
    // для безпеки клієнтських даних
    console.log('Getting UPS access token...');
    
    // Імітуємо отримання токена
    // У реальній реалізації тут був би fetch запит до UPS OAuth API
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('SIMULATED_UPS_ACCESS_TOKEN');
      }, 500);
    });
  } catch (error) {
    console.error('Error getting UPS access token:', error);
    throw error;
  }
};

/**
 * Валідація та пошук адреси через UPS API
 */
export const validateUPSAddress = async (address: UPSAddress): Promise<UPSAddress[]> => {
  try {
    // Отримуємо токен доступу
    const accessToken = await getUPSAccessToken();
    
    // Імітуємо відповідь від UPS API
    console.log('Validating address with UPS:', address);
    
    // У реальній реалізації тут був би fetch запит до UPS Address Validation API
    // з використанням отриманого токену
    return new Promise(resolve => {
      setTimeout(() => {
        // Припустимо, що UPS знайшов схожу адресу
        resolve([
          {
            addressLine: address.addressLine,
            city: address.city,
            postalCode: address.postalCode,
            countryCode: address.countryCode,
            stateProvinceCode: address.stateProvinceCode
          }
        ]);
      }, 1000);
    });
  } catch (error) {
    console.error('Error validating UPS address:', error);
    throw error;
  }
};

/**
 * Отримання доступних тарифів доставки від UPS
 */
export const getUPSShippingRates = async (
  fromAddress: UPSAddress,
  toAddress: UPSAddress,
  packageWeight: number,
  packageDimensions?: { length: number; width: number; height: number }
): Promise<UPSShippingRate[]> => {
  try {
    // Отримуємо токен доступу
    const accessToken = await getUPSAccessToken();
    
    // Імітуємо запит до UPS для отримання тарифів
    console.log('Getting shipping rates from UPS:', { fromAddress, toAddress, packageWeight, packageDimensions });
    
    // У реальній реалізації тут був би fetch запит до UPS Rate API
    // з використанням отриманого токену
    return new Promise(resolve => {
      setTimeout(() => {
        // Повертаємо приклади доступних тарифів
        resolve([
          {
            serviceCode: 'UPS_GROUND',
            serviceName: 'UPS Ground',
            totalPrice: 10.99,
            currency: 'EUR',
            deliveryTimeEstimate: '3-5 business days'
          },
          {
            serviceCode: 'UPS_3DAY',
            serviceName: 'UPS 3-Day Select',
            totalPrice: 15.99,
            currency: 'EUR',
            deliveryTimeEstimate: '3 business days'
          },
          {
            serviceCode: 'UPS_2DAY',
            serviceName: 'UPS 2nd Day Air',
            totalPrice: 22.99,
            currency: 'EUR',
            deliveryTimeEstimate: '2 business days'
          },
          {
            serviceCode: 'UPS_NEXT_DAY',
            serviceName: 'UPS Next Day Air',
            totalPrice: 34.99,
            currency: 'EUR',
            deliveryTimeEstimate: 'Next business day'
          }
        ]);
      }, 1500);
    });
  } catch (error) {
    console.error('Error getting UPS shipping rates:', error);
    throw error;
  }
};
