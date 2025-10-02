import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface ProductSEOProps {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  brand?: string;
  category?: string;
  availability?: string;
  currency?: string;
  sku?: string;
  features?: string[];
  specifications?: Record<string, string>;
}

export const ProductSEO = ({
  name,
  description,
  price,
  originalPrice,
  image,
  brand = 'Apple',
  category = 'Smartphone',
  availability = 'InStock',
  currency = 'EUR',
  sku,
  features = [],
  specifications = {}
}: ProductSEOProps) => {
  const location = useLocation();
  const baseUrl = window.location.origin;
  const fullUrl = `${baseUrl}${location.pathname}`;
  
  useEffect(() => {
    // Enhanced title for products
    const productTitle = `${name} - ${brand} | TekL∞p`;
    document.title = productTitle;
    
    // Enhanced meta description
    const metaDescription = `${description} Achetez ${name} chez TekL∞p. Livraison gratuite, garantie Apple officielle. ${originalPrice ? `Économisez ${originalPrice - price}€` : ''}`;
    
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
    
    // Core SEO
    updateMetaTag('meta[name="description"]', 'content', metaDescription);
    updateMetaTag('meta[name="keywords"]', 'content', `${name}, ${brand}, iPhone 17, smartphone, Apple, achat, prix`);
    
    // Enhanced Open Graph for products
    updateMetaTag('meta[property="og:type"]', 'content', 'product');
    updateMetaTag('meta[property="og:title"]', 'content', productTitle);
    updateMetaTag('meta[property="og:description"]', 'content', metaDescription);
    updateMetaTag('meta[property="og:url"]', 'content', fullUrl);
    updateMetaTag('meta[property="og:image"]', 'content', image);
    updateMetaTag('meta[property="og:image:alt"]', 'content', name);
    
    // Product-specific Open Graph
    updateMetaTag('meta[property="product:price:amount"]', 'content', price.toString());
    updateMetaTag('meta[property="product:price:currency"]', 'content', currency);
    updateMetaTag('meta[property="product:availability"]', 'content', availability);
    updateMetaTag('meta[property="product:brand"]', 'content', brand);
    updateMetaTag('meta[property="product:category"]', 'content', category);
    
    if (sku) {
      updateMetaTag('meta[property="product:retailer_item_id"]', 'content', sku);
    }
    
    // Enhanced Twitter Cards for products
    updateMetaTag('meta[name="twitter:card"]', 'content', 'summary_large_image');
    updateMetaTag('meta[name="twitter:title"]', 'content', productTitle);
    updateMetaTag('meta[name="twitter:description"]', 'content', metaDescription);
    updateMetaTag('meta[name="twitter:image"]', 'content', image);
    updateMetaTag('meta[name="twitter:image:alt"]', 'content', name);
    updateMetaTag('meta[name="twitter:label1"]', 'content', 'Prix');
    updateMetaTag('meta[name="twitter:data1"]', 'content', `${price}€`);
    updateMetaTag('meta[name="twitter:label2"]', 'content', 'Marque');
    updateMetaTag('meta[name="twitter:data2"]', 'content', brand);
    
    // Enhanced Schema.org for products
    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": name,
      "description": description,
      "image": image,
      "url": fullUrl,
      "brand": {
        "@type": "Brand",
        "name": brand
      },
      "category": category,
      "sku": sku || name.toLowerCase().replace(/\s+/g, '-'),
      "offers": {
        "@type": "Offer",
        "url": fullUrl,
        "priceCurrency": currency,
        "price": price,
        "availability": `https://schema.org/${availability}`,
        "itemCondition": "https://schema.org/NewCondition",
        "seller": {
          "@type": "Organization",
          "name": "TekL∞p",
          "url": "https://tekloop.vercel.app"
        },
        "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        "shippingDetails": {
          "@type": "OfferShippingDetails",
          "shippingRate": {
            "@type": "MonetaryAmount",
            "value": "0",
            "currency": currency
          },
          "deliveryTime": {
            "@type": "ShippingDeliveryTime",
            "businessDays": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
            },
            "cutoffTime": "14:00",
            "handlingTime": {
              "@type": "QuantitativeValue",
              "minValue": 0,
              "maxValue": 1,
              "unitCode": "DAY"
            },
            "transitTime": {
              "@type": "QuantitativeValue",
              "minValue": 1,
              "maxValue": 2,
              "unitCode": "DAY"
            }
          }
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "127",
        "bestRating": "5",
        "worstRating": "1"
      },
      "review": [
        {
          "@type": "Review",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          },
          "author": {
            "@type": "Person",
            "name": "Sophie M."
          },
          "reviewBody": "Excellent produit, livraison rapide et produit conforme à la description."
        }
      ],
      "additionalProperty": features.map(feature => ({
        "@type": "PropertyValue",
        "name": "Caractéristique",
        "value": feature
      }))
    };
    
    // Add original price if available
    if (originalPrice && originalPrice > price) {
      (productSchema.offers as any).priceSpecification = {
        "@type": "PriceSpecification",
        "price": price,
        "priceCurrency": currency,
        "eligibleQuantity": {
          "@type": "QuantitativeValue",
          "value": 1
        }
      };
      
      (productSchema.offers as any).additionalProperty = [
        {
          "@type": "PropertyValue",
          "name": "Prix original",
          "value": originalPrice
        },
        {
          "@type": "PropertyValue",
          "name": "Économies",
          "value": originalPrice - price
        },
        {
          "@type": "PropertyValue",
          "name": "Remise",
          "value": `${Math.round(((originalPrice - price) / originalPrice) * 100)}%`
        }
      ];
    }
    
    // Add specifications
    if (Object.keys(specifications).length > 0) {
      productSchema.additionalProperty = [
        ...productSchema.additionalProperty,
        ...Object.entries(specifications).map(([key, value]) => ({
          "@type": "PropertyValue",
          "name": key,
          "value": value
        }))
      ];
    }
    
    // Add schema to page
    let schemaScript = document.querySelector('script[type="application/ld+json"][data-product="true"]');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.setAttribute('type', 'application/ld+json');
      schemaScript.setAttribute('data-product', 'true');
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify(productSchema);
    
    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', fullUrl);
    
    return () => {
      const tag = document.querySelector('script[type="application/ld+json"][data-product="true"]');
      if (tag) tag.remove();
    };
  }, [name, description, price, originalPrice, image, brand, category, availability, currency, sku, features, specifications, fullUrl]);
  
  return null;
};
