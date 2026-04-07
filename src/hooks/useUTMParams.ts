import { useEffect, useState } from 'react';

export interface UTMParams {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
}

export const useUTMParams = (): UTMParams => {
  const [utmParams, setUtmParams] = useState<UTMParams>({
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_term: '',
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    setUtmParams({
      utm_source: params.get('utm_source') || '',
      utm_medium: params.get('utm_medium') || '',
      utm_campaign: params.get('utm_campaign') || '',
      utm_term: params.get('utm_term') || '',
    });
  }, []);

  return utmParams;
};
