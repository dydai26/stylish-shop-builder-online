import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { GOOGLE_ANALYTICS_ID } from '@/lib/constants';

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js',
      targetId: string,
      config?: Record<string, any>
    ) => void;
    fbq?: (type: string, eventName: string, data?: any) => void;
  }
}

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change for GA
    if (typeof window.gtag === 'function') {
      window.gtag('config', GOOGLE_ANALYTICS_ID, {
        page_path: location.pathname + location.search,
        page_title: location.pathname, // Sets the "Screen Name" to the path like '/' or '/shop' for clean Realtime reports
      });
      
      console.log('GA page view tracked:', location.pathname);
    }

    // Track page view on route change for Meta Pixel
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'PageView');
      console.log('Meta page view tracked:', location.pathname);
    }
  }, [location]);
};