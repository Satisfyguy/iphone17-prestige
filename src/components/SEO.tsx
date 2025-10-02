import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  type?: 'website' | 'product' | 'article';
}

export const SEO = ({ 
  title, 
  description, 
  keywords, 
  ogImage = 'https://lovable.dev/opengraph-image-p98pqg.png',
  canonical,
  type = 'website'
}: SEOProps) => {
  const location = useLocation();
  const baseUrl = window.location.origin;
  const fullUrl = canonical || `${baseUrl}${location.pathname}`;
  
  useEffect(() => {
    // Update title
    document.title = title;
    
    // Update meta tags
    const updateMetaTag = (selector: string, attribute: string, value: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        if (selector.includes('property')) {
          element.setAttribute('property', selector.replace('meta[property="', '').replace('"]', ''));
        } else {
          element.setAttribute('name', selector.replace('meta[name="', '').replace('"]', ''));
        }
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, value);
    };
    
    updateMetaTag('meta[name="description"]', 'content', description);
    
    if (keywords) {
      updateMetaTag('meta[name="keywords"]', 'content', keywords);
    }
    
    // Open Graph
    updateMetaTag('meta[property="og:title"]', 'content', title);
    updateMetaTag('meta[property="og:description"]', 'content', description);
    updateMetaTag('meta[property="og:type"]', 'content', type);
    updateMetaTag('meta[property="og:url"]', 'content', fullUrl);
    updateMetaTag('meta[property="og:image"]', 'content', ogImage);
    
    // Twitter Card
    updateMetaTag('meta[name="twitter:title"]', 'content', title);
    updateMetaTag('meta[name="twitter:description"]', 'content', description);
    updateMetaTag('meta[name="twitter:image"]', 'content', ogImage);
    
    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', fullUrl);
    
  }, [title, description, keywords, ogImage, fullUrl, type]);
  
  return null;
};
