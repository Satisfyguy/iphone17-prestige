import { useEffect } from 'react';

interface ProductSchemaProps {
  name: string;
  description: string;
  image: string;
  price: number;
  originalPrice?: number; // Prix original avant promotion
  currency?: string;
  brand?: string;
  sku?: string;
  condition?: string;
  availability?: string;
  url: string;
  validFrom?: string; // Date de début de l'offre
  validThrough?: string; // Date de fin de l'offre
}

export const ProductSchema = ({
  name,
  description,
  image,
  price,
  originalPrice,
  currency = 'EUR',
  brand = 'Apple',
  sku,
  condition = 'NewCondition',
  availability = 'InStock',
  url,
  validFrom,
  validThrough
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
      "offers": originalPrice && originalPrice > price ? [
        // Offre promotionnelle
        {
          "@type": "Offer",
          "url": url,
          "priceCurrency": currency,
          "price": price,
          "priceValidUntil": validThrough,
          "validFrom": validFrom,
          "itemCondition": `https://schema.org/${condition}`,
          "availability": `https://schema.org/${availability}`,
          "seller": {
            "@type": "Organization",
            "name": "TekL∞p"
          },
          "additionalProperty": [
            {
              "@type": "PropertyValue",
              "name": "Promotion",
              "value": "Prix de lancement -20%"
            },
            {
              "@type": "PropertyValue", 
              "name": "Économies",
              "value": `${originalPrice - price}€`
            }
          ]
        },
        // Prix original (pour référence)
        {
          "@type": "Offer",
          "url": url,
          "priceCurrency": currency,
          "price": originalPrice,
          "priceType": "https://schema.org/MSRP",
          "itemCondition": `https://schema.org/${condition}`,
          "availability": `https://schema.org/${availability}`,
          "seller": {
            "@type": "Organization",
            "name": "TekL∞p"
          }
        }
      ] : {
        // Offre normale
        "@type": "Offer",
        "url": url,
        "priceCurrency": currency,
        "price": price,
        "itemCondition": `https://schema.org/${condition}`,
        "availability": `https://schema.org/${availability}`,
        "seller": {
          "@type": "Organization",
          "name": "TekL∞p"
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
