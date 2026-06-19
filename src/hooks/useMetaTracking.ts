declare global {
  interface Window {
    fbq?: (type: string, eventName: string, data?: any) => void;
  }
}

export const useMetaTracking = () => {
  const trackViewContent = (product: {
    id: string | number;
    name: string;
    price: number;
  }) => {
    if (typeof window.fbq !== 'undefined') {
      window.fbq('track', 'ViewContent', {
        content_ids: [String(product.id)],
        content_type: 'product',
        content_name: product.name,
        value: product.price,
        currency: 'EUR'
      });
    }
  };

  const trackAddToCart = (product: {
    id: string | number;
    name: string;
    price: number;
    quantity: number;
  }) => {
    if (typeof window.fbq !== 'undefined') {
      window.fbq('track', 'AddToCart', {
        content_ids: [String(product.id)],
        content_type: 'product',
        content_name: product.name,
        value: product.price * product.quantity,
        currency: 'EUR'
      });
    }
  };

  const trackInitiateCheckout = (items: any[], total: number) => {
    if (typeof window.fbq !== 'undefined') {
      window.fbq('track', 'InitiateCheckout', {
        content_ids: items.map(item => String(item.id || item.product?.id)),
        content_type: 'product',
        value: total,
        currency: 'EUR',
        num_items: items.reduce((sum, item) => sum + (item.quantity || 1), 0)
      });
    }
  };

  const trackPurchase = (items: any[], total: number, orderId: string) => {
    if (typeof window.fbq !== 'undefined') {
      window.fbq('track', 'Purchase', {
        content_ids: items.map(item => String(item.id || item.product?.id)),
        content_type: 'product',
        value: total,
        currency: 'EUR',
        num_items: items.reduce((sum, item) => sum + (item.quantity || 1), 0)
      });
    }
  };

  return {
    trackViewContent,
    trackAddToCart,
    trackInitiateCheckout,
    trackPurchase
  };
};
