import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface EnhancedSEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  type?: 'website' | 'product' | 'article' | 'store';
  price?: number;
  currency?: string;
  availability?: string;
  brand?: string;
  category?: string;
}

export const EnhancedSEO = ({ 
  title, 
  description, 
  keywords, 
  ogImage = 'https://tekloop.vercel.app/iphone-17-colors.webp',
  canonical,
  type = 'website',
  price,
  currency = 'EUR',
  availability = 'InStock',
  brand = 'Apple',
  category = 'Smartphone'
}: EnhancedSEOProps) => {
  const location = useLocation();
  const baseUrl = window.location.origin;
  const fullUrl = canonical || `${baseUrl}${location.pathname}`;
  
  useEffect(() => {
    // Update title with brand consistency
    document.title = `${title} | TekL∞p`;
    
    // Enhanced meta tags for 2025 SEO
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
    
    // Core SEO tags
    updateMetaTag('meta[name="description"]', 'content', description);
    updateMetaTag('meta[name="keywords"]', 'content', keywords || '');
    
    // Enhanced Open Graph for 2025
    updateMetaTag('meta[property="og:title"]', 'content', title);
    updateMetaTag('meta[property="og:description"]', 'content', description);
    updateMetaTag('meta[property="og:type"]', 'content', type);
    updateMetaTag('meta[property="og:url"]', 'content', fullUrl);
    updateMetaTag('meta[property="og:image"]', 'content', ogImage);
    updateMetaTag('meta[property="og:image:alt"]', 'content', title);
    updateMetaTag('meta[property="og:updated_time"]', 'content', new Date().toISOString());
    
    // Enhanced Twitter Cards
    updateMetaTag('meta[name="twitter:title"]', 'content', title);
    updateMetaTag('meta[name="twitter:description"]', 'content', description);
    updateMetaTag('meta[name="twitter:image"]', 'content', ogImage);
    updateMetaTag('meta[name="twitter:image:alt"]', 'content', title);
    
    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', fullUrl);
    
    // Enhanced Schema.org for 2025
    const generateSchema = () => {
      const baseSchema = {
        "@context": "https://schema.org",
        "@type": type === 'product' ? 'Product' : 'WebPage',
        "name": title,
        "description": description,
        "url": fullUrl,
        "publisher": {
          "@type": "Organization",
          "name": "TekL∞p",
          "url": "https://tekloop.vercel.app",
          "logo": {
            "@type": "ImageObject",
            "url": "https://tekloop.vercel.app/favicon.svg"
          }
        }
      };

      if (type === 'product' && price) {
        return {
          ...baseSchema,
          "@type": "Product",
          "brand": {
            "@type": "Brand",
            "name": brand
          },
          "category": category,
          "offers": {
            "@type": "Offer",
            "url": fullUrl,
            "priceCurrency": currency,
            "price": price,
            "availability": `https://schema.org/${availability}`,
            "seller": {
              "@type": "Organization",
              "name": "TekL∞p"
            },
            "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "127",
            "bestRating": "5",
            "worstRating": "1"
          }
        };
      }

      if (type === 'store') {
        return {
          ...baseSchema,
          "@type": "Store",
          "name": "TekL∞p Store",
          "description": "Boutique en ligne spécialisée dans l'iPhone 17",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "FR",
            "addressRegion": "France"
          },
          "telephone": "+33-1-XX-XX-XX-XX",
          "openingHours": "Mo-Fr 09:00-18:00",
          "paymentAccepted": ["Credit Card", "PayPal", "USDT"],
          "currenciesAccepted": "EUR"
        };
      }

      return baseSchema;
    };

    // Add enhanced schema
    let schemaScript = document.querySelector('script[type="application/ld+json"][data-enhanced="true"]');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.setAttribute('type', 'application/ld+json');
      schemaScript.setAttribute('data-enhanced', 'true');
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify(generateSchema());
    
    return () => {
      const tag = document.querySelector('script[type="application/ld+json"][data-enhanced="true"]');
      if (tag) tag.remove();
    };
  }, [title, description, keywords, ogImage, fullUrl, type, price, currency, availability, brand, category]);
  
  return null;
};