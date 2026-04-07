import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { addGTMEvent } from '@/components/GTMAnalytics';

declare global {
  interface Window {
    dataLayer: any[];
    gtmLoaded?: boolean;
  }
}

// Static function to push events - can be used anywhere
// Now also tracks events locally for the admin dashboard
export const pushGTMEvent = (eventName: string, eventData?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      ...eventData
    });
    
    // Track locally for dashboard analytics
    addGTMEvent({
      event: eventName,
      data: eventData || {},
    });
  }
};

// GTM injection - runs once
const injectGTM = (gtmId: string) => {
  if (window.gtmLoaded) return;
  
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js'
  });

  const script = document.createElement('script');
  script.innerHTML = `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${gtmId}');
  `;
  document.head.insertBefore(script, document.head.firstChild);

  const noscript = document.createElement('noscript');
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`;
  iframe.height = '0';
  iframe.width = '0';
  iframe.style.display = 'none';
  iframe.style.visibility = 'hidden';
  noscript.appendChild(iframe);
  
  if (document.body.firstChild) {
    document.body.insertBefore(noscript, document.body.firstChild);
  } else {
    document.body.appendChild(noscript);
  }

  window.gtmLoaded = true;
  console.log(`GTM initialized with ID: ${gtmId}`);
};

export const useGTM = () => {
  const [gtmId, setGtmId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchGtmId = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'gtm_id')
          .maybeSingle();

        if (error) {
          console.error('Error fetching GTM ID:', error);
          return;
        }

        if (data?.value && data.value.trim() !== '') {
          setGtmId(data.value.trim());
        }
      } catch (error) {
        console.error('Error fetching GTM ID:', error);
      }
    };

    fetchGtmId();
  }, []);

  useEffect(() => {
    if (!gtmId || isLoaded || window.gtmLoaded) return;
    
    injectGTM(gtmId);
    setIsLoaded(true);
  }, [gtmId, isLoaded]);

  return { gtmId, isLoaded, pushEvent: pushGTMEvent };
};

export default useGTM;
