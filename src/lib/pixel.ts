// src/lib/pixel.ts

// @ts-nocheck
// Disable TypeScript checking for this file

// Your Pixel ID from Meta
export const PIXEL_ID = '1101079519009530';

// Initialize the pixel
export const initPixel = () => {
  if (typeof window === 'undefined') return;
  
  // Check if pixel is already loaded
  if (window.fbq) return;
  
  // Load Facebook Pixel script
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  
  // Initialize with your pixel ID
  window.fbq('init', PIXEL_ID);
};

// Track events
export const trackEvent = (eventName, parameters) => {
  if (typeof window === 'undefined' || !window.fbq) return;
  window.fbq('track', eventName, parameters);
};

// Standard events for your app
export const track = {
  pageView: () => {
    trackEvent('PageView');
  },
  
  viewContent: (story) => {
    trackEvent('ViewContent', {
      content_ids: [story.id],
      content_name: story.title,
      content_type: 'product',
      value: story.price,
      currency: 'TZS',
      content_category: story.category || 'Story',
    });
  },
  
  initiateCheckout: (story) => {
    trackEvent('InitiateCheckout', {
      content_ids: [story.id],
      content_name: story.title,
      content_type: 'product',
      value: story.price,
      currency: 'TZS',
      num_items: 1,
    });
  },
  
  purchase: (story) => {
    trackEvent('Purchase', {
      content_ids: [story.id],
      content_name: story.title,
      content_type: 'product',
      value: story.price,
      currency: 'TZS',
      num_items: 1,
    });
  },
  
  lockedEpisodeClick: (story) => {
    trackEvent('Lead', {
      content_name: story.title,
      episode_number: story.episodeNumber,
      story_id: story.id,
    });
  },
  
  startReading: (story) => {
    trackEvent('StartTrial', {
      content_ids: [story.id],
      content_name: story.title,
      episode_number: story.episodeNumber,
    });
  },
};