import { useEffect } from 'react';

declare global {
  interface Window {
    ttq?: {
      track: (event: string, data?: any) => void;
      identify: (data: any) => void;
      page: () => void;
    };
  }
}

export const useTikTokTracking = () => {
  const trackViewContent = (product: {
    id: string;
    name: string;
    price: number;
  }) => {
    if (typeof window.ttq !== 'undefined') {
      window.ttq.track('ViewContent', {
        contents: [{
          content_id: product.id,
          content_type: 'product',
          content_name: product.name
        }],
        value: product.price,
        currency: 'EUR'
      });
    }
  };

  const trackAddToCart = (product: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }) => {
    if (typeof window.ttq !== 'undefined') {
      window.ttq.track('AddToCart', {
        contents: [{
          content_id: product.id,
          content_type: 'product',
          content_name: product.name
        }],
        value: product.price * product.quantity,
        currency: 'EUR'
      });
    }
  };

  const trackInitiateCheckout = (items: any[], total: number) => {
    if (typeof window.ttq !== 'undefined') {
      window.ttq.track('InitiateCheckout', {
        contents: items.map(item => ({
          content_id: item.id,
          content_type: 'product',
          content_name: item.name
        })),
        value: total,
        currency: 'EUR'
      });
    }
  };

  const trackPurchase = (items: any[], total: number, orderId: string) => {
    if (typeof window.ttq !== 'undefined') {
      window.ttq.track('Purchase', {
        contents: items.map(item => ({
          content_id: item.id,
          content_type: 'product',
          content_name: item.name
        })),
        value: total,
        currency: 'EUR'
      });
      
      window.ttq.track('PlaceAnOrder', {
        contents: items.map(item => ({
          content_id: item.id,
          content_type: 'product',
          content_name: item.name
        })),
        value: total,
        currency: 'EUR'
      });
    }
  };

  const trackAddPaymentInfo = (total: number) => {
    if (typeof window.ttq !== 'undefined') {
      window.ttq.track('AddPaymentInfo', {
        value: total,
        currency: 'EUR'
      });
    }
  };

  return {
    trackViewContent,
    trackAddToCart,
    trackInitiateCheckout,
    trackPurchase,
    trackAddPaymentInfo
  };
};
