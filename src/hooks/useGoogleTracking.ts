declare global {
  interface Window {
    gtag?: (command: string, action: string, params?: any) => void;
  }
}

export const useGoogleTracking = () => {
  const trackViewItem = (product: {
    id: string | number;
    name: string;
    price: number;
    category?: string;
  }) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'view_item', {
        currency: 'EUR',
        value: product.price,
        items: [
          {
            item_id: String(product.id),
            item_name: product.name,
            price: product.price,
            item_category: product.category || 'Products',
            quantity: 1
          }
        ]
      });
    }
  };

  const trackAddToCart = (product: {
    id: string | number;
    name: string;
    price: number;
    category?: string;
    quantity: number;
  }) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'add_to_cart', {
        currency: 'EUR',
        value: product.price * product.quantity,
        items: [
          {
            item_id: String(product.id),
            item_name: product.name,
            price: product.price,
            item_category: product.category || 'Products',
            quantity: product.quantity
          }
        ]
      });
    }
  };

  const trackBeginCheckout = (items: any[], total: number) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'begin_checkout', {
        currency: 'EUR',
        value: total,
        items: items.map(item => ({
          item_id: String(item.id || item.product?.id),
          item_name: item.name || item.product?.name,
          price: item.price || item.product?.price,
          item_category: item.category || item.product?.category || 'Products',
          quantity: item.quantity || 1
        }))
      });
    }
  };

  const trackPurchase = (items: any[], total: number, orderId: string) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'purchase', {
        transaction_id: orderId,
        currency: 'EUR',
        value: total,
        items: items.map(item => ({
          item_id: String(item.id || item.product?.id),
          item_name: item.name || item.product?.name,
          price: item.price || item.product?.price,
          item_category: item.category || item.product?.category || 'Products',
          quantity: item.quantity || 1
        }))
      });
    }
  };

  return {
    trackViewItem,
    trackAddToCart,
    trackBeginCheckout,
    trackPurchase
  };
};
