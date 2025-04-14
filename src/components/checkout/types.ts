
import { UPSShippingRate } from "@/lib/supabase";

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  paymentMethod: string;
  shippingMethod: string;
}

export interface ShippingInfo {
  name: string;
  price: number;
}

export interface PaymentInfo {
  id: string;
  testDetails?: string;
  [key: string]: any;
}

export interface OrderData {
  orderId: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: any[];
  shipping?: ShippingInfo;
  subtotal: number;
  tax: number;
  total: number;
  date: string;
  paymentInfo?: PaymentInfo;
}
