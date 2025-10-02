import { useEffect } from 'react';

interface ProductSchemaProps {
  name: string;
  description: string;
  image: string;
  price: number;
  currency?: string;
  brand?: string;
  sku?: string;
  condition?: string;
  availability?: string;
  url: string;
}

export const ProductSchema = ({
  name,
  description,
  image,
  price,
  currency = 'EUR',
  brand = 'Apple',
  sku,
  condition = 'NewCondition',
  availability = 'InStock',
  url
}: ProductSchemaProps) => {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": name,
      "description": description,
      "image": image,
      "brand": {
        "@type": "Brand",
        "name": brand
      },
      "offers": {
        "@type": "Offer",
        "url": url,
        "priceCurrency": currency,
        "price": price,
        "itemCondition": `https://schema.org/${condition}`,
        "availability": `https://schema.org/${availability}`,
        "seller": {
          "@type": "Organization",
          "name": "TechLoop"
        }
      }
    };
    
    if (sku) {
      schema["sku"] = sku;
    }
    
    // Add aggregate rating (mock data - replace with real reviews if available)
    schema["aggregateRating"] = {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    };
    
    let scriptTag = document.querySelector('script[type="application/ld+json"][data-schema="product"]');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      scriptTag.setAttribute('data-schema', 'product');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(schema);
    
    return () => {
      const tag = document.querySelector('script[type="application/ld+json"][data-schema="product"]');
      if (tag) tag.remove();
    };
  }, [name, description, image, price, currency, brand, sku, condition, availability, url]);
  
  return null;
};
